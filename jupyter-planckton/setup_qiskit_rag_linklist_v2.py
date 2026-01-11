#!/usr/bin/env python3
"""
setup_qiskit_rag_linklist_v2.py

End-to-end setup for the docs-first Qiskit RAG system.

Expected files:
- qiskit_docs_scraper_linklist_v2.py (or qiskit_docs_scraper_linklist.py)
- qiskit_rag_system_linklist_v2.py
- qiskit_official_links.txt

This script:
1) Installs dependencies
2) Builds comprehensive_qiskit_docs.json from qiskit_official_links.txt
3) Runs a smoke test of the RAG retrieval system

Usage:
  python3 setup_qiskit_rag_linklist_v2.py
"""

from __future__ import annotations

import os
import subprocess
import sys


def run(cmd: str, label: str) -> bool:
    print(f"\n==> {label}\n$ {cmd}")
    p = subprocess.run(cmd, shell=True)
    return p.returncode == 0


def install_deps() -> bool:
    pkgs = [
        "requests",
        "beautifulsoup4",
        "lxml",
        "scikit-learn",
        "numpy",
        "openai",
    ]
    return run(f"{sys.executable} -m pip install -U " + " ".join(pkgs), "Installing dependencies")


def build_corpus(urls_file: str, out_json: str) -> bool:
    if not os.path.exists(urls_file):
        print(f"❌ URL allowlist not found: {urls_file}")
        return False

    scraper = "qiskit_docs_scraper_linklist_v2.py" if os.path.exists("qiskit_docs_scraper_linklist_v2.py") else "qiskit_docs_scraper_linklist.py"
    cmd = (
        f"{sys.executable} {scraper} "
        f"--urls-file {urls_file} "
        f"--delay 0.1 "
        f"--timeout 20 "
        f"--retries 2 "
        f"--out {out_json}"
    )
    return run(cmd, "Building documentation corpus JSON")


def smoke_test(docs_json: str, urls_file: str) -> bool:
    env = os.environ.copy()
    env["QISKIT_DOCS_JSON"] = docs_json
    env["QISKIT_ALLOWLIST"] = urls_file
    cmd = f"{sys.executable} qiskit_rag_system_linklist_v2.py"
    print(f"\n==> Running smoke test\n$ {cmd}")
    p = subprocess.run(cmd, shell=True, env=env)
    return p.returncode == 0


def main() -> None:
    urls_file = os.environ.get("QISKIT_ALLOWLIST", "qiskit_official_links.txt")
    out_json = os.environ.get("QISKIT_DOCS_JSON", "comprehensive_qiskit_docs.json")

    print("🚀 Setting up docs-first Qiskit RAG (allowlist-driven)\n")
    if not install_deps():
        print("❌ Dependency installation failed")
        sys.exit(1)

    if not build_corpus(urls_file, out_json):
        print("❌ Corpus build failed")
        sys.exit(1)

    if not smoke_test(out_json, urls_file):
        print("❌ Smoke test failed")
        sys.exit(1)

    print("\n🎉 Setup completed successfully!")
    print("\nNext:")
    print("- Set OPENAI_API_KEY in your environment.")
    print("- Optionally set OPENAI_MODEL (default: gpt-4o-mini).")
    print("- Rebuild the corpus anytime the allowlist changes:")
    print(f"  python3 qiskit_docs_scraper_linklist.py --urls-file {urls_file} --out {out_json}")


if __name__ == "__main__":
    main()
