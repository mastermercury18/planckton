#!/usr/bin/env python3
"""
qiskit_rag_system_linklist_v3.py

Docs-first Qiskit RAG system with a HARD retrieval gate + retrieval robustness fixes.

What changed vs v2 (key fixes for "it's in the JSON but not retrieved"):
- Normalizes scraped text (re-joins "from\\nqiskit\\nimport" -> "from qiskit import", collapses whitespace)
- Indexes section code_blocks as *separate* chunks (docs like noise models are code-heavy)
- Increases recall (larger top_k for retrieval + context building)
- Adds lexical fallback for high-signal Qiskit tokens (NoiseModel, AerSimulator, etc.)
- Optional retrieval debug logging via env var RAG_DEBUG=1

Env:
  OPENAI_API_KEY (required)
  OPENAI_MODEL (default: gpt-4o-mini)
  QISKIT_DOCS_JSON (default: comprehensive_qiskit_docs.json)
  QISKIT_ALLOWLIST (default: qiskit_official_links.txt)
  RAG_DEBUG=1 to print retrieved URLs/scores
"""

from __future__ import annotations

import json
import os
import re
from dataclasses import dataclass
from typing import Dict, List, Optional, Tuple

import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

import openai


STRICT_SYSTEM_PROMPT = """You are a Qiskit coding assistant targeting the CURRENT Qiskit APIs described in the provided DOCUMENTATION CONTEXT.

STRICT MODE RULES (must follow):
- You MUST use ONLY the provided DOCUMENTATION CONTEXT as your source of truth.
- Do NOT use older/deprecated Qiskit APIs unless the context explicitly shows them.
- If the user asks for something that is NOT supported by the provided context, say: "Not found in provided docs context." Then ask ONE short clarifying question or suggest what doc page/keyword to retrieve.
- When you output code, prefer exact imports/classes/functions shown in the context.
- Include the relevant source URL(s) from the context in a short "Sources:" list at the end.
"""

FALLBACK_SYSTEM_PROMPT = """You are a Qiskit coding assistant.

FALLBACK MODE RULES:
- Use your general knowledge to help the user.
- If you're uncertain about whether an API is current, say so and propose a safe modern default.
- Prefer modern Qiskit patterns (AerSimulator, primitives, etc.) when applicable.
"""

AMBIGUOUS_SYSTEM_PROMPT = """You are a Qiskit coding assistant targeting the CURRENT Qiskit APIs described in the provided DOCUMENTATION CONTEXT.

AMBIGUOUS MODE:
- Use the provided DOCUMENTATION CONTEXT as primary source.
- If the context seems partially relevant but insufficient, ask one clarifying question before writing code, OR explicitly state what you cannot confirm from context.
- Include source URL(s) if you provide an answer.
"""


def _strip_quotes(s: str) -> str:
    s = s.strip()
    if len(s) >= 2 and ((s[0] == s[-1]) and s[0] in ("'", '"')):
        return s[1:-1]
    return s


def _normalize_url(u: str) -> str:
    """Normalize URLs so allowlist matching isn't broken by trivial differences."""
    if not u:
        return ""
    u = _strip_quotes(u.strip())
    u = u.split("#", 1)[0]  # drop anchors
    if u.endswith("/"):
        u = u[:-1]
    return u


