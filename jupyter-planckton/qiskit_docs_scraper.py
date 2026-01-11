# #!/usr/bin/env python3
# """
# Qiskit Documentation Scraper for RAG Implementation
# Scrapes the latest Qiskit documentation from IBM Quantum Platform
# """

# import requests
# from bs4 import BeautifulSoup
# import json
# import time
# import re
# from urllib.parse import urljoin, urlparse
# import os
# from typing import Dict, List, Set, Tuple
# import hashlib

# class QiskitDocsScraper:
#     def __init__(self, base_url: str = "https://quantum.cloud.ibm.com/docs/en/api/qiskit"):
#         self.base_url = base_url
#         self.session = requests.Session()
#         self.session.headers.update({
#             'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
#         })
#         self.visited_urls: Set[str] = set()
#         self.docs_data: List[Dict] = []
#         self.section_hierarchy: Dict = {}
        
#     def scrape_all_documentation(self) -> List[Dict]:
#         """Main method to scrape all Qiskit documentation"""
#         print(f"Starting to scrape Qiskit documentation from: {self.base_url}")
        
#         # Start with the main API reference page
#         self._scrape_page(self.base_url, "API Reference")
        
#         # Extract all navigation links and scrape them
#         self._scrape_navigation_links()
        
#         # Scrape individual module pages
#         self._scrape_module_pages()
        
#         # Try to find and scrape additional documentation pages
#         self._scrape_additional_pages()
        
#         # Scrape comprehensive documentation from multiple sources
#         self._scrape_comprehensive_docs()
        
#         print(f"Scraping completed! Total pages scraped: {len(self.docs_data)}")
#         return self.docs_data
    
#     def _scrape_page(self, url: str, title: str, parent_section: str = "") -> Dict:
#         """Scrape a single documentation page"""
#         if url in self.visited_urls:
#             return {}
            
#         self.visited_urls.add(url)
#         print(f"Scraping: {title} - {url}")
        
#         try:
#             response = self.session.get(url, timeout=30)
#             response.raise_for_status()
            
#             soup = BeautifulSoup(response.content, 'html.parser')
            
#             # Extract main content
#             content = self._extract_page_content(soup)
            
#             # Extract code examples
#             code_examples = self._extract_code_examples(soup)
            
#             # Extract API signatures and parameters
#             api_info = self._extract_api_information(soup)
            
#             # Extract links for further crawling
#             links = self._extract_links(soup, url)
            
#             doc_entry = {
#                 'url': url,
#                 'title': title,
#                 'parent_section': parent_section,
#                 'content': content,
#                 'code_examples': code_examples,
#                 'api_info': api_info,
#                 'links': links,
#                 'timestamp': time.time(),
#                 'hash': hashlib.md5(content.encode()).hexdigest()
#             }
            
#             self.docs_data.append(doc_entry)
            
#             # Add to section hierarchy
#             if parent_section not in self.section_hierarchy:
#                 self.section_hierarchy[parent_section] = []
#             self.section_hierarchy[parent_section].append(doc_entry)
            
#             return doc_entry
            
#         except Exception as e:
#             print(f"Error scraping {url}: {e}")
#             return {}
    
#     def _extract_page_content(self, soup: BeautifulSoup) -> str:
#         """Extract the main content from a page"""
#         content = ""
        
#         # Look for main content areas
#         main_content = soup.find('main') or soup.find('article') or soup.find('div', class_='content')
        
#         if main_content:
#             # Remove navigation, headers, footers
#             for element in main_content.find_all(['nav', 'header', 'footer', 'aside']):
#                 element.decompose()
            
#             # Extract text content
#             content = main_content.get_text(separator='\n', strip=True)
#         else:
#             # Fallback: extract all text from body
#             body = soup.find('body')
#             if body:
#                 content = body.get_text(separator='\n', strip=True)
        
#         # Clean up the content
#         content = re.sub(r'\n\s*\n', '\n\n', content)
#         content = re.sub(r'\s+', ' ', content)
        
#         return content.strip()
    
#     def _extract_code_examples(self, soup: BeautifulSoup) -> List[str]:
#         """Extract code examples from the page"""
#         code_examples = []
        
#         # Look for code blocks
#         code_blocks = soup.find_all(['code', 'pre'])
        
#         for block in code_blocks:
#             if block.name == 'pre':
#                 code = block.get_text()
#             else:
#                 code = block.get_text()
            
#             if code.strip() and len(code.strip()) > 10:  # Only meaningful code
#                 code_examples.append(code.strip())
        
#         return code_examples
    
#     def _extract_api_information(self, soup: BeautifulSoup) -> Dict:
#         """Extract API signatures, parameters, and return types"""
#         api_info = {
#             'functions': [],
#             'classes': [],
#             'parameters': {},
#             'return_types': {}
#         }
        
#         # Look for function/class definitions
#         # This is a simplified extraction - you might want to enhance this
#         function_patterns = [
#             r'def\s+(\w+)\s*\(([^)]*)\)',
#             r'class\s+(\w+)',
#             r'(\w+)\s*=\s*(\w+)'
#         ]
        
#         content = soup.get_text()
#         for pattern in function_patterns:
#             matches = re.findall(pattern, content)
#             for match in matches:
#                 if len(match) == 2:
#                     api_info['functions'].append({
#                         'name': match[0],
#                         'signature': match[1]
#                     })
        
