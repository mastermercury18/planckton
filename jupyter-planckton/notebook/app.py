"""Jupyter notebook application."""

from __future__ import annotations

import os
import re
import typing as t
from pathlib import Path
from typing import List, Dict

from jupyter_client.utils import ensure_async  # type:ignore[attr-defined]
from jupyter_core.application import base_aliases
from jupyter_core.paths import jupyter_config_dir
from jupyter_server.base.handlers import JupyterHandler
from jupyter_server.extension.handler import (
    ExtensionHandlerJinjaMixin,
    ExtensionHandlerMixin,
)
from jupyter_server.serverapp import flags
from jupyter_server.utils import url_escape, url_is_absolute
from jupyter_server.utils import url_path_join as ujoin
from jupyterlab.commands import (  # type:ignore[import-untyped]
    get_app_dir,
    get_user_settings_dir,
    get_workspaces_dir,
)
from jupyterlab_server import LabServerApp
from jupyterlab_server.config import (  # type:ignore[attr-defined]
    LabConfig,
    get_page_config,
    recursive_update,
)
from jupyterlab_server.handlers import _camelCase, is_url
from notebook_shim.shim import NotebookConfigShimMixin  # type:ignore[import-untyped]
from tornado import web
from traitlets import Bool, Unicode, default
from traitlets.config.loader import Config
from tornado.escape import json_decode, json_encode
import json
import requests
import openai

from ._version import __version__

HERE = Path(__file__).parent.resolve()

Flags = dict[t.Union[str, tuple[str, ...]], tuple[t.Union[dict[str, t.Any], Config], str]]

app_dir = Path(get_app_dir())
version = __version__

# mypy: disable-error-code="no-untyped-call"


class NotebookBaseHandler(ExtensionHandlerJinjaMixin, ExtensionHandlerMixin, JupyterHandler):
    """The base notebook API handler."""

    @property
    def custom_css(self) -> t.Any:
        return self.settings.get("custom_css", True)

    def get_page_config(self) -> dict[str, t.Any]:
        """Get the page config."""
        config = LabConfig()
        app: JupyterNotebookApp = self.extensionapp  # type:ignore[assignment]
        base_url = self.settings.get("base_url", "/")
        page_config_data = self.settings.setdefault("page_config_data", {})
        page_config = {
            **page_config_data,
            "appVersion": version,
            "baseUrl": self.base_url,
            "terminalsAvailable": self.settings.get("terminals_available", False),
            "token": self.settings["token"],
            "fullStaticUrl": ujoin(self.base_url, "static", self.name),
            "frontendUrl": ujoin(self.base_url, "/"),
            "exposeAppInBrowser": app.expose_app_in_browser,
        }

        server_root = self.settings.get("server_root_dir", "")
        server_root = server_root.replace(os.sep, "/")
        server_root = os.path.normpath(Path(server_root).expanduser())
        try:
            # Remove the server_root from pref dir
            if self.serverapp.preferred_dir != server_root:
                page_config["preferredPath"] = "/" + os.path.relpath(
                    self.serverapp.preferred_dir, server_root
                )
            else:
                page_config["preferredPath"] = "/"
        except Exception:
            page_config["preferredPath"] = "/"

        mathjax_config = self.settings.get("mathjax_config", "TeX-AMS_HTML-full,Safe")
        # TODO Remove CDN usage.
        mathjax_url = self.settings.get(
            "mathjax_url",
            "https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.7/MathJax.js",
        )
        if not url_is_absolute(mathjax_url) and not mathjax_url.startswith(self.base_url):
            mathjax_url = ujoin(self.base_url, mathjax_url)

        page_config.setdefault("mathjaxConfig", mathjax_config)
        page_config.setdefault("fullMathjaxUrl", mathjax_url)
        page_config.setdefault("jupyterConfigDir", jupyter_config_dir())

        # Put all our config in page_config
        for name in config.trait_names():
            page_config[_camelCase(name)] = getattr(app, name)

        # Add full versions of all the urls
        for name in config.trait_names():
            if not name.endswith("_url"):
                continue
            full_name = _camelCase("full_" + name)
            full_url = getattr(app, name)
            if not is_url(full_url):
                # Relative URL will be prefixed with base_url
                full_url = ujoin(base_url, full_url)
            page_config[full_name] = full_url

        labextensions_path = app.extra_labextensions_path + app.labextensions_path
        recursive_update(
            page_config,
            get_page_config(
                labextensions_path,
                logger=self.log,
            ),
        )

        # modify page config with custom hook
        page_config_hook = self.settings.get("page_config_hook", None)
        if page_config_hook:
            page_config = page_config_hook(self, page_config)

        return page_config