def load_allowlist(path: str) -> set[str]:
    allow: set[str] = set()
    if not path or not os.path.exists(path):
        return allow
    with open(path, "r", encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if not line:
                continue
            allow.add(_normalize_url(line))
    return allow


def normalize_text(s: str) -> str:
    """Normalize scraped text for retrieval (especially code blocks with token-per-line artifacts)."""
    if not s:
        return ""
    # Re-join a common artifact: tokens split by newlines between word chars
    s = re.sub(r"(?<=\w)\n(?=\w)", " ", s)
    # Collapse whitespace
    s = re.sub(r"[ \t\r\f\v]+", " ", s)
    s = re.sub(r"\n{2,}", "\n", s)
    return s.strip()


@dataclass
class DocChunk:
    chunk_id: str
    source_url: str
    page_title: str
    heading: str
    level: int
    text: str
    fetched_at: str


class QiskitRAGSystem:
    def __init__(
        self,
        docs_file: str = "comprehensive_qiskit_docs.json",
        allowlist_file: str = "qiskit_official_links.txt",
        strict_threshold: float = 0.16,
        fallback_threshold: float = 0.10,
        search_top_k: int = 20,
        context_top_k: int = 15,
    ):
        self.docs_file = docs_file
        self.allowlist_file = allowlist_file
        self.allowlist = load_allowlist(allowlist_file)

        # thresholds for the hard gate
        self.strict_threshold = strict_threshold
        self.fallback_threshold = fallback_threshold

        # recall tuning
        self.search_top_k = search_top_k
        self.context_top_k = context_top_k

        self._raw_docs: List[Dict] = []
        self.chunks: List[DocChunk] = []

        self.vectorizer: Optional[TfidfVectorizer] = None
        self.chunk_vectors = None

        self._load_docs()
        self._build_chunks()
        self._create_search_vectors()

    def _load_docs(self) -> None:
        with open(self.docs_file, "r", encoding="utf-8") as f:
            data = json.load(f)

        docs = data.get("docs") or data.get("documentation") or (data if isinstance(data, list) else [])
        if not isinstance(docs, list):
            docs = []

        if self.allowlist:
            filtered = []
            for d in docs:
                u = _normalize_url(d.get("url", ""))
                if u in self.allowlist:
                    d["url"] = u
                    filtered.append(d)
            docs = filtered

        self._raw_docs = docs
        print(f"Loaded {len(self._raw_docs)} documentation pages (allowlist enforced={bool(self.allowlist)})")

    def _build_chunks(self) -> None:
        chunks: List[DocChunk] = []

        for i, d in enumerate(self._raw_docs):
            url = _normalize_url(d.get("url", ""))
            title = (d.get("title") or "").strip()
            fetched_at = (d.get("fetched_at") or "").strip()

            sections = d.get("sections") or []
            if isinstance(sections, list) and sections:
                for j, s in enumerate(sections):
                    heading = (s.get("heading") or "").strip()
                    level = int(s.get("level") or 6)
                    text = (s.get("text") or "").strip()

                    if text:
                        enriched = normalize_text(f"{title}\\n{heading}\\n{text}")
                        if enriched:
                            chunks.append(
                                DocChunk(
                                    chunk_id=f"{i}:{j}",
                                    source_url=url,
                                    page_title=title,
                                    heading=heading,
                                    level=level,
                                    text=enriched,
                                    fetched_at=fetched_at,
                                )
                            )

                    # Index code blocks as separate chunks
                    code_blocks = s.get("code_blocks") or []
                    if isinstance(code_blocks, list) and code_blocks:
                        for k, cb in enumerate(code_blocks):
                            cb_norm = normalize_text(cb or "")
                            if len(cb_norm) < 40:
                                continue
                            code_enriched = normalize_text(f"{title}\\n{heading}\\nCODE:\\n{cb_norm}")
                            chunks.append(
                                DocChunk(
                                    chunk_id=f"{i}:{j}:code:{k}",
                                    source_url=url,
                                    page_title=title,
                                    heading=f"{heading} (code)",
                                    level=level,
                                    text=code_enriched,
                                    fetched_at=fetched_at,
                                )
                            )
            else:
                page_text = (d.get("text") or "").strip()
                enriched = normalize_text(f"{title}\\n{page_text}")
                if enriched:
                    chunks.append(
                        DocChunk(
                            chunk_id=f"{i}:page",
                            source_url=url,
                            page_title=title,
                            heading=title or "Page",
                            level=1,
                            text=enriched,
                            fetched_at=fetched_at,
                        )
                    )

        self.chunks = chunks
        print(f"Built {len(self.chunks)} chunks (sections + code blocks)")

    def _create_search_vectors(self) -> None:
        if not self.chunks:
            print("Warning: no chunks available; retrieval disabled.")
            return

        self.vectorizer = TfidfVectorizer(
            stop_words="english",
            max_features=70000,
            ngram_range=(1, 2),
        )
        texts = [normalize_text(c.text) for c in self.chunks]
        self.chunk_vectors = self.vectorizer.fit_transform(texts)
        print(f"Created TF-IDF vectors for {len(texts)} chunks")

    def _expand_query(self, query: str) -> str:
        q = query or ""
        ql = q.lower()
        expanded = q

        if "aer" in ql or "simulator" in ql:
            expanded += " AerSimulator qiskit_aer backend simulation"
        if "noise" in ql:
            expanded += " NoiseModel qiskit_aer.noise depolarizing_error thermal_relaxation_error pauli_error ReadoutError QuantumError add_all_qubit_quantum_error add_quantum_error"
        if "vqe" in ql or "variational quantum eigensolver" in ql:
            expanded += " variational quantum eigensolver minimum eigenvalue optimization estimator sampler"
        if "primitive" in ql or "primitives" in ql:
            expanded += " estimator sampler primitives"
        return expanded

    def search(self, query: str, top_k: Optional[int] = None) -> List[Dict]:
        if not self.vectorizer or self.chunk_vectors is None or not self.chunks:
            return []

        if top_k is None:
            top_k = self.search_top_k

        expanded = self._expand_query(query)
        qv = self.vectorizer.transform([normalize_text(expanded)])
        sims = cosine_similarity(qv, self.chunk_vectors).flatten()
        top_idx = np.argsort(sims)[::-1][:top_k]

        results: List[Dict] = []
        for idx in top_idx:
            c = self.chunks[idx]
            results.append(
                {
                    "chunk_id": c.chunk_id,
                    "source_url": c.source_url,
                    "page_title": c.page_title,
                    "heading": c.heading,
                    "level": c.level,
                    "text": c.text,
                    "relevance_score": float(sims[idx]),
                }
            )
        return results

    def lexical_fallback(self, query: str, max_hits: int = 10) -> List[Dict]:
        ql = (query or "").lower()
        needles: List[str] = []

        if "noise" in ql:
            needles += [
                "noisemodel",
                "depolarizing_error",
                "thermal_relaxation_error",
                "pauli_error",
                "readouterror",
                "quantumerror",
                "add_all_qubit_quantum_error",
                "add_quantum_error",
            ]
        if "aer" in ql or "simulator" in ql:
            needles += ["aersimulator", "qiskit_aer", "qiskit_aer.noise"]

        if not needles:
            return []

        hits: List[Dict] = []
        for c in self.chunks:
            t = (c.text or "").lower()
            if any(n in t for n in needles):
                hits.append(
                    {
                        "chunk_id": c.chunk_id,
                        "source_url": c.source_url,
                        "page_title": c.page_title,
                        "heading": c.heading,
                        "level": c.level,
                        "text": c.text,
                        "relevance_score": 0.0,
                    }
                )
                if len(hits) >= max_hits:
                    break
        return hits

    def doc_coverage(self, query: str, top_k: Optional[int] = None) -> Tuple[float, List[Dict]]:
        results = self.search(query, top_k=top_k)
        best = max((r["relevance_score"] for r in results), default=0.0)

        if best < self.fallback_threshold:
            lex = self.lexical_fallback(query, max_hits=10)
            if lex:
                return max(best, self.fallback_threshold + 0.01), lex

        return best, results

    def decide_mode(self, query: str) -> Tuple[str, float, List[Dict]]:
        score, results = self.doc_coverage(query, top_k=self.search_top_k)
        if score >= self.strict_threshold:
            return "strict", score, results
        if score < self.fallback_threshold:
            return "fallback", score, results
        return "ambiguous", score, results

    def get_context_for_query(self, query: str, max_chars: int = 6500, top_k: Optional[int] = None) -> str:
        if top_k is None:
            top_k = self.context_top_k

        _, results = self.doc_coverage(query, top_k=top_k)
        if not results:
            return ""

        parts: List[str] = []
        used = 0
        for r in results:
            snippet = (r["text"] or "").strip()
            if len(snippet) > 1800:
                snippet = snippet[:1800].rstrip() + "…"

            block = (
                f"- URL: {r['source_url']}\\n"
                f"  Title: {r.get('page_title','')}\\n"
                f"  Section: {r.get('heading','')}\\n"
                f"  Relevance: {r['relevance_score']:.3f}\\n"
                f"  Snippet:\\n{snippet}\\n"
            )
            if used + len(block) > max_chars:
                break
            parts.append(block)
            used += len(block)

        return "\\n".join(parts).strip()

    DEPRECATED_PATTERNS = [
        (re.compile(r"^\s*from\s+qiskit\s+import\s+Aer\s*$", re.MULTILINE), "from qiskit_aer import AerSimulator  # updated\\n"),
        (re.compile(r"\bAer\.get_backend\(", re.MULTILINE), "AerSimulator("),
    ]

    def lint_and_rewrite(self, text: str) -> Tuple[str, List[str]]:
        warnings: List[str] = []
        out = text
        for pat, repl in self.DEPRECATED_PATTERNS:
            if pat.search(out):
                warnings.append(f"Rewrote deprecated pattern: {pat.pattern}")
                out = pat.sub(repl, out)
        return out, warnings


class EnhancedPlancktonHandler:
    def __init__(self, rag_system: QiskitRAGSystem):
        self.rag_system = rag_system
        self.client = openai.OpenAI()
        self.debug = os.environ.get("RAG_DEBUG", "").strip().lower() in ("1", "true", "yes")

    def _build_messages(self, user_message: str, history: List[Dict]) -> Tuple[List[Dict], str, float]:
        mode, score, results = self.rag_system.decide_mode(user_message)

        if self.debug:
            print("\\n[RAG_DEBUG] MODE:", mode, "SCORE:", f"{score:.3f}")
            for r in results[:8]:
                print("[RAG_DEBUG]", f"{r['relevance_score']:.3f}", r["source_url"], "|", r["heading"])

        if mode == "strict":
            system = STRICT_SYSTEM_PROMPT
        elif mode == "fallback":
            system = FALLBACK_SYSTEM_PROMPT
        else:
            system = AMBIGUOUS_SYSTEM_PROMPT

        messages: List[Dict] = [{"role": "system", "content": system}]

        for msg in history[-4:]:
            role = "assistant" if msg.get("sender") == "planckton" else "user"
            txt = msg.get("text", "")
            if txt:
                messages.append({"role": role, "content": txt})

        if mode in ("strict", "ambiguous"):
            context = self.rag_system.get_context_for_query(user_message)
            if context:
                messages.append({"role": "user", "content": f"DOCUMENTATION CONTEXT (from allowlisted Qiskit docs):\\n{context}"})

        messages.append({"role": "user", "content": user_message})
        return messages, mode, score

    def process_message(self, message: str, history: List[Dict]) -> str:
        messages, mode, _ = self._build_messages(message, history)

        model = os.environ.get("OPENAI_MODEL", "gpt-4o-mini")
        temperature = 0.2 if mode == "strict" else (0.3 if mode == "ambiguous" else 0.7)

        resp = self.client.chat.completions.create(
            model=model,
            messages=messages,
            temperature=temperature,
            max_completion_tokens=1200,
        )
        out = resp.choices[0].message.content or ""

        rewritten, warnings = self.rag_system.lint_and_rewrite(out)
        if warnings and rewritten != out:
            rewritten += "\\n\\n(Note: I auto-updated some deprecated Aer import/usage patterns.)"
        return rewritten


def test_rag_system() -> None:
    docs_file = os.environ.get("QISKIT_DOCS_JSON", "comprehensive_qiskit_docs.json")
    allow_file = os.environ.get("QISKIT_ALLOWLIST", "qiskit_official_links.txt")

    rag = QiskitRAGSystem(docs_file=docs_file, allowlist_file=allow_file)

    test_queries = [
        "How do I create a noise model for AerSimulator in Qiskit?",
        "Build a noise model using depolarizing_error and run on AerSimulator.",
        "Initialize a NoiseModel from backend calibration data.",
    ]

    for q in test_queries:
        mode, score, results = rag.decide_mode(q)
        print(f"\\nQuery: {q}\\nMode: {mode} (score={score:.3f})")
        for r in results[:5]:
            print(f"  {r['relevance_score']:.3f} | {r['source_url']} | {r['heading']}")
        ctx = rag.get_context_for_query(q)
        print(f"Context chars: {len(ctx)}")
        print(ctx[:500] + ("..." if len(ctx) > 500 else ""))


if __name__ == "__main__":
    test_rag_system()