#         return api_info
    
#     def _extract_links(self, soup: BeautifulSoup, base_url: str) -> List[str]:
#         """Extract links for further crawling"""
#         links = []
        
#         for link in soup.find_all('a', href=True):
#             href = link['href']
#             full_url = urljoin(base_url, href)
            
#             # Only include relevant Qiskit documentation links
#             if self._is_relevant_link(full_url):
#                 links.append(full_url)
        
#         return list(set(links))  # Remove duplicates
    
#     def _is_relevant_link(self, url: str) -> bool:
#         """Check if a link is relevant to Qiskit documentation"""
#         relevant_patterns = [
#             r'quantum\.cloud\.ibm\.com/docs/en/api/qiskit',
#             r'qiskit\.org',
#             r'github\.com/Qiskit'
#         ]
        
#         return any(re.search(pattern, url) for pattern in relevant_patterns)
    
#     def _scrape_navigation_links(self):
#         """Scrape navigation links from the main page"""
#         print("Scraping navigation links...")
        
#         try:
#             response = self.session.get(self.base_url)
#             soup = BeautifulSoup(response.content, 'html.parser')
            
#             # Find navigation menu
#             nav_links = soup.find_all('a', href=True)
            
#             for link in nav_links:
#                 href = link['href']
#                 if href.startswith('/docs/en/api/qiskit'):
#                     full_url = urljoin(self.base_url, href)
#                     title = link.get_text(strip=True) or link.get('title', '')
                    
#                     if title and full_url not in self.visited_urls:
#                         self._scrape_page(full_url, title, "Navigation")
#                         time.sleep(1)  # Be respectful to the server
                        
#         except Exception as e:
#             print(f"Error scraping navigation: {e}")
    
#     def _scrape_module_pages(self):
#         """Scrape individual module documentation pages"""
#         print("Scraping module pages...")
        
#         # Use the working URLs we discovered
#         working_modules = [
#             "circuit",
#             "quantum_info", 
#             "transpiler",
#             "primitives",
#             "providers",
#             "result",
#             "visualization",
#             "compiler",
#             "converters",
#             "dagcircuit",
#             "passmanager",
#             "synthesis"
#         ]
        
#         for module in working_modules:
#             module_url = f"{self.base_url}/{module}"
#             if module_url not in self.visited_urls:
#                 self._scrape_page(module_url, f"Module: {module}", "Core Modules")
#                 time.sleep(1)
    
#     def _scrape_additional_pages(self):
#         """Scrape additional pages by analyzing the main page structure"""
#         print("Analyzing page structure for additional documentation...")
        
#         try:
#             response = self.session.get(self.base_url)
#             soup = BeautifulSoup(response.content, 'html.parser')
            
#             # Look for any links that contain Qiskit-related keywords
#             all_links = soup.find_all('a', href=True)
#             for link in all_links:
#                 href = link['href']
#                 title = link.get_text(strip=True)
                
#                 # Check if the link text or URL contains Qiskit-related content
#                 if (title and any(keyword in title.lower() for keyword in ['circuit', 'quantum', 'transpiler', 'primitives', 'provider', 'result', 'visualization', 'compiler']) or
#                     any(keyword in href.lower() for keyword in ['circuit', 'quantum', 'transpiler', 'primitives', 'provider', 'result', 'visualization', 'compiler'])):
                    
#                     full_url = urljoin(self.base_url, href)
#                     if full_url not in self.visited_urls and self._is_relevant_link(full_url):
#                         print(f"Found keyword-based link: {title} - {full_url}")
#                         self._scrape_page(full_url, title, "Keyword Match")
#                         time.sleep(1)
            
#             # Also try to scrape some known documentation patterns
#             self._scrape_known_patterns()
                        
#         except Exception as e:
#             print(f"Error in additional page scraping: {e}")
    
#     def _scrape_known_patterns(self):
#         """Try to scrape some known documentation patterns"""
#         print("Trying known documentation patterns...")
        
#         # Use the working URL patterns we discovered
#         working_patterns = [
#             "/circuit",
#             "/quantum_info", 
#             "/transpiler",
#             "/primitives",
#             "/providers",
#             "/result",
#             "/visualization",
#             "/compiler",
#             "/converters",
#             "/dagcircuit",
#             "/passmanager",
#             "/synthesis"
#         ]
        
#         for pattern in working_patterns:
#             url = self.base_url + pattern
#             if url not in self.visited_urls:
#                 try:
#                     response = self.session.get(url, timeout=10)
#                     if response.status_code == 200:
#                         print(f"Found working pattern: {pattern}")
#                         self._scrape_page(url, f"Module: {pattern.strip('/')}", "Known Pattern")
#                         time.sleep(1)
#                     else:
#                         print(f"Pattern {pattern} returned status {response.status_code}")
#                 except Exception as e:
#                     print(f"Error trying pattern {pattern}: {e}")
#                     continue
    
#     def _scrape_comprehensive_docs(self):
#         """Scrape comprehensive documentation from multiple sources"""
#         print("Scraping comprehensive documentation...")
        
#         # Additional documentation sources to scrape
#         additional_sources = [
#             "https://qiskit.org/documentation/",
#             "https://qiskit.org/documentation/tutorials/",
#             "https://qiskit.org/documentation/apidoc/",
#             "https://qiskit.org/documentation/stubs/",
#             "https://qiskit.org/documentation/apidoc/qiskit.circuit.library.html",
#             "https://qiskit.org/documentation/apidoc/qiskit.algorithms.html",
#             "https://qiskit.org/documentation/apidoc/qiskit.algorithms.amplitude_amplifiers.html"
#         ]
        
