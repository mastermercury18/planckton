#!/usr/bin/env bash
set -e

# --------------------------------------------
# Planckton – minimal prototype launcher
# --------------------------------------------

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PORT=8890

echo ""
echo "🚀 Starting Planckton Quantum AI Assistant"
echo "📁 Project root: $PROJECT_ROOT"
echo ""

cd "$PROJECT_ROOT"

# --------------------------------------------
# Activate virtual environment
# --------------------------------------------
if [ ! -d ".venv" ]; then
  echo "❌ .venv not found. Please create it first:"
  echo "   python -m venv .venv"
  exit 1
fi

echo "🔹 Activating virtual environment..."
source .venv/bin/activate

# --------------------------------------------
# Run Qiskit RAG setup
# --------------------------------------------
echo ""
echo "🔹 Running Qiskit RAG setup..."
python3 setup_qiskit_rag_linklist.py

# --------------------------------------------
# Start Jupyter Notebook server
# --------------------------------------------
echo ""
echo "🔹 Starting Jupyter Notebook server..."
echo "🌐 Open: http://localhost:$PORT"
echo ""

jupyter-notebook \
  --no-browser \
  --port=$PORT \
  --NotebookApp.token='' \
  --NotebookApp.password='' \
  --ServerApp.root_dir="$PROJECT_ROOT"

# --------------------------------------------
# OPTIONAL: Public sharing (commented)
# --------------------------------------------
# To share publicly (for demos only):
#   1. Install ngrok
#   2. Uncomment below
#
# echo "🌍 Starting ngrok tunnel..."
# ngrok http $PORT
