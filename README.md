# Planckton: Jupyter-Native Quantum Computing Co-Pilot

[![Python 3.9+](https://img.shields.io/badge/python-3.9+-blue.svg)](https://www.python.org/downloads/)
[![License: BSD-3-Clause](https://img.shields.io/badge/License-BSD--3--Clause-blue.svg)](LICENSE)
[![Jupyter Notebook](https://img.shields.io/badge/Jupyter-Notebook-orange.svg)](https://jupyter.org/)

**Planckton** is an intelligent quantum development assistant integrated directly into Jupyter Notebook. It combines the power of OpenAI's GPT models with a sophisticated **Retrieval-Augmented Generation (RAG)** system that provides real-time, context-aware assistance for quantum computing, quantum algorithms, and quantum software development.

![Planckton SS](planckton-ss.png)

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
python3 -m venv .venv

# Activate virtual environment
source .venv/bin/activate  # On macOS/Linux
# or
.venv\Scripts\activate  # On Windows
```

### 3. Install Python Dependencies

```bash
python3 -m pip install --upgrade pip
python3 -m pip install -r requirements.txt
python3 -m pip install -r requirements_rag.txt
python3 -m pip install -e .
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
3. Click the plankton button in the notebook toolbar
4. Start chatting with your quantum AI assistant!

## 📖 Usage Guide

### Example Prompts

- "Using the latest version/documentation of Qiskit, construct a Bell State circuit and simulate using the Aer simulator. Visualize the results in a histogram."
- "Using the latest version/documentation of Qiskit, simulate quantum phase estimation with four qubits (3 for QPE, 1 for the eigenstate) using the Aer simulator. Visualize the results in a histogram."
- "Explain the Variational Quantum Eigensolver (VQE) algorithm"
- "What's the difference between `AerSimulator` and `qasm_simulator`?"
- "How do I transpile a circuit for a specific backend?"


## ⚙️ Configuration

### Using a Different OpenAI Model

Edit `notebook/app.py` and change the model in `PlancktonHandler._process_with_rag()`:

```python
response = openai.chat.completions.create(
    model="gpt-4-turbo-preview",  # Change to your preferred model
    messages=openai_messages,
    max_completion_tokens=1024,
)
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