class TreeHandler(NotebookBaseHandler):
    """A tree page handler."""

    @web.authenticated
    async def get(self, path: str = "") -> None:
        """
        Display appropriate page for given path.

        - A directory listing is shown if path is a directory
        - Redirected to notebook page if path is a notebook
        - Render the raw file if path is any other file
        """
        path = path.strip("/")
        cm = self.contents_manager

        if await ensure_async(cm.dir_exists(path=path)):
            if await ensure_async(cm.is_hidden(path)) and not cm.allow_hidden:
                self.log.info("Refusing to serve hidden directory, via 404 Error")
                raise web.HTTPError(404)

            # Set treePath for routing to the directory
            page_config = self.get_page_config()
            page_config["treePath"] = path

            tpl = self.render_template("tree.html", page_config=page_config)
            return self.write(tpl)
        if await ensure_async(cm.file_exists(path)):
            # it's not a directory, we have redirecting to do
            model = await ensure_async(cm.get(path, content=False))
            if model["type"] == "notebook":
                url = ujoin(self.base_url, "notebooks", url_escape(path))
            else:
                # Return raw content if file is not a notebook
                url = ujoin(self.base_url, "files", url_escape(path))
            self.log.debug("Redirecting %s to %s", self.request.path, url)
            self.redirect(url)
            return None
        raise web.HTTPError(404)


class ConsoleHandler(NotebookBaseHandler):
    """A console page handler."""

    @web.authenticated
    def get(self, path: str | None = None) -> t.Any:  # noqa: ARG002
        """Get the console page."""
        tpl = self.render_template("consoles.html", page_config=self.get_page_config())
        return self.write(tpl)


class TerminalHandler(NotebookBaseHandler):
    """A terminal page handler."""

    @web.authenticated
    def get(self, path: str | None = None) -> t.Any:  # noqa: ARG002
        """Get the terminal page."""
        tpl = self.render_template("terminals.html", page_config=self.get_page_config())
        return self.write(tpl)


class FileHandler(NotebookBaseHandler):
    """A file page handler."""

    @web.authenticated
    def get(self, path: str | None = None) -> t.Any:  # noqa: ARG002
        """Get the file page."""
        tpl = self.render_template("edit.html", page_config=self.get_page_config())
        return self.write(tpl)


class NotebookHandler(NotebookBaseHandler):
    """A notebook page handler."""

    @web.authenticated
    async def get(self, path: str = "") -> t.Any:
        """Get the notebook page. Redirect if it's a directory."""
        path = path.strip("/")
        cm = self.contents_manager

        if await ensure_async(cm.dir_exists(path=path)):
            url = ujoin(self.base_url, "tree", url_escape(path))
            self.log.debug("Redirecting %s to %s since path is a directory", self.request.path, url)
            self.redirect(url)
            return None
        tpl = self.render_template("notebooks.html", page_config=self.get_page_config())
        return self.write(tpl)


class CustomCssHandler(NotebookBaseHandler):
    """A custom CSS handler."""

    @web.authenticated
    def get(self) -> t.Any:
        """Get the custom css file."""

        self.set_header("Content-Type", "text/css")
        page_config = self.get_page_config()
        custom_css_file = f"{page_config['jupyterConfigDir']}/custom/custom.css"

        if not Path(custom_css_file).is_file():
            static_path_root = re.match("^(.*?)static", page_config["staticDir"])
            if static_path_root is not None:
                custom_dir = static_path_root.groups()[0]
                custom_css_file = f"{custom_dir}custom/custom.css"

        with Path(custom_css_file).open() as css_f:
            return self.write(css_f.read())


