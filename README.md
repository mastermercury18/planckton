# Jupyter Notebook with Planckton AI Assistant

![Github Actions Status](https://github.com/jupyter/notebook/workflows/Build/badge.svg)
[![Documentation Status](https://readthedocs.org/projects/jupyter-notebook/badge/?version=latest)](https://jupyter-notebook.readthedocs.io/en/latest/?badge=latest)
[![Binder](https://mybinder.org/badge_logo.svg)](https://mybinder.org/v2/gh/jupyter/notebook/main?urlpath=tree)
[![Gitpod](https://img.shields.io/badge/gitpod_editor-open-blue.svg)](https://gitpod.io/#https://github.com/jupyter/notebook)

The Jupyter notebook is a web-based notebook environment for interactive computing, now enhanced with **Planckton AI Assistant** - an intelligent code editor and chatbot side panel that provides real-time AI assistance for your coding and data science workflows.

![Jupyter notebook example](docs/resources/running_code_med.png 'Jupyter notebook example')

## 🤖 Planckton AI Assistant

Planckton is an AI-powered coding assistant integrated directly into Jupyter Notebook. It provides:

- **Real-time AI Chat**: Ask questions about your code, get explanations, and receive coding suggestions
- **Code Generation**: Generate code snippets and complete functions based on your requirements
- **Code Explanation**: Get detailed explanations of complex code blocks
- **Debugging Help**: Receive assistance with error messages and debugging
- **Best Practices**: Get recommendations for code optimization and best practices
- **Context-Aware Responses**: AI responses that understand your current notebook context

### Features

- **Side Panel Interface**: Access Planckton through a dedicated side panel that doesn't interfere with your notebook workflow
- **Code Block Support**: AI responses can include formatted code blocks with syntax highlighting
- **Copy-to-Clipboard**: Easy copying of generated code snippets
- **Conversation History**: Maintain context across multiple interactions
- **Real-time Responses**: Powered by OpenAI's GPT models for intelligent assistance

### How to Use Planckton

1. **Launch the Assistant**: Click the Planckton button (🤖) in the notebook toolbar
2. **Ask Questions**: Type your questions about code, debugging, or data science concepts
3. **Get AI Responses**: Receive intelligent responses with code examples and explanations
4. **Copy Code**: Click the copy button on any code block to copy it to your clipboard
5. **Continue Conversations**: Build on previous responses for more detailed assistance

## Maintained versions

We maintain the **two most recently released major versions of Jupyter Notebook**,
Classic Notebook v6 and Notebook v7. Notebook v5 is no longer maintained.
All Notebook v5 users are strongly advised to upgrade to Classic Notebook v6 as soon as possible.

Upgrading to Notebook v7 may require more work, if you use custom extensions, as extensions written
for Notebook v5 or Classic Notebook v6 are not compatible with Notebook v7.

### Notebook v7

The newest major version of Notebook is based on:

- JupyterLab components for the frontend
- Jupyter Server for the Python server

This represents a significant change to the `jupyter/notebook` code base.

To learn more about Notebook v7: https://jupyter.org/enhancement-proposals/79-notebook-v7/notebook-v7.html

### Classic Notebook v6

Maintenance and security-related issues [only](https://github.com/jupyter/notebook-team-compass/issues/5#issuecomment-1085254000) are now being addressed in the [`6.5.x`](https://github.com/jupyter/notebook/tree/6.5.x) branch.
It depends on [`nbclassic`](https://github.com/jupyter/nbclassic) for the HTML/JavaScript/CSS assets.

New features and continuous improvement is now focused on Notebook v7 (see section above).

If you have an open pull request with a new feature or if you were planning to open one, we encourage switching over to the Jupyter Server and JupyterLab architecture, and distribute it as a server extension and / or JupyterLab prebuilt extension. That way your new feature will also be compatible with the new Notebook v7.

## Jupyter notebook, the language-agnostic evolution of IPython notebook

Jupyter notebook is a language-agnostic HTML notebook application for
Project Jupyter. In 2015, Jupyter notebook was released as a part of
The Big Split™ of the IPython codebase. IPython 3 was the last major monolithic
release containing both language-agnostic code, such as the _IPython notebook_,
and language specific code, such as the _IPython kernel for Python_. As
computing spans across many languages, Project Jupyter will continue to develop the
language-agnostic **Jupyter notebook** in this repo and with the help of the
community develop language specific kernels which are found in their own
discrete repos.

- [The Big Split™ announcement](https://blog.jupyter.org/the-big-split-9d7b88a031a7)
- [Jupyter Ascending blog post](https://blog.jupyter.org/jupyter-ascending-1bf5b362d97e)

## Installation

You can find the installation documentation for the
[Jupyter platform, on ReadTheDocs](https://jupyter.readthedocs.io/en/latest/install.html).
The documentation for advanced usage of Jupyter notebook can be found
[here](https://jupyter-notebook.readthedocs.io/en/latest/).

For a local installation, make sure you have
[pip installed](https://pip.readthedocs.io/en/stable/installing/) and run:

```bash
pip install notebook
```

### Setting up Planckton AI Assistant

To use the Planckton AI Assistant, you'll need to set up an OpenAI API key:

1. **Get an OpenAI API Key**: Sign up at [OpenAI](https://platform.openai.com/) and create an API key
2. **Set Environment Variable**: Set your OpenAI API key as an environment variable:

```bash
export OPENAI_API_KEY="your-openai-api-key-here"
```

3. **Launch Jupyter Notebook**: Start the notebook server:

```bash
jupyter notebook
```

4. **Access Planckton**: Click the Planckton button (🤖) in the notebook toolbar to open the AI assistant

## Usage - Running Jupyter notebook

### Running in a local installation

Launch with:

```bash
jupyter notebook
```

### Running in a remote installation

You need some configuration before starting Jupyter notebook remotely. See [Running a notebook server](https://jupyter-server.readthedocs.io/en/latest/operators/public-server.html).

## Development Installation

See [`CONTRIBUTING.md`](CONTRIBUTING.md) for how to set up a local development installation.

### Building Planckton Extension

To build the Planckton extension from source:

```bash
# Install dependencies
jlpm install

# Build the extension
jlpm build

# Develop mode (with hot reloading)
jlpm develop
```

## Contributing

If you are interested in contributing to the project, see [`CONTRIBUTING.md`](CONTRIBUTING.md).

### Contributing to Planckton

The Planckton AI Assistant is built as a JupyterLab extension. Key files:

- **Frontend**: `packages/notebook-extension/src/planckton.tsx` - React component for the chat interface
- **Backend**: `notebook/app.py` - Python handler for AI API integration
- **Styling**: CSS styles embedded in the built JavaScript files
- **Icon**: `packages/notebook-extension/style/icons/planckton.svg` - Custom Planckton icon

## Community Guidelines and Code of Conduct

This repository is a Jupyter project and follows the Jupyter
[Community Guides and Code of Conduct](https://jupyter.readthedocs.io/en/latest/community/content-community.html).

## Resources

- [Project Jupyter website](https://jupyter.org)
- [Online Demo at jupyter.org/try](https://jupyter.org/try)
- [Documentation for Jupyter notebook](https://jupyter-notebook.readthedocs.io/en/latest/)
- [Korean Version of Installation](https://github.com/ChungJooHo/Jupyter_Kor_doc/)
- [Documentation for Project Jupyter](https://jupyter.readthedocs.io/en/latest/index.html)
- [Issues](https://github.com/jupyter/notebook/issues)
- [Technical support - Jupyter Google Group](https://discourse.jupyter.org/)

## About the Jupyter Development Team

The Jupyter Development Team is the set of all contributors to the Jupyter project.
This includes all of the Jupyter subprojects.

The core team that coordinates development on GitHub can be found here:
https://github.com/jupyter/.

## Our Copyright Policy

Jupyter uses a shared copyright model. Each contributor maintains copyright
over their contributions to Jupyter. But, it is important to note that these
contributions are typically only changes to the repositories. Thus, the Jupyter
source code, in its entirety is not the copyright of any single person or
institution. Instead, it is the collective copyright of the entire Jupyter
Development Team. If individual contributors want to maintain a record of what
changes/contributions they have specific copyright on, they should indicate
their copyright in the commit message of the change, when they commit the
change to one of the Jupyter repositories.

With this in mind, the following banner should be used in any source code file
to indicate the copyright and license terms:

```
# Copyright (c) Jupyter Development Team.
# Distributed under the terms of the Modified BSD License.
```