#         for source_url in additional_sources:
#             try:
#                 print(f"Scraping additional source: {source_url}")
#                 self._scrape_page(source_url, f"Additional Source: {source_url}", "Comprehensive Docs")
#                 time.sleep(2)  # Be respectful to external servers
#             except Exception as e:
#                 print(f"Error scraping {source_url}: {e}")
#                 continue
        
#         # Also try to scrape GitHub documentation
#         self._scrape_github_docs()
    
#     def _scrape_github_docs(self):
#         """Scrape documentation from GitHub"""
#         print("Scraping GitHub documentation...")
        
#         github_sources = [
#             "https://github.com/Qiskit/qiskit/blob/main/docs/tutorials/",
#             "https://github.com/Qiskit/qiskit/blob/main/docs/api/",
#             "https://github.com/Qiskit/qiskit-algorithms/blob/main/docs/",
#             "https://github.com/Qiskit/qiskit/blob/main/docs/tutorials/algorithms/",
#             "https://github.com/Qiskit/qiskit/blob/main/docs/tutorials/circuits/"
#         ]
        
#         for github_url in github_sources:
#             try:
#                 print(f"Scraping GitHub source: {github_url}")
#                 self._scrape_page(github_url, f"GitHub: {github_url}", "GitHub Docs")
#                 time.sleep(2)  # Be respectful to GitHub
#             except Exception as e:
#                 print(f"Error scraping GitHub {github_url}: {e}")
#                 continue
    
#     def save_documentation(self, filename: str = "qiskit_docs.json"):
#         """Save scraped documentation to a JSON file"""
#         with open(filename, 'w', encoding='utf-8') as f:
#             json.dump({
#                 'metadata': {
#                     'scraped_at': time.time(),
#                     'total_pages': len(self.docs_data),
#                     'base_url': self.base_url
#                 },
#                 'section_hierarchy': self.section_hierarchy,
#                 'documentation': self.docs_data
#             }, f, indent=2, ensure_ascii=False)
        
#         print(f"Documentation saved to {filename}")
    
#     def create_search_index(self) -> Dict:
#         """Create a search index for the documentation"""
#         search_index = {}
        
#         for doc in self.docs_data:
#             # Create searchable text
#             searchable_text = f"{doc['title']} {doc['content']}"
            
#             # Simple keyword extraction (you might want to use more sophisticated NLP)
#             words = re.findall(r'\b\w+\b', searchable_text.lower())
            
#             for word in words:
#                 if len(word) > 3:  # Only meaningful words
#                     if word not in search_index:
#                         search_index[word] = []
#                     search_index[word].append({
#                         'url': doc['url'],
#                         'title': doc['title'],
#                         'relevance_score': 1.0
#                     })
        
#         return search_index

# def main():
#     """Main function to run the scraper"""
#     scraper = QiskitDocsScraper()
    
#     # Scrape all documentation
#     docs = scraper.scrape_all_documentation()
    
#     # Save to file
#     scraper.save_documentation()
    
#     # Create search index
#     search_index = scraper.create_search_index()
    
#     # Save search index
#     with open('qiskit_search_index.json', 'w') as f:
#         json.dump(search_index, f, indent=2)
    
#     print("Scraping and indexing completed successfully!")
#     print(f"Total documentation pages: {len(docs)}")
#     print(f"Search index entries: {len(search_index)}")

# if __name__ == "__main__":
#     main()

#!/usr/bin/env python3
"""
qiskit_docs_scraper_v2.py

A high-recall documentation scraper focused on building a RAG corpus for a
Jupyter chat-based quantum coding co-pilot.

Key upgrades vs a basic "API-only" scraper:
- Multiple strong seed sets: API refs + tutorials + guides + learning content
- Optional sitemap crawling (big recall boost)
- VQE + algorithms coverage explicitly included in seeds + keyword focus option
- GitHub notebook/doc support: converts github.com/blob URLs to raw, parses ipynb
- Cleaner text extraction (keeps headings, paragraphs, code blocks)
- Crawl controls: allowlist domains, max pages, max depth, delay, keyword filters
- Output: JSON list of documents with url/title/text/sections/metadata

This is intended for scraping publicly available docs only.
"""

from __future__ import annotations

import argparse
import dataclasses
import json
import os
import re
import sys
import time
from collections import deque
from datetime import datetime
from typing import Any, Dict, Iterable, List, Optional, Set, Tuple
from urllib.parse import urljoin, urlparse, urldefrag

import requests
from bs4 import BeautifulSoup


# ----------------------------
# Defaults / Seeds
# ----------------------------

DEFAULT_ALLOW_DOMAINS = [
    # IBM Quantum Platform docs (Runtime, API, guides, tutorials)
    "quantum.cloud.ibm.com",
    # Qiskit landing + ecosystem docs
    "qiskit.org",
    "qiskit-community.github.io",
    # Some docs are hosted on GitHub pages
    "ibm.github.io",
    # Raw GitHub content for notebooks / md
    "raw.githubusercontent.com",
    # Sometimes used by Qiskit docs historically
    "docs.quantum.ibm.com",
]