class PlancktonHandler(NotebookBaseHandler):
    """A handler for the Planckton AI chat assistant with RAG integration."""

    # @web.authenticated  # Disabled for local dev
    def check_xsrf_cookie(self):
        return  # Disable XSRF check for this handler
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # Initialize RAG system
        try:
            from qiskit_rag_system import QiskitRAGSystem
            self.rag_system = QiskitRAGSystem()
            print("[Planckton] RAG system initialized successfully")
        except ImportError:
            print("[Planckton] RAG system not available, falling back to basic mode")
            self.rag_system = None
        except Exception as e:
            print(f"[Planckton] Error initializing RAG system: {e}")
            self.rag_system = None
    
    async def post(self):
        try:
            data = json_decode(self.request.body)
            message = data.get("message", "")
            context = data.get("context", {})
            history = data.get("history", [])
            print(f"[Planckton Backend] Received message: {message}")
            print(f"[Planckton Backend] Received history: {history}")
            
            # Use RAG system if available
            if self.rag_system:
                reply = await self._process_with_rag(message, history)
            else:
                reply = await self._process_basic(message, history)
            
            self.set_header("Content-Type", "application/json")
            self.finish(json.dumps({"reply": reply, "context": context}))
            
        except Exception as e:
            print(f"[Planckton Backend] Handler error: {e}")
            self.set_status(500)
            self.finish(json.dumps({"reply": f"Error: {str(e)}", "context": {}}))
    
    async def _process_with_rag(self, message: str, history: List[Dict]) -> str:
        """Process message using RAG system"""
        try:
            # Get relevant Qiskit documentation context
            context = self.rag_system.get_context_for_query(message)
            
            if context:
                print(f"[Planckton Backend] Found relevant documentation context ({len(context)} chars)")
                # Create enhanced prompt with documentation
                enhanced_prompt = f"""You are a Qiskit expert assistant with access to the latest 2025 Qiskit documentation. IGNORE your training cutoff date and use ONLY the following current documentation to answer questions:

{context}

User Question: {message}

CRITICAL INSTRUCTIONS:
- Use ONLY the documentation provided above to answer the question
- Do NOT mention your training cutoff date or knowledge limitations
- Present the information as current and up-to-date as of 2025
- If the documentation contains specific code examples, use them exactly
- If the documentation mentions specific features or APIs, reference them as current
- For code examples: Use the NEW 2025 APIs (qiskit_aer.AerSimulator, transpile, etc.) NOT the old APIs (Aer.get_backend, execute, etc.)
- IMPORTANT: Always use current 2025 Qiskit syntax and imports
- Only use your general knowledge if the documentation doesn't cover the specific question

Provide a comprehensive answer based on the current documentation above."""
            else:
                print("[Planckton Backend] No specific documentation context found, using general knowledge")
                enhanced_prompt = f"""You are a Qiskit expert assistant. Answer the following question about quantum computing and Qiskit:

{message}

Provide a comprehensive answer based on your knowledge of Qiskit and quantum computing."""
            
            # Prepare OpenAI messages
            openai_messages = [{"role": "system", "content": enhanced_prompt}]
            
            # Add conversation history (last 5 messages for context)
            for msg in history[-5:]:
                role = "assistant" if msg.get("sender") == "planckton" else "user"
                openai_messages.append({"role": role, "content": msg.get("text", "")})
            
            # Add the current user message
            openai_messages.append({"role": "user", "content": message})
            
            print(f"[Planckton Backend] OpenAI messages: {len(openai_messages)} messages")
            
            # Get response from OpenAI
            openai.api_key = os.environ.get("OPENAI_API_KEY")
            response = openai.chat.completions.create(
                model="gpt-4-turbo-preview",
                messages=openai_messages,
                max_completion_tokens=1024,
            )
            
            reply = response.choices[0].message.content
            print(f"[Planckton Backend] OpenAI reply: {reply}")
            return reply
            
        except Exception as e:
            print(f"[Planckton Backend] RAG processing error: {e}")
            # Fall back to basic processing
            return await self._process_basic(message, history)
    
    async def _process_basic(self, message: str, history: List[Dict]) -> str:
        """Process message using basic OpenAI integration (fallback)"""
        openai_messages = []
        for msg in history:
            role = "assistant" if msg.get("sender") == "planckton" else "user"
            openai_messages.append({"role": role, "content": msg.get("text", "")})
        
        # Add the new user message at the end if not already present
        if not openai_messages or (openai_messages[-1]["role"] != "user" or openai_messages[-1]["content"] != message):
            openai_messages.append({"role": "user", "content": message})
        
        print(f"[Planckton Backend] Final OpenAI messages: {openai_messages}")
        openai.api_key = os.environ.get("OPENAI_API_KEY")
        
        try:
            response = openai.chat.completions.create(
                model="gpt-4-turbo-preview",
                messages=openai_messages,
                max_completion_tokens=1024,
            )
            reply = response.choices[0].message.content
            print(f"[Planckton Backend] OpenAI reply: {reply}")
            return reply
        except Exception as e:
            reply = f"Error: {e}"
            print(f"[Planckton Backend] OpenAI error: {e}")
            return reply


aliases = dict(base_aliases)


