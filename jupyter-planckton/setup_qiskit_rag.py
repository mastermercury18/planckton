#!/usr/bin/env python3
"""
Setup script for Qiskit RAG System
Installs dependencies, scrapes documentation, and sets up the system
"""

import subprocess
import sys
import os
import time

def run_command(command, description):
    """Run a command and handle errors"""
    print(f"\n🔄 {description}...")
    print(f"Running: {command}")
    
    try:
        result = subprocess.run(command, shell=True, check=True, capture_output=True, text=True)
        print(f"✅ {description} completed successfully")
        if result.stdout:
            print(f"Output: {result.stdout}")
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ {description} failed with error code {e.returncode}")
        if e.stderr:
            print(f"Error: {e.stderr}")
        return False

def install_dependencies():
    """Install required Python packages"""
    packages = [
        "requests",
        "beautifulsoup4", 
        "scikit-learn",
        "numpy",
        "openai",
        "lxml"
    ]
    
    for package in packages:
        if not run_command(f"pip install {package}", f"Installing {package}"):
            return False
    
    return True

def scrape_documentation():
    """Run the documentation scraper with comprehensive settings"""
    if not os.path.exists("qiskit_docs_scraper.py"):
        print("❌ Documentation scraper not found!")
        return False
    
    # Use comprehensive settings: sitemaps enabled, higher limits, small delay
    command = "python3 qiskit_docs_scraper.py --use-sitemaps --max-pages 5000 --max-depth 8 --delay 0.1 --out comprehensive_qiskit_docs.json"
    return run_command(command, "Scraping Qiskit documentation (comprehensive mode)")

def test_rag_system():
    """Test the RAG system"""
    if not os.path.exists("qiskit_rag_system.py"):
        print("❌ RAG system not found!")
        return False
    
    return run_command("python3 qiskit_rag_system.py", "Testing RAG system")

def main():
    """Main setup function"""
    print("🚀 Setting up Qiskit RAG System for Planckton AI Assistant")
    print("=" * 60)
    
    # Check Python version
    if sys.version_info < (3, 8):
        print("❌ Python 3.8+ is required")
        sys.exit(1)
    
    print(f"✅ Python {sys.version_info.major}.{sys.version_info.minor} detected")
    
    # Install dependencies
    if not install_dependencies():
        print("❌ Failed to install dependencies")
        sys.exit(1)
    
    # Scrape documentation
    if not scrape_documentation():
        print("❌ Failed to scrape documentation")
        sys.exit(1)
    
    # Test RAG system
    if not test_rag_system():
        print("❌ Failed to test RAG system")
        sys.exit(1)
    
    print("\n🎉 Setup completed successfully!")
    print("\nNext steps:")
    print("1. Restart your Jupyter notebook server")
    print("2. Open the Planckton AI Assistant")
    print("3. Ask questions about Qiskit - the AI will now use the latest documentation!")
    print("\nThe system will automatically:")
    print("- Search through the latest Qiskit docs (including VQE, algorithms, and more)")
    print("- Provide relevant code examples")
    print("- Give up-to-date API information")
    print("- Fall back to general knowledge when needed")
    print("\n📚 Comprehensive coverage includes:")
    print("- VQE (Variational Quantum Eigensolver) and related algorithms")
    print("- Grover's algorithm and amplitude amplification")
    print("- QAOA and optimization algorithms")
    print("- Quantum primitives (Sampler, Estimator)")
    print("- Circuit library and quantum information")
    print("- All Qiskit ecosystem packages")

if __name__ == "__main__":
    main()
