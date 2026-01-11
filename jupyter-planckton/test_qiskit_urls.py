#!/usr/bin/env python3
"""
Test script to check which Qiskit documentation URLs actually work
"""

import requests
from urllib.parse import urljoin

def test_urls():
    """Test various Qiskit documentation URLs to see which ones work"""
    base_url = "https://quantum.cloud.ibm.com/docs/en/api/qiskit"
    
    # Test different URL patterns
    test_patterns = [
        "/circuit",
        "/quantum_info", 
        "/transpiler",
        "/primitives",
        "/providers",
        "/result",
        "/visualization",
        "/compiler",
        "/converters",
        "/dagcircuit",
        "/passmanager",
        "/synthesis",
        "/circuit/library",
        "/circuit/random",
        "/transpiler/passes",
        "/primitives/sampler",
        "/primitives/estimator"
    ]
    
    working_urls = []
    
    for pattern in test_patterns:
        url = base_url + pattern
        try:
            response = requests.get(url, timeout=10)
            status = response.status_code
            if status == 200:
                print(f"✅ {url} - Status: {status}")
                working_urls.append(url)
            else:
                print(f"❌ {url} - Status: {status}")
        except Exception as e:
            print(f"❌ {url} - Error: {e}")
    
    print(f"\n🎯 Found {len(working_urls)} working URLs:")
    for url in working_urls:
        print(f"  - {url}")
    
    return working_urls

if __name__ == "__main__":
    test_urls()
