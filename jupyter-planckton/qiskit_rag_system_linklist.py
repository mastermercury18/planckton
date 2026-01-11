#!/usr/bin/env python3
"""
Qiskit RAG (Retrieval-Augmented Generation) System
Integrates scraped Qiskit documentation with chat responses
"""

import json
import re
from typing import List, Dict, Tuple
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import openai
import os

class QiskitRAGSystem:
    def __init__(self, docs_file: str = "comprehensive_qiskit_docs.json"):
        """
        docs_file should be produced by qiskit_docs_scraper_linklist.py (URL-list driven)
        or any compatible JSON with a top-level "docs" list.
        """
        self.docs_file = docs_file
        self.documentation = []
        self.search_index = {}
        # Increased max_features and improved ngram_range for better VQE/algorithms matching
        self.vectorizer = TfidfVectorizer(
            max_features=2000,  # Increased from 1000 for better coverage
            stop_words='english',
            ngram_range=(1, 3),  # Increased to 3-grams to capture "variational quantum eigensolver"
            min_df=1,  # Include all terms
            max_df=0.95  # Exclude very common terms
        )
        self.docs_vectors = None
        self.load_documentation()
        
    def load_documentation(self):
        """Load the scraped documentation"""
        try:
            with open(self.docs_file, 'r', encoding='utf-8') as f:
                data = json.load(f)
                # Support both old format (with 'documentation' key) and new format (with 'docs' key)
                if 'docs' in data:
                    self.documentation = data['docs']
                elif 'documentation' in data:
                    self.documentation = data['documentation']
                else:
                    # If it's a list directly
                    self.documentation = data if isinstance(data, list) else []
                self.search_index = data.get('section_hierarchy', {})
            
            print(f"Loaded {len(self.documentation)} documentation pages")
            
            # Create TF-IDF vectors for semantic search
            if self.documentation:
                self._create_search_vectors()
            else:
                print("Warning: No documentation loaded. Check the file format.")
                
        except FileNotFoundError:
            print(f"Documentation file {self.docs_file} not found. Run the scraper first.")
        except Exception as e:
            print(f"Error loading documentation: {e}")
            import traceback
            traceback.print_exc()
    
    def _create_search_vectors(self):
        """Create TF-IDF vectors for semantic search"""
        # Prepare text for vectorization with enhanced content extraction
        texts = []
        for doc in self.documentation:
            # Combine title, content, and sections for better search
            # Support both old format (content) and new format (text)
            content = doc.get('text', '') or doc.get('content', '')
            title = doc.get('title', '')
            
            # Add sections if available
            sections_text = ""
            sections = doc.get('sections', [])
            if sections:
                for section in sections:
                    sections_text += f" {section.get('heading', '')} {section.get('text', '')}"
            
            # Combine all text sources
            text = f"{title} {content} {sections_text}"
            texts.append(text)
        
        # Create TF-IDF vectors
        self.docs_vectors = self.vectorizer.fit_transform(texts)
        print(f"Created search vectors for {len(texts)} documents")
    
    def search_documentation(self, query: str, top_k: int = 5) -> List[Dict]:
        """Search for relevant documentation based on query"""
        if not self.documentation or self.docs_vectors is None:
            return []
        
        # Expand query with synonyms for better matching (especially for VQE)
        expanded_query = self._expand_query(query)
        
        # Vectorize the query
        query_vector = self.vectorizer.transform([expanded_query])
        
        # Calculate similarities
        similarities = cosine_similarity(query_vector, self.docs_vectors).flatten()
        
        # Get top-k most similar documents (increased from 3 to 5)
        top_indices = np.argsort(similarities)[::-1][:top_k]
        
        results = []
        for idx in top_indices:
            # Lower threshold from 0.1 to 0.05 to include more results
            if similarities[idx] > 0.05:
                doc = self.documentation[idx]
                # Support both old format (content) and new format (text)
                content = doc.get('text', '') or doc.get('content', '')
                
                # Extract code blocks from sections if available
                code_examples = doc.get('code_examples', [])
                sections = doc.get('sections', [])
                if sections and not code_examples:
                    for section in sections:
                        code_blocks = section.get('code_blocks', [])
                        if code_blocks:
                            code_examples.extend(code_blocks)
                
                results.append({
                    'title': doc.get('title', ''),
                    'content': content[:1000] + '...' if len(content) > 1000 else content,  # Increased from 500
                    'url': doc.get('url', ''),
                    'relevance_score': float(similarities[idx]),
                    'code_examples': code_examples[:3],  # Increased from 2 to 3
                    'api_info': doc.get('api_info', {}),
                    'sections': sections[:5] if sections else []  # Include sections for context
                })
        
        return results
    
    def _expand_query(self, query: str) -> str:
        """Expand query with synonyms and related terms for better matching"""
        query_lower = query.lower()
        expanded = query
        
        # VQE-specific expansions
        if 'vqe' in query_lower or 'variational quantum eigensolver' in query_lower:
            expanded += " variational quantum eigensolver VQE minimum eigenstate eigenvalue optimization"
        
        # Algorithm-related expansions
        if 'algorithm' in query_lower:
            expanded += " quantum algorithm optimization solver"
        
        # Circuit-related expansions
        if 'circuit' in query_lower:
            expanded += " quantum circuit gate qubit"
        
        return expanded
    
    def get_context_for_query(self, query: str, max_context_length: int = 3000) -> str:
        """Get relevant documentation context for a query"""
        # Increased top_k from 3 to 5 for better coverage
        relevant_docs = self.search_documentation(query, top_k=5)
        
        if not relevant_docs:
            return ""
        
        context_parts = []
        current_length = 0
        
        for doc in relevant_docs:
            # Add title and most relevant content
            doc_context = f"## {doc['title']}\nURL: {doc['url']}\nRelevance: {doc['relevance_score']:.3f}\n\n{doc['content']}\n"
            
            # Add sections if available (especially useful for VQE tutorials)
            if doc.get('sections'):
                doc_context += "\n**Sections:**\n"
                for section in doc['sections'][:3]:  # Limit to 3 sections
                    heading = section.get('heading', '')
                    text = section.get('text', '')[:300]  # Truncate section text
                    if heading:
                        doc_context += f"\n### {heading}\n{text}\n"
            
            # Add code examples if available
            if doc['code_examples']:
                doc_context += "\n**Code Examples:**\n"
                for code in doc['code_examples']:
                    doc_context += f"```python\n{code}\n```\n"
            
            # Add API information if available
            if doc['api_info'].get('functions'):
                doc_context += "\n**API Functions:**\n"
                for func in doc['api_info']['functions'][:3]:  # Limit to 3 functions
                    doc_context += f"- {func['name']}({func['signature']})\n"
            
            # Check if adding this would exceed context limit
            if current_length + len(doc_context) > max_context_length:
                break
            
            context_parts.append(doc_context)
            current_length += len(doc_context)
        
        return "\n\n".join(context_parts)
    
    def enhance_chat_response(self, user_message: str, chat_history: List[Dict]) -> str:
        """Enhance chat response with relevant Qiskit documentation"""
        # Get relevant context
        context = self.get_context_for_query(user_message)
        
        if not context:
            return "I don't have specific Qiskit documentation context for this query, but I can help based on my general knowledge."
        
        # Create enhanced prompt
        enhanced_prompt = f"""You are a Qiskit expert assistant. Use the following documentation context to provide accurate, up-to-date information:

{context}

User Question: {user_message}

Please provide a comprehensive answer using the documentation context above. If the context doesn't fully answer the question, use your general knowledge to fill in any gaps. Always cite specific information from the documentation when possible."""

        return enhanced_prompt
    
    def get_quick_reference(self, topic: str) -> Dict:
        """Get quick reference information for a specific topic"""
        # Search for the topic
        results = self.search_documentation(topic, top_k=1)
        
        if not results:
            return {}
        
        doc = results[0]
        
        return {
            'topic': topic,
            'title': doc['title'],
            'summary': doc['content'][:200] + '...',
            'url': doc['url'],
            'code_examples': doc['code_examples'],
            'api_info': doc['api_info']
        }