# High-value seeds that tend to fan out into many doc pages.
# These are intentionally broad; with --use-sitemaps you get even higher recall.
SEED_URLS = [
    # Qiskit main docs / learn areas
    "https://qiskit.org/documentation/",
    "https://qiskit.org/ecosystem/",
    "https://qiskit.org/learn/",
    "https://qiskit.org/documentation/apidoc/index.html",
    "https://qiskit.org/documentation/tutorials.html",

    # IBM Quantum Platform documentation root
    "https://quantum.cloud.ibm.com/docs/",

    # Likely relevant topic entry points (algorithms, primitives, runtime)
    "https://qiskit.org/documentation/apidoc/primitives.html",
    "https://qiskit.org/documentation/apidoc/algorithms.html",
    "https://qiskit.org/documentation/tutorials/algorithms.html",
    "https://qiskit.org/documentation/tutorials/algorithms/index.html",

    # VQE specifically - comprehensive coverage
    "https://qiskit.org/documentation/apidoc/qiskit_algorithms.minimum_eigensolvers.VQE.html",
    "https://qiskit.org/documentation/apidoc/qiskit_algorithms.minimum_eigensolvers.html",
    "https://qiskit.org/documentation/apidoc/qiskit_algorithms.html",
    "https://quantum.cloud.ibm.com/docs/en/api/qiskit/qiskit_algorithms.minimum_eigensolvers.VQE",
    "https://qiskit.org/documentation/tutorials/algorithms/01_algorithms_introduction.html",
    "https://qiskit.org/documentation/tutorials/algorithms/02_vqe_convergence.html",
    "https://qiskit.org/documentation/tutorials/algorithms/03_vqe_simulation_with_noise.html",
    "https://qiskit.org/documentation/tutorials/algorithms/04_vqe_advanced.html",
    "https://qiskit.org/documentation/stubs/qiskit_algorithms.minimum_eigensolvers.VQE.html",
    "https://qiskit.org/documentation/stubs/qiskit_algorithms.minimum_eigensolvers.html",
    
    # VQE-related algorithms and components
    "https://qiskit.org/documentation/apidoc/qiskit_algorithms.minimum_eigensolvers.VQD.html",
    "https://qiskit.org/documentation/apidoc/qiskit_algorithms.optimizers.html",
    "https://qiskit.org/documentation/apidoc/qiskit_algorithms.gradients.html",
    "https://qiskit.org/documentation/apidoc/qiskit_algorithms.variational_quantum_eigensolver.html",
    
    # Algorithms tutorials (comprehensive)
    "https://qiskit.org/documentation/tutorials/algorithms/05_qaoa.html",
    "https://qiskit.org/documentation/tutorials/algorithms/06_grover.html",
    "https://qiskit.org/documentation/tutorials/algorithms/07_grover_examples.html",
    "https://qiskit.org/documentation/tutorials/algorithms/08_vqd.html",
    
    # Algorithm API documentation
    "https://qiskit.org/documentation/apidoc/qiskit_algorithms.minimum_eigensolvers.html",
    "https://qiskit.org/documentation/apidoc/qiskit_algorithms.amplitude_amplifiers.html",
    "https://qiskit.org/documentation/apidoc/qiskit_algorithms.time_evolvers.html",
    "https://qiskit.org/documentation/apidoc/qiskit_algorithms.eigensolvers.html",
    
    # Aer (simulation)
    "https://qiskit.org/ecosystem/aer/",
    "https://qiskit.org/documentation/apidoc/qiskit_aer.html",
    "https://qiskit.org/documentation/apidoc/qiskit_aer.AerSimulator.html",
    "https://qiskit.org/documentation/apidoc/qiskit_aer.StatevectorSimulator.html",
    
    # Runtime (cloud execution)
    "https://qiskit.org/ecosystem/ibm-runtime/",
    
    # Nature (chemistry VQE examples live here often)
    "https://qiskit.org/ecosystem/nature/",
    "https://qiskit.org/documentation/nature/",
    "https://qiskit.org/documentation/nature/tutorials.html",
    
    # Primitives (important for VQE)
    "https://qiskit.org/documentation/apidoc/qiskit.primitives.html",
    "https://qiskit.org/documentation/apidoc/qiskit.primitives.Sampler.html",
    "https://qiskit.org/documentation/apidoc/qiskit.primitives.Estimator.html",
    
    # Circuit library (used in VQE ansatzes)
    "https://qiskit.org/documentation/apidoc/qiskit.circuit.library.html",
    "https://qiskit.org/documentation/apidoc/qiskit.circuit.library.RealAmplitudes.html",
    "https://qiskit.org/documentation/apidoc/qiskit.circuit.library.EfficientSU2.html",
    
    # Quantum info (operators, states used in VQE)
    "https://qiskit.org/documentation/apidoc/qiskit.quantum_info.html",
    "https://qiskit.org/documentation/apidoc/qiskit.quantum_info.SparsePauliOp.html",
    "https://qiskit.org/documentation/apidoc/qiskit.quantum_info.operators.html",
]

# Common sitemap endpoints to try for each domain
SITEMAP_CANDIDATES = [
    "/sitemap.xml",
    "/sitemap_index.xml",
    "/sitemap/sitemap.xml",
]


# ----------------------------
# Utilities
# ----------------------------

