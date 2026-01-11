#!/usr/bin/env python3
"""
qiskit_docs_scraper_linklist.py

Link-driven Qiskit documentation fetcher for building a RAG corpus.

- No crawling/discovery. Consumes a precomputed URL list (one per line).
- Downloads each URL, extracts readable text + sections + code blocks.
- Writes a JSON corpus compatible with qiskit_rag_system_linklist.py.

Input:
- A text file containing Qiskit doc URLs (quoted or unquoted), one per line.

Output JSON schema:
{
  "meta": {...},
  "docs": [
     {"url","title","text","sections","fetched_at","status_code","content_type","metadata"}
  ]
}
"""

from __future__ import annotations

import argparse
import json
import os
import re
import sys
import time
from dataclasses import dataclass
from datetime import datetime
from typing import Any, Dict, List, Optional, Tuple
from urllib.parse import urldefrag, urlparse

import requests
from bs4 import BeautifulSoup

UA = os.environ.get(
    "QISKIT_SCRAPER_UA",
    "Mozilla/5.0 (compatible; qiskit-docs-link-fetcher/1.0)",
)

BINARY_EXTS = (
    ".png", ".jpg", ".jpeg", ".gif", ".webp", ".svg",
    ".pdf", ".zip", ".tar", ".gz", ".tgz", ".bz2", ".7z",
    ".whl", ".exe", ".dmg",
)

DEFAULT_ALLOW_DOMAINS = [
    "quantum.cloud.ibm.com",
    "qiskit.org",
    "qiskit.github.io",
    "qiskit-community.github.io",
    "ibm.github.io",
    "docs.quantum.ibm.com",
    "raw.githubusercontent.com",  # optional (only if present in your list)
]

def now_iso() -> str:
    return datetime.utcnow().replace(microsecond=0).isoformat() + "Z"

def canonicalize_url(url: str) -> str:
    url = (url or "").strip()
    if not url:
        return ""
    url, _ = urldefrag(url)
    return url.strip()

def domain_of(url: str) -> str:
    try:
        return urlparse(url).netloc.lower()
    except Exception:
        return ""

def within_allowlist(url: str, allow_domains: List[str]) -> bool:
    d = domain_of(url)
    if not d:
        return False
    for a in allow_domains:
        if d == a or d.endswith("." + a):
            return True
    return False

def is_probably_binary(url: str) -> bool:
    path = urlparse(url).path.lower()
    return path.endswith(BINARY_EXTS)

def looks_like_notebook(url: str) -> bool:
    return urlparse(url).path.lower().endswith(".ipynb")

def looks_like_markdown(url: str) -> bool:
    return urlparse(url).path.lower().endswith((".md", ".markdown"))

def safe_text(s: str) -> str:
    s = s.replace("\u00a0", " ")
    s = re.sub(r"[ \t]+\n", "\n", s)
    s = re.sub(r"\n[ \t]+", "\n", s)
    s = re.sub(r"\n{3,}", "\n\n", s)
    s = re.sub(r"[ \t]{2,}", "  ", s)
    return s.strip()

def parse_url_list(path: str) -> List[str]:
    """
    Accepts:
      https://...
      "https://..."
    Dedupes while preserving order.
    """
    p = os.path.expanduser(path)
    with open(p, "r", encoding="utf-8", errors="ignore") as f:
        raw_lines = [ln.strip() for ln in f.read().splitlines()]

    urls: List[str] = []
    seen = set()
    for ln in raw_lines:
        if not ln:
            continue
        if (ln.startswith('"') and ln.endswith('"')) or (ln.startswith("'") and ln.endswith("'")):
            ln = ln[1:-1].strip()
        ln = canonicalize_url(ln)
        if not ln:
            continue
        if ln not in seen:
            seen.add(ln)
            urls.append(ln)
    return urls

