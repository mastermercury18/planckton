# 🚀 Planckton: Quantum AI Assistant for Jupyter Notebook

[![Python 3.9+](https://img.shields.io/badge/python-3.9+-blue.svg)](https://www.python.org/downloads/)
[![License: BSD-3-Clause](https://img.shields.io/badge/License-BSD--3--Clause-blue.svg)](LICENSE)
[![Jupyter Notebook](https://img.shields.io/badge/Jupyter-Notebook-orange.svg)](https://jupyter.org/)

**Planckton** is an intelligent quantum development assistant integrated directly into Jupyter Notebook. It combines the power of OpenAI's GPT models with a sophisticated **Retrieval-Augmented Generation (RAG)** system that provides real-time, context-aware assistance for quantum computing, quantum algorithms, and quantum software development.

<img width="1461" height="762" alt="Screenshot 2025-09-09 at 9 22 47 PM" src="https://github.com/user-attachments/assets/18e9b559-1b78-4bc2-8826-b845f6be4fd5" />
<img width="773" height="456" alt="Screenshot 2025-09-09 at 10 00 11 PM" src="https://github.com/user-attachments/assets/c55b56ec-25e4-49d2-bcee-ca7c247f9312" />

## ✨ Features

### 🤖 Intelligent Quantum Assistant
- **Context-Aware Responses**: Powered by OpenAI's GPT-4 Turbo with conversation history
- **Quantum Algorithm Guidance**: Get help with quantum algorithms, circuit design, and quantum gates
- **Quantum Code Generation**: Generate quantum circuits, quantum programs, and quantum algorithms
- **Multi-Framework Support**: Specialized assistance for Qiskit, Cirq, PennyLane, and other quantum frameworks
- **Real-Time Assistance**: Instant AI responses without leaving your notebook workflow

### 📚 RAG-Powered Documentation System
- **Up-to-Date Qiskit Documentation**: Automatically scrapes and indexes the latest Qiskit documentation
- **Semantic Search**: Uses TF-IDF vectorization and cosine similarity to find relevant documentation
- **Enhanced Context**: Retrieves and includes relevant documentation snippets in AI responses
- **Comprehensive Coverage**: Includes VQE, Grover's algorithm, QAOA, quantum primitives, and more
- **2025 API Support**: Always uses the latest Qiskit APIs and syntax

### 🎨 User Experience
- **Side Panel Interface**: Access Planckton through a dedicated side panel that doesn't interfere with your workflow
- **Code Block Support**: AI responses include formatted code blocks with syntax highlighting
- **Copy-to-Clipboard**: One-click copying of generated quantum circuits and algorithms
- **Conversation History**: Maintains context across multiple interactions
- **Auto-Resizing Input**: Smart textarea that adapts to your message length

## 🏗️ Architecture

Planckton is built on top of Jupyter Notebook v7 and consists of:

- **Frontend**: React-based side panel extension (`packages/notebook-extension/src/planckton.tsx`)
- **Backend**: Python API handler integrated into Jupyter Server (`notebook/app.py`)
- **RAG System**: Python-based documentation retrieval system (`qiskit_rag_system.py`)
- **Documentation Scraper**: Automated Qiskit documentation scraper (`qiskit_docs_scraper_linklist.py`)

```
┌─────────────────────────────────────────────────────────┐
│                    Jupyter Notebook UI                    │
│  ┌──────────────┐  ┌──────────────────────────────────┐ │
│  │   Notebook   │  │   Planckton Side Panel (React)   │ │
│  │   Editor     │  │   - Chat Interface               │ │
│  │              │  │   - Code Blocks                  │ │
│  │              │  │   - Copy Buttons                 │ │
│  └──────────────┘  └──────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────┐
│              Jupyter Server (Python)                     │
│  ┌──────────────────────────────────────────────────┐  │
│  │         PlancktonHandler (/api/planckton)        │  │
│  │  - Receives chat messages                        │  │
│  │  - Integrates with RAG system                    │  │
│  │  - Calls OpenAI API                              │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────┐
│              RAG System (Python)                         │
│  ┌──────────────────────────────────────────────────┐  │
│  │         QiskitRAGSystem                          │  │
│  │  - TF-IDF Vectorization                          │  │
│  │  - Semantic Search                               │  │
│  │  - Documentation Retrieval                        │  │
│  └──────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────┐  │
│  │    comprehensive_qiskit_docs.json                 │  │
│  │    (Scraped Qiskit Documentation)                │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

## 📋 Prerequisites

Before you begin, ensure you have:

- **Python 3.9+** installed
- **Node.js 18+** and npm/yarn (for building the extension)
- **OpenAI API Key** ([Get one here](https://platform.openai.com/))
- **Git** (for cloning the repository)

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone <repository-url>
cd jupyter-planckton
```

### 2. Set Up Python Environment

```bash
# Create virtual environment
python -m venv .venv

# Activate virtual environment
source .venv/bin/activate  # On macOS/Linux
# or
.venv\Scripts\activate  # On Windows
```

### 3. Install Python Dependencies

```bash
pip install -r requirements.txt
```

### 4. Set Up OpenAI API Key

```bash
export OPENAI_API_KEY="your-openai-api-key-here"
```

Or add it to your shell profile (`~/.bashrc`, `~/.zshrc`, etc.):

```bash
echo 'export OPENAI_API_KEY="your-openai-api-key-here"' >> ~/.zshrc
source ~/.zshrc
```

### 5. Install JavaScript Dependencies

```bash
# Install dependencies using jlpm (Jupyter's yarn wrapper)
jlpm install
```

### 6. Build the Extension

```bash
# Build the Planckton extension
jlpm build:prod
```

### 7. Run Planckton

Use the provided launch script:

```bash
chmod +x run_planckton.sh
./run_planckton.sh
```

Or run manually:

```bash
# Activate virtual environment
source .venv/bin/activate

# Run Qiskit RAG setup (scrapes documentation)
python setup_qiskit_rag_linklist.py

# Start Jupyter Notebook
jupyter notebook \
  --no-browser \
  --port=8890 \
  --NotebookApp.token='' \
  --NotebookApp.password='' \
  --ServerApp.root_dir="$(pwd)"
```

The script will:
1. ✅ Check for virtual environment
2. ✅ Activate the virtual environment
3. ✅ Run Qiskit RAG setup (scrapes and indexes documentation)
4. ✅ Start Jupyter Notebook server on port 8890

### 8. Access Planckton

1. Open your browser to `http://localhost:8890`
2. Create or open a notebook
3. Click the **🤖 Planckton** button in the notebook toolbar
4. Start chatting with your quantum AI assistant!

## 📖 Usage Guide

### Basic Usage

1. **Open Planckton**: Click the Planckton icon (🤖) in the notebook toolbar
2. **Ask Questions**: Type your question about quantum computing, Qiskit, algorithms, etc.
3. **Get Responses**: Receive AI-generated responses with code examples and explanations
4. **Copy Code**: Click the copy button on any code block to copy it to your clipboard
5. **Continue Conversation**: Build on previous responses for more detailed assistance

### Example Questions

- "How do I create a quantum circuit with Qiskit?"
- "Explain the Variational Quantum Eigensolver (VQE) algorithm"
- "Show me how to use Grover's algorithm for search"
- "What's the difference between `AerSimulator` and `qasm_simulator`?"
- "How do I transpile a circuit for a specific backend?"

### RAG System Features

The RAG system automatically:
- **Searches** the latest Qiskit documentation for relevant information
- **Retrieves** the most relevant documentation snippets
- **Enhances** AI responses with up-to-date API information
- **Provides** accurate code examples using current Qiskit syntax

## ⚙️ Configuration

### Customizing the Port

Edit `run_planckton.sh` and change the `PORT` variable:

```bash
PORT=8890  # Change to your preferred port
```

### Using a Different OpenAI Model

Edit `notebook/app.py` and change the model in `PlancktonHandler._process_with_rag()`:

```python
response = openai.chat.completions.create(
    model="gpt-4-turbo-preview",  # Change to your preferred model
    messages=openai_messages,
    max_completion_tokens=1024,
)
```

### RAG System Configuration

The RAG system can be configured in `qiskit_rag_system.py`:

- **Documentation File**: Change `docs_file` parameter in `QiskitRAGSystem.__init__()`
- **Search Parameters**: Adjust `top_k` in `get_context_for_query()` for more/fewer results
- **Vectorization**: Modify `TfidfVectorizer` parameters for different search behavior

## 🛠️ Development

### Building from Source

```bash
# Install dependencies
jlpm install

# Build in development mode (with hot reloading)
jlpm develop

# Build for production
jlpm build:prod
```

### Project Structure

```
jupyter-planckton/
├── app/                          # Jupyter Notebook app configuration
├── notebook/                      # Notebook server code
│   └── app.py                    # PlancktonHandler API endpoint
├── packages/                      # JupyterLab extensions
│   └── notebook-extension/       # Planckton extension
│       ├── src/
│       │   └── planckton.tsx     # React chat interface
│       └── style/                # CSS styles
├── qiskit_rag_system.py          # RAG system implementation
├── qiskit_docs_scraper_linklist.py  # Documentation scraper
├── setup_qiskit_rag_linklist.py  # Setup script
├── run_planckton.sh              # Launch script
├── requirements.txt              # Python dependencies
└── package.json                  # JavaScript dependencies
```

### Key Files

- **Frontend**: `packages/notebook-extension/src/planckton.tsx` - React component for chat interface
- **Backend**: `notebook/app.py` - Python handler for AI API integration
- **RAG System**: `qiskit_rag_system.py` - Documentation retrieval and search
- **Scraper**: `qiskit_docs_scraper_linklist.py` - Qiskit documentation scraper

### Running Tests

```bash
# Run Python tests
pytest tests/

# Run JavaScript tests
jlpm test
```

## 🐛 Troubleshooting

### RAG System Not Initializing

**Problem**: `[Planckton] RAG system not available, falling back to basic mode`

**Solution**:
1. Ensure `comprehensive_qiskit_docs.json` exists in the project root
2. Run the setup script: `python setup_qiskit_rag_linklist.py`
3. Check that all dependencies are installed: `pip install -r requirements.txt`

### OpenAI API Errors

**Problem**: API errors or "Invalid API key" messages

**Solution**:
1. Verify your API key is set: `echo $OPENAI_API_KEY`
2. Check your API key is valid at [OpenAI Platform](https://platform.openai.com/)
3. Ensure you have API credits available

### Extension Not Appearing

**Problem**: Planckton button doesn't appear in the toolbar

**Solution**:
1. Rebuild the extension: `jlpm build:prod`
2. Restart the Jupyter server
3. Clear browser cache and hard refresh (Ctrl+Shift+R or Cmd+Shift+R)
4. Check browser console for errors (F12)

### Port Already in Use

**Problem**: `Address already in use` error

**Solution**:
1. Change the port in `run_planckton.sh`: `PORT=8891`
2. Or kill the process using the port:
   ```bash
   lsof -ti:8890 | xargs kill -9
   ```

### Documentation Not Loading

**Problem**: RAG system can't find documentation

**Solution**:
1. Run the scraper: `python setup_qiskit_rag_linklist.py`
2. Check that `comprehensive_qiskit_docs.json` exists and is not empty
3. Verify file permissions: `ls -la comprehensive_qiskit_docs.json`

## 📚 Additional Resources

- [Jupyter Notebook Documentation](https://jupyter-notebook.readthedocs.io/)
- [Qiskit Documentation](https://qiskit.org/documentation/)
- [OpenAI API Documentation](https://platform.openai.com/docs/)
- [JupyterLab Extension Development](https://jupyterlab.readthedocs.io/en/stable/extension/extension_dev.html)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

### Development Workflow

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Test thoroughly
5. Commit your changes: `git commit -m 'Add amazing feature'`
6. Push to the branch: `git push origin feature/amazing-feature`
7. Open a Pull Request

## 📄 License

This project is licensed under the BSD-3-Clause License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built on top of [Jupyter Notebook](https://github.com/jupyter/notebook)
- Powered by [OpenAI](https://openai.com/) GPT models
- Quantum computing documentation from [Qiskit](https://qiskit.org/)

## 📧 Support

For issues, questions, or contributions, please open an issue on the GitHub repository.

---

**Made with ❤️ for the quantum computing community**