UA = os.environ.get(
    "QISKIT_SCRAPER_UA",
    "Mozilla/5.0 (compatible; qiskit-docs-scraper/2.0; +https://example.invalid)",
)


def now_iso() -> str:
    return datetime.utcnow().replace(microsecond=0).isoformat() + "Z"


def canonicalize_url(url: str) -> str:
    """Normalize URL: join fragments removed, strip trailing #, and some cleanup."""
    if not url:
        return url
    url, _frag = urldefrag(url)
    # Remove trailing slash normalization only for non-root paths can be risky;
    # keep as-is but remove obvious duplicates
    return url.strip()


def domain_of(url: str) -> str:
    try:
        return urlparse(url).netloc.lower()
    except Exception:
        return ""


def is_probably_binary(url: str) -> bool:
    path = urlparse(url).path.lower()
    # Allow ipynb and md; block common binaries
    binary_exts = (
        ".png", ".jpg", ".jpeg", ".gif", ".webp", ".svg",
        ".pdf", ".zip", ".tar", ".gz", ".tgz", ".bz2", ".7z",
        ".whl", ".exe", ".dmg",
    )
    return path.endswith(binary_exts)


def github_blob_to_raw(url: str) -> str:
    """
    Convert github.com/<org>/<repo>/blob/<branch>/<path>
    into raw.githubusercontent.com/<org>/<repo>/<branch>/<path>
    """
    m = re.match(r"^https?://github\.com/([^/]+)/([^/]+)/blob/([^/]+)/(.*)$", url)
    if not m:
        return url
    org, repo, branch, path = m.group(1), m.group(2), m.group(3), m.group(4)
    return f"https://raw.githubusercontent.com/{org}/{repo}/{branch}/{path}"


def looks_like_notebook(url: str) -> bool:
    return urlparse(url).path.lower().endswith(".ipynb")


def looks_like_markdown(url: str) -> bool:
    return urlparse(url).path.lower().endswith((".md", ".markdown"))


def safe_text(s: str) -> str:
    s = s.replace("\u00a0", " ")
    # collapse excessive whitespace but keep newlines meaningful
    s = re.sub(r"[ \t]+\n", "\n", s)
    s = re.sub(r"\n[ \t]+", "\n", s)
    s = re.sub(r"\n{3,}", "\n\n", s)
    s = re.sub(r"[ \t]{2,}", "  ", s)
    return s.strip()


def within_allowlist(url: str, allow_domains: List[str]) -> bool:
    d = domain_of(url)
    if not d:
        return False
    for a in allow_domains:
        if d == a or d.endswith("." + a):
            return True
    return False


def should_keep_link(url: str, allow_domains: List[str]) -> bool:
    if not url:
        return False
    if url.startswith("mailto:") or url.startswith("javascript:"):
        return False
    url = canonicalize_url(url)
    if is_probably_binary(url):
        return False
    return within_allowlist(url, allow_domains)


# ----------------------------
# Extraction
# ----------------------------

def extract_text_and_sections_from_html(html: str, base_url: str) -> Tuple[str, List[Dict[str, Any]], str]:
    """
    Extract readable text from HTML with basic structure.
    Returns: (full_text, sections, title)
    sections: list of {heading, level, text, code_blocks[]}
    """
    soup = BeautifulSoup(html, "html.parser")

    # Remove nav, footer, script/style to reduce noise
    for tag in soup(["script", "style", "noscript", "header", "footer", "nav", "aside"]):
        tag.decompose()

    title = ""
    if soup.title and soup.title.string:
        title = safe_text(soup.title.string)

    # Some docs have main content in <main> or an article
    main = soup.find("main") or soup.find("article") or soup.body or soup

    # Gather headings and content between them
    headings = main.find_all(re.compile(r"^h[1-6]$"))
    if not headings:
        # Fallback: just grab paragraphs and code blocks
        texts = []
        for el in main.find_all(["p", "li", "pre", "code"]):
            if el.name == "pre":
                texts.append("\n```text\n" + el.get_text("\n") + "\n```\n")
            else:
                texts.append(el.get_text(" ", strip=True))
        full_text = safe_text("\n\n".join(texts))
        return full_text, [], title

    # Helper to collect sibling content until next heading of same/higher level
    def heading_level(h) -> int:
        try:
            return int(h.name[1])
        except Exception:
            return 6

    sections: List[Dict[str, Any]] = []
    full_parts: List[str] = []
    for i, h in enumerate(headings):
        htxt = safe_text(h.get_text(" ", strip=True))
        lvl = heading_level(h)

        # Collect content until next heading
        content_parts: List[str] = []
        code_blocks: List[str] = []

        cur = h.next_sibling
        next_h = headings[i + 1] if i + 1 < len(headings) else None
        # Iterate siblings until we reach next heading tag
        while cur is not None and cur != next_h:
            if getattr(cur, "name", None) is None:
                cur = cur.next_sibling
                continue
            if re.match(r"^h[1-6]$", cur.name):
                break

            # Keep paragraphs, lists, preformatted
            if cur.name in ("p", "li"):
                t = cur.get_text(" ", strip=True)
                if t:
                    content_parts.append(t)
            elif cur.name in ("pre",):
                t = cur.get_text("\n")
                if t:
                    code_blocks.append(t.strip("\n"))
                    content_parts.append("\n```text\n" + t.strip("\n") + "\n```\n")
            else:
                # dig into child useful tags
                for el in cur.find_all(["p", "li", "pre"], recursive=True):
                    if el.name in ("p", "li"):
                        t = el.get_text(" ", strip=True)
                        if t:
                            content_parts.append(t)
                    elif el.name == "pre":
                        t = el.get_text("\n")
                        if t:
                            code_blocks.append(t.strip("\n"))
                            content_parts.append("\n```text\n" + t.strip("\n") + "\n```\n")
            cur = cur.next_sibling

        section_text = safe_text("\n\n".join(content_parts))
        sections.append(
            {
                "heading": htxt,
                "level": lvl,
                "text": section_text,
                "code_blocks": code_blocks,
            }
        )

        if htxt:
            full_parts.append(f"{'#' * lvl} {htxt}\n")
        if section_text:
            full_parts.append(section_text + "\n")

    full_text = safe_text("\n\n".join(full_parts))
    return full_text, sections, title