def extract_text_and_sections_from_html(html: str) -> Tuple[str, List[Dict[str, Any]], str]:
    soup = BeautifulSoup(html, "html.parser")

    for tag in soup(["script", "style", "noscript", "header", "footer", "nav", "aside"]):
        tag.decompose()

    title = ""
    if soup.title and soup.title.string:
        title = safe_text(soup.title.string)

    main = soup.find("main") or soup.find("article") or soup.body or soup

    headings = main.find_all(re.compile(r"^h[1-6]$"))
    if not headings:
        texts = []
        for el in main.find_all(["p", "li", "pre"]):
            if el.name == "pre":
                t = el.get_text("\n")
                if t.strip():
                    texts.append("\n```text\n" + t.strip("\n") + "\n```\n")
            else:
                t = el.get_text(" ", strip=True)
                if t:
                    texts.append(t)
        full_text = safe_text("\n\n".join(texts))
        return full_text, [], title

    def heading_level(h) -> int:
        try:
            return int(h.name[1])
        except Exception:
            return 6

    sections: List[Dict[str, Any]] = []
    full_parts: List[str] = []

    for h in headings:
        htxt = safe_text(h.get_text(" ", strip=True))
        lvl = heading_level(h)

        content_parts: List[str] = []
        code_blocks: List[str] = []

        cur = h.next_sibling
        while cur is not None:
            nm = getattr(cur, "name", None)
            if nm and re.match(r"^h[1-6]$", nm):
                break
            if nm is None:
                cur = getattr(cur, "next_sibling", None)
                continue

            if nm in ("p", "li"):
                t = cur.get_text(" ", strip=True)
                if t:
                    content_parts.append(t)
            elif nm == "pre":
                t = cur.get_text("\n")
                if t.strip():
                    code_blocks.append(t.strip("\n"))
                    content_parts.append("\n```text\n" + t.strip("\n") + "\n```\n")
            else:
                for el in cur.find_all(["p", "li", "pre"], recursive=True):
                    if el.name in ("p", "li"):
                        t = el.get_text(" ", strip=True)
                        if t:
                            content_parts.append(t)
                    elif el.name == "pre":
                        t = el.get_text("\n")
                        if t.strip():
                            code_blocks.append(t.strip("\n"))
                            content_parts.append("\n```text\n" + t.strip("\n") + "\n```\n")

            cur = getattr(cur, "next_sibling", None)

        section_text = safe_text("\n\n".join(content_parts))
        sections.append({"heading": htxt, "level": lvl, "text": section_text, "code_blocks": code_blocks})

        if htxt:
            full_parts.append(f"{'#' * lvl} {htxt}\n")
        if section_text:
            full_parts.append(section_text + "\n")

    full_text = safe_text("\n\n".join(full_parts))
    return full_text, sections, title

def extract_from_ipynb_bytes(b: bytes) -> Tuple[str, List[Dict[str, Any]], str]:
    try:
        nb = json.loads(b.decode("utf-8", errors="replace"))
    except Exception:
        return "", [], ""

    cells = nb.get("cells", [])
    sections: List[Dict[str, Any]] = []
    title = ""

    def add_section(heading: str, level: int, text: str, code_blocks: List[str]):
        sections.append({"heading": heading, "level": level, "text": safe_text(text), "code_blocks": code_blocks})

    current_heading = "Notebook"
    current_level = 1
    current_text_parts: List[str] = []
    current_code: List[str] = []

    for cell in cells:
        ctype = cell.get("cell_type", "")
        src = "".join(cell.get("source", []))
        src = src.strip("\n")
        if not src:
            continue

        if ctype == "markdown":
            m = re.match(r"^(#{1,6})\s+(.*)$", src.strip())
            if m:
                if current_text_parts or current_code:
                    add_section(current_heading, current_level, "\n\n".join(current_text_parts), current_code)
                current_heading = safe_text(m.group(2))
                current_level = len(m.group(1))
                current_text_parts = []
                current_code = []
            else:
                current_text_parts.append(src)
        elif ctype == "code":
            current_code.append(src)
            current_text_parts.append("\n```python\n" + src + "\n```\n")
        else:
            current_text_parts.append(src)

    if current_text_parts or current_code:
        add_section(current_heading, current_level, "\n\n".join(current_text_parts), current_code)

    if sections and sections[0]["heading"] and sections[0]["heading"] != "Notebook":
        title = sections[0]["heading"]

    parts: List[str] = []
    for s in sections:
        parts.append(f"{'#' * s['level']} {s['heading']}\n")
        if s["text"]:
            parts.append(s["text"] + "\n")

    return safe_text("\n\n".join(parts)), sections, title

@dataclass
class ScrapedDoc:
    url: str
    title: str
    text: str
    sections: List[Dict[str, Any]]
    fetched_at: str
    status_code: int
    content_type: str
    metadata: Dict[str, Any]