class EnhancedPlancktonHandler:
    """Enhanced Planckton handler with RAG integration"""
    
    def __init__(self):
        self.rag_system = QiskitRAGSystem()
        self.openai_client = openai.OpenAI(api_key=os.environ.get("OPENAI_API_KEY"))
    
    def process_message(self, message: str, history: List[Dict]) -> str:
        """Process a message with RAG enhancement"""
        try:
            # Get enhanced context
            enhanced_prompt = self.rag_system.enhance_chat_response(message, history)
            
            # Prepare messages for OpenAI
            openai_messages = [
                {"role": "system", "content": enhanced_prompt},
                {"role": "user", "content": message}
            ]
            
            # Add conversation history
            for msg in history[-5:]:  # Last 5 messages for context
                role = "assistant" if msg.get("sender") == "planckton" else "user"
                openai_messages.insert(-1, {"role": role, "content": msg.get("text", "")})
            
            # Get response from OpenAI
            response = self.openai_client.chat.completions.create(
                model=os.environ.get("OPENAI_MODEL", "gpt-4o-mini"),
                messages=openai_messages,
                max_completion_tokens=1024,
                temperature=0.7
            )
            
            return response.choices[0].message.content
            
        except Exception as e:
            print(f"Error in enhanced handler: {e}")
            return f"I encountered an error while processing your request: {str(e)}"

def test_rag_system():
    """Test the RAG system"""
    rag = QiskitRAGSystem()
    
    # Test queries
    test_queries = [
        "How do I create a quantum circuit?",
        "What is the QuantumCircuit class?",
        "How to use transpiler passes?",
        "What are quantum primitives?"
    ]
    
    for query in test_queries:
        print(f"\nQuery: {query}")
        context = rag.get_context_for_query(query)
        if context:
            print(f"Context length: {len(context)} characters")
            print(f"Context preview: {context[:200]}...")
        else:
            print("No context found")

if __name__ == "__main__":
    test_rag_system()