def extract_from_ipynb_bytes(b: bytes) -> Tuple[str, List[Dict[str, Any]], str]:
    """
    Parse a Jupyter notebook and return text content.
    We treat markdown cells as text; code cells as fenced blocks.
    """
    try:
        nb = json.loads(b.decode("utf-8", errors="replace"))
    except Exception:
        return "", [], ""

    cells = nb.get("cells", [])
    parts: List[str] = []
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
            # Detect markdown headings
            m = re.match(r"^(#{1,6})\s+(.*)$", src.strip())
            if m:
                # flush previous section
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
            # raw cells etc.
            current_text_parts.append(src)

    if current_text_parts or current_code:
        add_section(current_heading, current_level, "\n\n".join(current_text_parts), current_code)

    # Heuristic title from first heading
    if sections and sections[0]["heading"] and sections[0]["heading"] != "Notebook":
        title = sections[0]["heading"]

    parts = []
    for s in sections:
        parts.append(f"{'#' * s['level']} {s['heading']}\n")
        if s["text"]:
            parts.append(s["text"] + "\n")

    return safe_text("\n\n".join(parts)), sections, title


# ----------------------------
# Sitemap support
# ----------------------------

def fetch_sitemap_urls(session: requests.Session, base: str, timeout: int) -> List[str]:
    """
    Fetch sitemap XML and return URLs. Supports sitemap index and simple sitemaps.
    """
    urls: List[str] = []

    def parse_sitemap(xml_text: str) -> Tuple[List[str], List[str]]:
        # Returns (page_urls, nested_sitemaps)
        soup = BeautifulSoup(xml_text, "xml")
        page_urls = []
        nested = []
        for loc in soup.find_all("loc"):
            if loc and loc.text:
                loc_text = loc.text.strip()
                # crude: sitemap index vs urlset can be detected by parents
                # We’ll include as page URL, and also detect nested sitemap files by extension.
                if loc_text.endswith(".xml"):
                    nested.append(loc_text)
                else:
                    page_urls.append(loc_text)
        # If urlset includes xml locs not ending .xml, nested will be empty.
        return page_urls, nested

    try:
        r = session.get(base, timeout=timeout, headers={"User-Agent": UA})
        if r.status_code != 200 or not r.text:
            return []
        page, nested = parse_sitemap(r.text)
        urls.extend(page)

        # If it was an index, follow nested
        seen_nested = set()
        q = deque(nested)
        while q:
            sm = q.popleft()
            if sm in seen_nested:
                continue
            seen_nested.add(sm)
            try:
                rr = session.get(sm, timeout=timeout, headers={"User-Agent": UA})
                if rr.status_code != 200 or not rr.text:
                    continue
                p2, n2 = parse_sitemap(rr.text)
                urls.extend(p2)
                for nx in n2:
                    if nx not in seen_nested:
                        q.append(nx)
            except Exception:
                continue

    except Exception:
        return []

    # Deduplicate and keep allowlisted ones
    out = []
    seen = set()
    for u in urls:
        u = canonicalize_url(u)
        if u and u not in seen:
            seen.add(u)
            out.append(u)
    return out


def try_sitemaps_for_domain(session: requests.Session, domain: str, timeout: int) -> List[str]:
    urls: List[str] = []
    for sm in SITEMAP_CANDIDATES:
        base = f"https://{domain}{sm}"
        urls.extend(fetch_sitemap_urls(session, base, timeout))
    # Dedup
    seen = set()
    out = []
    for u in urls:
        if u not in seen:
            seen.add(u)
            out.append(u)
    return out


# ----------------------------
# Core crawler
# ----------------------------

@dataclasses.dataclass
class ScrapedDoc:
    url: str
    title: str
    text: str
    sections: List[Dict[str, Any]]
    fetched_at: str
    status_code: int
    content_type: str
    metadata: Dict[str, Any]