class LinkFetcher:
    def __init__(self, allow_domains: List[str], timeout: int = 20, delay: float = 0.1, retries: int = 2, verbose: bool = True):
        self.allow_domains = allow_domains
        self.timeout = timeout
        self.delay = delay
        self.retries = retries
        self.verbose = verbose

        self.session = requests.Session()
        self.session.headers.update({"User-Agent": UA})

    def log(self, msg: str):
        if self.verbose:
            print(msg, file=sys.stderr)

    def fetch(self, url: str) -> Optional[Tuple[int, str, bytes]]:
        for attempt in range(self.retries + 1):
            try:
                r = self.session.get(url, timeout=self.timeout, allow_redirects=True)
                status = r.status_code
                ctype = (r.headers.get("Content-Type") or "").split(";")[0].strip().lower()
                return status, ctype, r.content
            except Exception as e:
                if attempt >= self.retries:
                    self.log(f"[fetch error] {url} -> {e}")
                    return None
                time.sleep(0.5 * (attempt + 1))
        return None

    def scrape_one(self, url: str) -> ScrapedDoc:
        fetched_at = now_iso()

        if not within_allowlist(url, self.allow_domains):
            return ScrapedDoc(url, "", "", [], fetched_at, 0, "", {"skipped": "domain_not_allowed"})

        if is_probably_binary(url):
            return ScrapedDoc(url, "", "", [], fetched_at, 0, "", {"skipped": "binary_url"})

        res = self.fetch(url)
        if res is None:
            return ScrapedDoc(url, "", "", [], fetched_at, 0, "", {"error": "fetch_failed"})

        status, ctype, content = res

        if status != 200:
            return ScrapedDoc(url, "", "", [], fetched_at, status, ctype, {"error": f"http_{status}"})

        if looks_like_notebook(url) or ctype in ("application/x-ipynb+json",):
            text, sections, title = extract_from_ipynb_bytes(content)
            return ScrapedDoc(url, title, text, sections, fetched_at, status, ctype or "application/x-ipynb+json", {"source_type": "ipynb"})

        if looks_like_markdown(url) or ctype in ("text/markdown", "text/plain"):
            raw = content.decode("utf-8", errors="replace")
            text = safe_text(raw)
            return ScrapedDoc(url, "", text, [], fetched_at, status, ctype or "text/plain", {"source_type": "markdown_or_text"})

        if "html" in ctype or ctype in ("text/html", ""):
            html = content.decode("utf-8", errors="replace")
            text, sections, title = extract_text_and_sections_from_html(html)
            return ScrapedDoc(url, title, text, sections, fetched_at, status, ctype or "text/html", {"source_type": "html"})

        text = safe_text(content.decode("utf-8", errors="replace"))
        return ScrapedDoc(url, "", text, [], fetched_at, status, ctype, {"source_type": "unknown"})

def docs_to_json(docs: List[ScrapedDoc]) -> List[Dict[str, Any]]:
    return [{
        "url": d.url,
        "title": d.title,
        "text": d.text,
        "sections": d.sections,
        "fetched_at": d.fetched_at,
        "status_code": d.status_code,
        "content_type": d.content_type,
        "metadata": d.metadata,
    } for d in docs]

def main():
    ap = argparse.ArgumentParser(description="Build a Qiskit RAG corpus from a URL list.")
    ap.add_argument("--urls-file", type=str, default="qiskit_official_links.txt", help="Text file with one URL per line (quoted or unquoted).")
    ap.add_argument("--out", type=str, default="comprehensive_qiskit_docs.json", help="Output JSON corpus file.")
    ap.add_argument("--timeout", type=int, default=20, help="HTTP timeout seconds.")
    ap.add_argument("--delay", type=float, default=0.1, help="Delay between requests.")
    ap.add_argument("--retries", type=int, default=2, help="Retries for transient failures.")
    ap.add_argument("--max-urls", type=int, default=0, help="Optional cap on number of URLs (0 = no cap).")
    ap.add_argument("--allow-domain", action="append", default=[], help="Allowlisted domain (repeatable).")
    ap.add_argument("--quiet", action="store_true", help="Less logging.")
    args = ap.parse_args()

    allow_domains = args.allow_domain[:] if args.allow_domain else DEFAULT_ALLOW_DOMAINS[:]
    verbose = not args.quiet

    urls = parse_url_list(args.urls_file)
    if args.max_urls and args.max_urls > 0:
        urls = urls[: args.max_urls]

    if verbose:
        print(f"[init] urls_file={args.urls_file}", file=sys.stderr)
        print(f"[init] urls={len(urls)}", file=sys.stderr)
        print(f"[init] allow_domains={allow_domains}", file=sys.stderr)

    fetcher = LinkFetcher(allow_domains=allow_domains, timeout=args.timeout, delay=args.delay, retries=args.retries, verbose=verbose)

    docs: List[ScrapedDoc] = []
    num_http_200 = 0

    for i, url in enumerate(urls, start=1):
        if args.delay > 0:
            time.sleep(args.delay)

        if verbose and (i == 1 or i % 50 == 0):
            print(f"[progress] {i}/{len(urls)}", file=sys.stderr)

        d = fetcher.scrape_one(canonicalize_url(url))
        if d.status_code == 200:
            num_http_200 += 1

        # Store only successful, meaningful pages in the corpus
        if d.status_code == 200 and d.text and len(d.text) >= 50:
            docs.append(d)

    payload = {
        "meta": {
            "generated_at": now_iso(),
            "input_urls_file": args.urls_file,
            "num_input_urls": len(urls),
            "num_http_200": num_http_200,
            "num_docs_stored": len(docs),
            "timeout": args.timeout,
            "delay": args.delay,
            "retries": args.retries,
            "allow_domains": allow_domains,
            "note": "Corpus built from a curated URL list (no crawling).",
        },
        "docs": docs_to_json(docs),
    }

    with open(args.out, "w", encoding="utf-8") as f:
        json.dump(payload, f, ensure_ascii=False, indent=2)

    if verbose:
        print(f"[done] wrote {args.out} with {len(docs)} docs (from {len(urls)} urls)", file=sys.stderr)

if __name__ == "__main__":
    main()