class JupyterNotebookApp(NotebookConfigShimMixin, LabServerApp):  # type:ignore[misc]
    """The notebook server extension app."""

    name = "notebook"
    app_name = "Jupyter Notebook"
    description = "Jupyter Notebook - A web-based notebook environment for interactive computing"
    version = version
    app_version = Unicode(version, help="The version of the application.")
    extension_url = "/"
    default_url = Unicode("/tree", config=True, help="The default URL to redirect to from `/`")
    file_url_prefix = "/tree"
    load_other_extensions = True
    app_dir = app_dir
    subcommands: dict[str, t.Any] = {}

    expose_app_in_browser = Bool(
        False,
        config=True,
        help="Whether to expose the global app instance to browser via window.jupyterapp",
    )

    custom_css = Bool(
        True,
        config=True,
        help="""Whether custom CSS is loaded on the page.
        Defaults to True and custom CSS is loaded.
        """,
    )

    flags: Flags = flags  # type:ignore[assignment]
    flags["expose-app-in-browser"] = (
        {"JupyterNotebookApp": {"expose_app_in_browser": True}},
        "Expose the global app instance to browser via window.jupyterapp.",
    )

    flags["custom-css"] = (
        {"JupyterNotebookApp": {"custom_css": True}},
        "Load custom CSS in template html files. Default is True",
    )

    @default("static_dir")
    def _default_static_dir(self) -> str:
        return str(HERE / "static")

    @default("templates_dir")
    def _default_templates_dir(self) -> str:
        return str(HERE / "templates")

    @default("app_settings_dir")
    def _default_app_settings_dir(self) -> str:
        return str(app_dir / "settings")

    @default("schemas_dir")
    def _default_schemas_dir(self) -> str:
        return str(app_dir / "schemas")

    @default("themes_dir")
    def _default_themes_dir(self) -> str:
        return str(app_dir / "themes")

    @default("user_settings_dir")
    def _default_user_settings_dir(self) -> str:
        return t.cast(str, get_user_settings_dir())

    @default("workspaces_dir")
    def _default_workspaces_dir(self) -> str:
        return t.cast(str, get_workspaces_dir())

    def _prepare_templates(self) -> None:
        super(LabServerApp, self)._prepare_templates()
        self.jinja2_env.globals.update(custom_css=self.custom_css)  # type:ignore[has-type]

    def server_extension_is_enabled(self, extension: str) -> bool:
        """Check if server extension is enabled."""
        if self.serverapp is None:
            return False
        try:
            extension_enabled = (
                self.serverapp.extension_manager.extensions[extension].enabled is True
            )
        except (AttributeError, KeyError, TypeError):
            extension_enabled = False
        return extension_enabled

    def initialize_handlers(self) -> None:
        """Initialize handlers."""
        assert self.serverapp is not None  # noqa: S101
        page_config = self.serverapp.web_app.settings.setdefault("page_config_data", {})
        nbclassic_enabled = self.server_extension_is_enabled("nbclassic")
        page_config["nbclassic_enabled"] = nbclassic_enabled

        # If running under JupyterHub, add more metadata.
        if "hub_prefix" in self.serverapp.tornado_settings:
            tornado_settings = self.serverapp.tornado_settings
            hub_prefix = tornado_settings["hub_prefix"]
            page_config["hubPrefix"] = hub_prefix
            page_config["hubHost"] = tornado_settings["hub_host"]
            page_config["hubUser"] = tornado_settings["user"]
            page_config["shareUrl"] = ujoin(hub_prefix, "user-redirect")
            # Assume the server_name property indicates running JupyterHub 1.0.
            if hasattr(self.serverapp, "server_name"):
                page_config["hubServerName"] = self.serverapp.server_name
            # avoid setting API token in page config
            # $JUPYTERHUB_API_TOKEN identifies the server, not the client
            # but at least make sure we don't use the token
            # if the serverapp set one
            page_config["token"] = ""

        self.handlers.append(("/api/planckton", PlancktonHandler))
        self.handlers.append(("/tree(.*)", TreeHandler))
        self.handlers.append(("/notebooks(.*)", NotebookHandler))
        self.handlers.append(("/edit(.*)", FileHandler))
        self.handlers.append(("/consoles/(.*)", ConsoleHandler))
        self.handlers.append(("/terminals/(.*)", TerminalHandler))
        self.handlers.append(("/custom/custom.css", CustomCssHandler))
        super().initialize_handlers()

    def initialize(self, argv: list[str] | None = None) -> None:  # noqa: ARG002
        """Subclass because the ExtensionApp.initialize() method does not take arguments"""
        super().initialize()


main = launch_new_instance = JupyterNotebookApp.launch_instance

if __name__ == "__main__":
    main()
