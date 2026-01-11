#!/usr/bin/env python3
"""
setup_qiskit_rag_linklist.py

Setup script for the Qiskit RAG System (URL-list driven).

Expected files in your project directory:
- qiskit_rag_system_linklist.py
- qiskit_docs_scraper_linklist.py
- qiskit_official_links.txt  (or qiskit_official_links_quoted.txt)

This script:
1) Installs dependencies
2) Builds comprehensive_qiskit_docs.json from the URL list
3) Runs a quick RAG system smoke test
"""

import subprocess
import sys
import os


def run_command(command, description):
    print(f"\n🔄 {description}...")
    print(f"Running: {command}")

    try:
        result = subprocess.run(command, shell=True, check=True, capture_output=True, text=True)
        print(f"✅ {description} completed successfully")
        if result.stdout:
            print(result.stdout)
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ {description} failed with error code {e.returncode}")
        if e.stderr:
            print(e.stderr)
        return False


def install_dependencies():
    packages = [
        "requests",
        "beautifulsoup4",
        "scikit-learn",
        "numpy",
        "openai",
        "lxml",
    ]
    for package in packages:
        if not run_command(f"pip install {package}", f"Installing {package}"):
            return False
    return True


def build_corpus_from_url_list():
    if not os.path.exists("qiskit_docs_scraper_linklist.py"):
        print("❌ qiskit_docs_scraper_linklist.py not found!")
        return False

    urls_file = None
    if os.path.exists("qiskit_official_links.txt"):
        urls_file = "qiskit_official_links.txt"
    elif os.path.exists("qiskit_official_links_quoted.txt"):
        urls_file = "qiskit_official_links_quoted.txt"
    else:
        print("❌ URL list file not found! Place qiskit_official_links.txt (or _quoted.txt) in this directory.")
        return False

    cmd = (
        f"python3 qiskit_docs_scraper_linklist.py "
        f"--urls-file {urls_file} "
        f"--delay 0.1 "
        f"--timeout 20 "
        f"--retries 2 "
        f"--out comprehensive_qiskit_docs.json"
    )
    return run_command(cmd, f"Building RAG corpus from {urls_file}")


def test_rag_system():
    if not os.path.exists("qiskit_rag_system_linklist.py"):
        print("❌ qiskit_rag_system_linklist.py not found!")
        return False
    return run_command("python3 qiskit_rag_system_linklist.py", "Testing RAG system")


def main():
    print("🚀 Setting up Qiskit RAG System (URL-list driven)")
    print("=" * 60)

    if sys.version_info < (3, 8):
        print("❌ Python 3.8+ is required")
        sys.exit(1)

    print(f"✅ Python {sys.version_info.major}.{sys.version_info.minor} detected")

    if not install_dependencies():
        print("❌ Failed to install dependencies")
        sys.exit(1)

    if not build_corpus_from_url_list():
        print("❌ Failed to build corpus from URL list")
        sys.exit(1)

    if not test_rag_system():
        print("❌ Failed to test RAG system")
        sys.exit(1)

    print("\n🎉 Setup completed successfully!")
    print("\nNotes:")
    print("- To choose your OpenAI model, set OPENAI_MODEL in your env (default: gpt-4o-mini).")
    print("- To rebuild the corpus after updating your URL list:")
    print("  python3 qiskit_docs_scraper_linklist.py --urls-file qiskit_official_links.txt --out comprehensive_qiskit_docs.json")
    print("- Quick smoke test build (fewer pages):")
    print("  python3 qiskit_docs_scraper_linklist.py --urls-file qiskit_official_links.txt --max-urls 200 --out comprehensive_qiskit_docs.json")


if __name__ == "__main__":
    main()
