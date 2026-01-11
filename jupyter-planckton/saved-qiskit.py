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