class DocsScraper:
    def __init__(
        self,
        allow_domains: List[str],
        max_pages: int = 5000,  # Increased from 2000 for better coverage
        max_depth: int = 8,  # Increased from 6 to reach deeper pages
        delay: float = 0.0,
        timeout: int = 20,
        keyword_filters: Optional[List[str]] = None,
        verbose: bool = True,
    ):
        self.allow_domains = allow_domains
        self.max_pages = max_pages
        self.max_depth = max_depth
        self.delay = delay
        self.timeout = timeout
        self.keyword_filters = [k.lower() for k in (keyword_filters or [])]
        self.verbose = verbose

        self.session = requests.Session()
        self.session.headers.update({"User-Agent": UA})

        self.visited: Set[str] = set()
        self.docs: List[ScrapedDoc] = []

    def log(self, *args):
        if self.verbose:
            print(*args, file=sys.stderr)

    def keyword_ok(self, url: str, title: str, text: str) -> bool:
        if not self.keyword_filters:
            return True
        hay = (url + " " + title + " " + text).lower()
        return any(k in hay for k in self.keyword_filters)

    def fetch(self, url: str) -> Optional[Tuple[int, str, bytes]]:
        try:
            r = self.session.get(url, timeout=self.timeout, allow_redirects=True)
            status = r.status_code
            ctype = (r.headers.get("Content-Type") or "").split(";")[0].strip().lower()
            return status, ctype, r.content
        except Exception as e:
            self.log(f"[fetch error] {url} -> {e}")
            return None

    def extract_links(self, html: str, base_url: str) -> List[str]:
        soup = BeautifulSoup(html, "html.parser")
        links: List[str] = []
        for a in soup.find_all("a", href=True):
            href = a.get("href", "").strip()
            if not href:
                continue
            # Make absolute
            abs_url = urljoin(base_url, href)
            abs_url = canonicalize_url(abs_url)
            if should_keep_link(abs_url, self.allow_domains):
                links.append(abs_url)
        # Dedup
        out = []
        seen = set()
        for u in links:
            if u not in seen:
                seen.add(u)
                out.append(u)
        return out

    def scrape_url(self, url: str) -> Tuple[Optional[ScrapedDoc], List[str]]:
        """
        Fetch and parse a URL. Returns (ScrapedDoc or None, discovered_links).
        """
        url = canonicalize_url(url)
        if not within_allowlist(url, self.allow_domains):
            return None, []
        if is_probably_binary(url):
            return None, []
        # Convert GitHub blob -> raw if needed
        if "github.com/" in url and "/blob/" in url:
            url = github_blob_to_raw(url)

        res = self.fetch(url)
        if res is None:
            return None, []
        status, ctype, content = res

        fetched_at = now_iso()
        discovered: List[str] = []

        # Only parse if successful-ish
        if status != 200:
            doc = ScrapedDoc(
                url=url,
                title="",
                text="",
                sections=[],
                fetched_at=fetched_at,
                status_code=status,
                content_type=ctype,
                metadata={"error": f"http_{status}"},
            )
            return doc, []

        # Notebook
        if looks_like_notebook(url) or ctype in ("application/x-ipynb+json",):
            text, sections, title = extract_from_ipynb_bytes(content)
            if not self.keyword_ok(url, title, text):
                return None, []
            doc = ScrapedDoc(
                url=url,
                title=title,
                text=text,
                sections=sections,
                fetched_at=fetched_at,
                status_code=status,
                content_type=ctype or "application/x-ipynb+json",
                metadata={"source_type": "ipynb"},
            )
            return doc, []

        # Markdown
        if looks_like_markdown(url) or ctype in ("text/markdown", "text/plain"):
            raw = content.decode("utf-8", errors="replace")
            text = safe_text(raw)
            if not self.keyword_ok(url, "", text):
                return None, []
            doc = ScrapedDoc(
                url=url,
                title="",
                text=text,
                sections=[],
                fetched_at=fetched_at,
                status_code=status,
                content_type=ctype or "text/plain",
                metadata={"source_type": "markdown_or_text"},
            )
            return doc, []

        # HTML
        if "html" in ctype or ctype in ("text/html", ""):
            html = content.decode("utf-8", errors="replace")
            text, sections, title = extract_text_and_sections_from_html(html, url)

            # discover links (even if filtered later by max depth)
            discovered = self.extract_links(html, url)

            if not self.keyword_ok(url, title, text):
                # Still return discovered links? In keyword mode, we typically want
                # to crawl broadly but only store matched pages. We'll return links.
                return None, discovered

            doc = ScrapedDoc(
                url=url,
                title=title,
                text=text,
                sections=sections,
                fetched_at=fetched_at,
                status_code=status,
                content_type=ctype or "text/html",
                metadata={"source_type": "html"},
            )
            return doc, discovered

        # Unknown content-type: store minimal
        text = ""
        try:
            text = safe_text(content.decode("utf-8", errors="replace"))
        except Exception:
            text = ""
        if not self.keyword_ok(url, "", text):
            return None, []
        doc = ScrapedDoc(
            url=url,
            title="",
            text=text,
            sections=[],
            fetched_at=fetched_at,
            status_code=status,
            content_type=ctype,
            metadata={"source_type": "unknown"},
        )
        return doc, []

    def crawl(self, seeds: List[str]) -> List[ScrapedDoc]:
        """
        BFS crawl up to max_pages and max_depth, within allowlisted domains.
        Stores docs that match keyword filter (or all if no filter).
        """
        q = deque()
        for s in seeds:
            s = canonicalize_url(s)
            if should_keep_link(s, self.allow_domains):
                q.append((s, 0))

        while q and len(self.visited) < self.max_pages:
            url, depth = q.popleft()
            url = canonicalize_url(url)

            if url in self.visited:
                continue
            self.visited.add(url)

            if depth > self.max_depth:
                continue

            if self.delay > 0:
                time.sleep(self.delay)

            self.log(f"[{len(self.visited)}/{self.max_pages}] depth={depth} {url}")

            doc, links = self.scrape_url(url)
            if doc is not None:
                # Only keep if it has meaningful text (lowered threshold from 50 to 30 for algorithm pages)
                if doc.text and len(doc.text) > 30:
                    self.docs.append(doc)

            # enqueue next links
            if depth < self.max_depth:
                for lk in links:
                    lk = canonicalize_url(lk)
                    if lk not in self.visited and should_keep_link(lk, self.allow_domains):
                        q.append((lk, depth + 1))

        return self.docs


