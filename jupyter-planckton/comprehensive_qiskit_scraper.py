#!/usr/bin/env python3
"""
Comprehensive Qiskit Documentation Scraper
Specifically targets algorithm documentation, tutorials, and comprehensive API docs
"""

import requests
from bs4 import BeautifulSoup
import json
import time
import re
from urllib.parse import urljoin, urlparse
import os
from typing import Dict, List, Set, Tuple
import hashlib

class ComprehensiveQiskitScraper:
    def __init__(self):
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
        })
        self.visited_urls: Set[str] = set()
        self.docs_data: List[Dict] = []
        
    def scrape_comprehensive_docs(self) -> List[Dict]:
        """Scrape comprehensive Qiskit documentation from multiple sources"""
        print("🚀 Starting comprehensive Qiskit documentation scraping...")
        
        # Primary sources for comprehensive documentation
        sources = [
            {
                "name": "Qiskit.org Main Documentation",
                "url": "https://qiskit.org/documentation/",
                "priority": "high"
            },
            {
                "name": "Qiskit Tutorials",
                "url": "https://qiskit.org/documentation/tutorials/",
                "priority": "high"
            },
            {
                "name": "Qiskit API Documentation",
                "url": "https://qiskit.org/documentation/apidoc/",
                "priority": "high"
            },
            {
                "name": "Qiskit Algorithms Documentation",
                "url": "https://qiskit.org/documentation/apidoc/qiskit.algorithms.html",
                "priority": "high"
            },
            {
                "name": "Qiskit Circuit Library",
                "url": "https://qiskit.org/documentation/apidoc/qiskit.circuit.library.html",
                "priority": "high"
            },
            {
                "name": "Grover's Algorithm Documentation",
                "url": "https://qiskit.org/documentation/apidoc/qiskit.algorithms.amplitude_amplifiers.html",
                "priority": "critical"
            },
            {
                "name": "IBM Quantum Documentation",
                "url": "https://quantum.cloud.ibm.com/docs/en/api/qiskit",
                "priority": "high"
            }
        ]
        
        # Scrape each source
        for source in sources:
            print(f"\n📚 Scraping {source['name']}...")
            self._scrape_source(source)
            time.sleep(2)  # Be respectful to servers
        
        # Also scrape specific algorithm tutorials
        self._scrape_algorithm_tutorials()
        
        print(f"\n✅ Comprehensive scraping completed! Total pages: {len(self.docs_data)}")
        return self.docs_data
    
    def _scrape_source(self, source: Dict):
        """Scrape a specific documentation source"""
        try:
            # Scrape the main page
            self._scrape_page(source["url"], source["name"], source["priority"])
            
            # Find and scrape related pages
            self._scrape_related_pages(source["url"], source["name"])
            
        except Exception as e:
            print(f"❌ Error scraping {source['name']}: {e}")
    
    def _scrape_related_pages(self, base_url: str, source_name: str):
        """Find and scrape related pages from a source"""
        try:
            response = self.session.get(base_url, timeout=30)
            soup = BeautifulSoup(response.content, 'html.parser')
            
            # Find all links
            links = soup.find_all('a', href=True)
            
            for link in links:
                href = link['href']
                title = link.get_text(strip=True)
                
                # Only process meaningful links
                if title and len(title.strip()) > 2:
                    full_url = urljoin(base_url, href)
                    
                    # Check if it's a relevant Qiskit documentation link
                    if self._is_relevant_qiskit_link(full_url, title):
                        if full_url not in self.visited_urls:
                            print(f"  📄 Found related page: {title}")
                            self._scrape_page(full_url, f"{source_name} - {title}", "Related")
                            time.sleep(1)
                            
        except Exception as e:
            print(f"❌ Error finding related pages for {source_name}: {e}")
    
    def _is_relevant_qiskit_link(self, url: str, title: str) -> bool:
        """Check if a link is relevant to Qiskit documentation"""
        # Check URL patterns
        url_patterns = [
            r'qiskit\.org',
            r'quantum\.cloud\.ibm\.com',
            r'github\.com/Qiskit'
        ]
        
        # Check title keywords
        title_keywords = [
            'algorithm', 'grover', 'shor', 'vqe', 'qaoa', 'circuit', 'quantum',
            'tutorial', 'example', 'api', 'library', 'amplitude', 'amplifier',
            'optimization', 'variational', 'eigensolver', 'sampler', 'estimator'
        ]
        
        # Check if URL matches patterns
        url_match = any(re.search(pattern, url, re.IGNORECASE) for pattern in url_patterns)
        
        # Check if title contains relevant keywords
        title_match = any(keyword in title.lower() for keyword in title_keywords)
        
        return url_match and title_match
    
    def _scrape_page(self, url: str, title: str, priority: str = "normal") -> Dict:
        """Scrape a single documentation page"""
        if url in self.visited_urls:
            return {}
            
        self.visited_urls.add(url)
        print(f"  🔍 Scraping: {title}")
        
        try:
            response = self.session.get(url, timeout=30)
            response.raise_for_status()
            
            soup = BeautifulSoup(response.content, 'html.parser')
            
            # Extract content
            content = self._extract_comprehensive_content(soup)
            code_examples = self._extract_code_examples(soup)
            api_info = self._extract_api_information(soup)
            
            doc_entry = {
                'url': url,
                'title': title,
                'priority': priority,
                'content': content,
                'code_examples': code_examples,
                'api_info': api_info,
                'timestamp': time.time(),
                'hash': hashlib.md5(content.encode()).hexdigest()
            }
            
            self.docs_data.append(doc_entry)
            return doc_entry
            
        except Exception as e:
            print(f"❌ Error scraping {url}: {e}")
            return {}
    
    def _extract_comprehensive_content(self, soup: BeautifulSoup) -> str:
        """Extract comprehensive content from a page"""
        content = ""
        
        # Try multiple content extraction strategies
        content_selectors = [
            'main', 'article', '.content', '.documentation', 
            '.api-doc', '.tutorial-content', '.example-content'
        ]
        
        for selector in content_selectors:
            elements = soup.select(selector)
            if elements:
                for element in elements:
                    # Remove navigation and other non-content elements
                    for unwanted in element.find_all(['nav', 'header', 'footer', 'aside', '.navigation']):
                        unwanted.decompose()
                    
                    content += element.get_text(separator='\n', strip=True) + '\n\n'
        
        # If no specific content found, extract from body
        if not content.strip():
            body = soup.find('body')
            if body:
                content = body.get_text(separator='\n', strip=True)
        
        # Clean up content
        content = re.sub(r'\n\s*\n', '\n\n', content)
        content = re.sub(r'\s+', ' ', content)
        
        return content.strip()
    
    def _extract_code_examples(self, soup: BeautifulSoup) -> List[str]:
        """Extract code examples from the page"""
        code_examples = []
        
        # Look for various code block patterns
        code_selectors = [
            'pre code', 'code', 'pre', '.highlight', '.code-block',
            '.example-code', '.tutorial-code'
        ]
        
        for selector in code_selectors:
            blocks = soup.select(selector)
            for block in blocks:
                code = block.get_text()
                if code.strip() and len(code.strip()) > 10:
                    code_examples.append(code.strip())
        
        return list(set(code_examples))  # Remove duplicates
    
    def _extract_api_information(self, soup: BeautifulSoup) -> Dict:
        """Extract API information from the page"""
        api_info = {
            'functions': [],
            'classes': [],
            'parameters': {},
            'return_types': {}
        }
        
        # Look for function/class definitions
        content = soup.get_text()
        
        # Extract function definitions
        function_patterns = [
            r'def\s+(\w+)\s*\(([^)]*)\)',
            r'class\s+(\w+)',
            r'(\w+)\s*=\s*(\w+)'
        ]
        
        for pattern in function_patterns:
            matches = re.findall(pattern, content)
            for match in matches:
                if len(match) == 2:
                    api_info['functions'].append({
                        'name': match[0],
                        'signature': match[1]
                    })
        
        return api_info
    
    def _scrape_algorithm_tutorials(self):
        """Scrape specific algorithm tutorials"""
        print("\n🧮 Scraping algorithm tutorials...")
        
        algorithm_urls = [
            "https://qiskit.org/documentation/tutorials/algorithms/01_algorithms_introduction.html",
            "https://qiskit.org/documentation/tutorials/algorithms/02_vqe_convergence.html",
            "https://qiskit.org/documentation/tutorials/algorithms/03_vqe_simulation_with_noise.html",
            "https://qiskit.org/documentation/tutorials/algorithms/04_vqe_advanced.html",
            "https://qiskit.org/documentation/tutorials/algorithms/05_qaoa.html",
            "https://qiskit.org/documentation/tutorials/algorithms/06_grover.html",
            "https://qiskit.org/documentation/tutorials/algorithms/07_grover_examples.html",
            "https://qiskit.org/documentation/tutorials/algorithms/08_grover_optimizer.html"
        ]
        
        for url in algorithm_urls:
            try:
                self._scrape_page(url, f"Algorithm Tutorial: {url.split('/')[-1]}", "critical")
                time.sleep(1)
            except Exception as e:
                print(f"❌ Error scraping algorithm tutorial {url}: {e}")
    
    def save_documentation(self, filename: str = "comprehensive_qiskit_docs.json"):
        """Save comprehensive documentation"""
        with open(filename, 'w', encoding='utf-8') as f:
            json.dump({
                'metadata': {
                    'scraped_at': time.time(),
                    'total_pages': len(self.docs_data),
                    'scraper_version': 'comprehensive_v1.0'
                },
                'documentation': self.docs_data
            }, f, indent=2, ensure_ascii=False)
        
        print(f"💾 Comprehensive documentation saved to {filename}")

def main():
    """Main function to run comprehensive scraping"""
    scraper = ComprehensiveQiskitScraper()
    
    # Scrape comprehensive documentation
    docs = scraper.scrape_comprehensive_docs()
    
    # Save to file
    scraper.save_documentation()
    
    print(f"\n🎉 Comprehensive scraping completed!")
    print(f"📊 Total documentation pages: {len(docs)}")
    print(f"🔍 Check comprehensive_qiskit_docs.json for results")

if __name__ == "__main__":
    main()