# ----------------------------
# CLI
# ----------------------------

def build_seed_set(use_sitemaps: bool, allow_domains: List[str], timeout: int, verbose: bool) -> List[str]:
    seeds = list(SEED_URLS)
    
    if verbose:
        print(f"[seeds] Starting with {len(seeds)} seed URLs", file=sys.stderr)

    if not use_sitemaps:
        if verbose:
            print(f"[seeds] Sitemaps disabled, using {len(seeds)} seed URLs", file=sys.stderr)
        return seeds

    session = requests.Session()
    session.headers.update({"User-Agent": UA})

    for d in allow_domains:
        if d == "raw.githubusercontent.com":
            continue  # no sitemaps
        try:
            sm_urls = try_sitemaps_for_domain(session, d, timeout=timeout)
            if verbose:
                print(f"[sitemap] {d}: {len(sm_urls)} urls", file=sys.stderr)
            # Keep only allowlisted and non-binary
            for u in sm_urls:
                if should_keep_link(u, allow_domains):
                    seeds.append(u)
        except Exception:
            continue

    # Dedup
    out = []
    seen = set()
    for u in seeds:
        u = canonicalize_url(u)
        if u and u not in seen:
            seen.add(u)
            out.append(u)
    return out


def docs_to_json(docs: List[ScrapedDoc]) -> List[Dict[str, Any]]:
    out = []
    for d in docs:
        out.append(
            {
                "url": d.url,
                "title": d.title,
                "text": d.text,
                "sections": d.sections,
                "fetched_at": d.fetched_at,
                "status_code": d.status_code,
                "content_type": d.content_type,
                "metadata": d.metadata,
            }
        )
    return out


def main():
    ap = argparse.ArgumentParser(description="High-recall Qiskit docs scraper (v2).")
    ap.add_argument("--out", type=str, default="comprehensive_qiskit_docs.json", help="Output JSON file")
    ap.add_argument("--max-pages", type=int, default=5000, help="Max pages to visit (increased for better coverage)")
    ap.add_argument("--max-depth", type=int, default=8, help="Max BFS depth (increased to reach deeper pages)")
    ap.add_argument("--delay", type=float, default=0.1, help="Delay between requests (seconds, default 0.1 to be respectful)")
    ap.add_argument("--timeout", type=int, default=20, help="Request timeout seconds")
    ap.add_argument("--use-sitemaps", action="store_true", help="Also seed crawl from sitemaps (recommended for comprehensive coverage)")
    ap.add_argument("--no-sitemaps", dest="use_sitemaps", action="store_false", help="Disable sitemap crawling")
    ap.set_defaults(use_sitemaps=True)
    ap.add_argument("--allow-domain", action="append", default=[], help="Allowlisted domain (repeatable)")
    ap.add_argument("--keyword", action="append", default=[], help="Only STORE pages matching keyword(s) (repeatable)")
    ap.add_argument("--quiet", action="store_true", help="Less logging")

    args = ap.parse_args()

    allow_domains = args.allow_domain[:] if args.allow_domain else DEFAULT_ALLOW_DOMAINS[:]
    verbose = not args.quiet

    seeds = build_seed_set(
        use_sitemaps=args.use_sitemaps,
        allow_domains=allow_domains,
        timeout=args.timeout,
        verbose=verbose,
    )

    if verbose:
        print(f"[init] allow_domains={allow_domains}", file=sys.stderr)
        print(f"[init] seeds={len(seeds)}", file=sys.stderr)
        if args.keyword:
            print(f"[init] keyword_filters={args.keyword}", file=sys.stderr)

    scraper = DocsScraper(
        allow_domains=allow_domains,
        max_pages=args.max_pages,
        max_depth=args.max_depth,
        delay=args.delay,
        timeout=args.timeout,
        keyword_filters=args.keyword or None,
        verbose=verbose,
    )
    
    if verbose:
        print(f"[init] Using sitemaps: {args.use_sitemaps}", file=sys.stderr)
        print(f"[init] Delay between requests: {args.delay}s", file=sys.stderr)
    docs = scraper.crawl(seeds)

    payload = {
        "meta": {
            "generated_at": now_iso(),
            "max_pages": args.max_pages,
            "max_depth": args.max_depth,
            "delay": args.delay,
            "timeout": args.timeout,
            "use_sitemaps": bool(args.use_sitemaps),
            "allow_domains": allow_domains,
            "keyword_filters": args.keyword,
            "num_docs": len(docs),
            "num_visited": len(scraper.visited),
        },
        "docs": docs_to_json(docs),
    }

    with open(args.out, "w", encoding="utf-8") as f:
        json.dump(payload, f, ensure_ascii=False, indent=2)

    if verbose:
        print(f"[done] wrote {args.out} with {len(docs)} docs (visited {len(scraper.visited)})", file=sys.stderr)


if __name__ == "__main__":
    main()
