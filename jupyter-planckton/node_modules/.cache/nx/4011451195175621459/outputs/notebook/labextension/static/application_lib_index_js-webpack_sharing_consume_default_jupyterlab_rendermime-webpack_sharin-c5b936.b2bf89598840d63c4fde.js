"use strict";
(self["webpackChunk_jupyter_notebook_lab_extension"] = self["webpackChunk_jupyter_notebook_lab_extension"] || []).push([["application_lib_index_js-webpack_sharing_consume_default_jupyterlab_rendermime-webpack_sharin-c5b936"],{

/***/ "../application/lib/app.js":
/*!*********************************!*\
  !*** ../application/lib/app.js ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   NotebookApp: () => (/* binding */ NotebookApp)
/* harmony export */ });
/* harmony import */ var _jupyterlab_application__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @jupyterlab/application */ "webpack/sharing/consume/default/@jupyterlab/application");
/* harmony import */ var _jupyterlab_application__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_jupyterlab_application__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _jupyterlab_docregistry__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @jupyterlab/docregistry */ "webpack/sharing/consume/default/@jupyterlab/docregistry");
/* harmony import */ var _jupyterlab_docregistry__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_jupyterlab_docregistry__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _jupyterlab_application_lib_mimerenderers__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @jupyterlab/application/lib/mimerenderers */ "../../node_modules/@jupyterlab/application/lib/mimerenderers.js");
/* harmony import */ var _jupyterlab_application_lib_status__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @jupyterlab/application/lib/status */ "../../node_modules/@jupyterlab/application/lib/status.js");
/* harmony import */ var _jupyterlab_coreutils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @jupyterlab/coreutils */ "webpack/sharing/consume/default/@jupyterlab/coreutils");
/* harmony import */ var _jupyterlab_coreutils__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_jupyterlab_coreutils__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _lumino_polling__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @lumino/polling */ "webpack/sharing/consume/default/@lumino/polling");
/* harmony import */ var _lumino_polling__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_lumino_polling__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _shell__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./shell */ "../application/lib/shell.js");
// Copyright (c) Jupyter Development Team.
// Distributed under the terms of the Modified BSD License.







/**
 * App is the main application class. It is instantiated once and shared.
 */
class NotebookApp extends _jupyterlab_application__WEBPACK_IMPORTED_MODULE_0__.JupyterFrontEnd {
    /**
     * Construct a new NotebookApp object.
     *
     * @param options The instantiation options for an application.
     */
    constructor(options = { shell: new _shell__WEBPACK_IMPORTED_MODULE_4__.NotebookShell() }) {
        var _a, _b;
        super({ ...options, shell: (_a = options.shell) !== null && _a !== void 0 ? _a : new _shell__WEBPACK_IMPORTED_MODULE_4__.NotebookShell() });
        /**
         * The name of the application.
         */
        this.name = 'Jupyter Notebook';
        /**
         * A namespace/prefix plugins may use to denote their provenance.
         */
        this.namespace = this.name;
        /**
         * The application busy and dirty status signals and flags.
         */
        this.status = new _jupyterlab_application_lib_status__WEBPACK_IMPORTED_MODULE_5__.LabStatus(this);
        /**
         * The version of the application.
         */
        this.version = (_b = _jupyterlab_coreutils__WEBPACK_IMPORTED_MODULE_2__.PageConfig.getOption('appVersion')) !== null && _b !== void 0 ? _b : 'unknown';
        this._info = _jupyterlab_application__WEBPACK_IMPORTED_MODULE_0__.JupyterLab.defaultInfo;
        this._formatter = new _lumino_polling__WEBPACK_IMPORTED_MODULE_3__.Throttler(() => {
            Private.setFormat(this);
        }, 250);
        // Add initial model factory.
        this.docRegistry.addModelFactory(new _jupyterlab_docregistry__WEBPACK_IMPORTED_MODULE_1__.Base64ModelFactory());
        if (options.mimeExtensions) {
            for (const plugin of (0,_jupyterlab_application_lib_mimerenderers__WEBPACK_IMPORTED_MODULE_6__.createRendermimePlugins)(options.mimeExtensions)) {
                this.registerPlugin(plugin);
            }
        }
        // Create an IInfo dictionary from the options to override the defaults.
        const info = Object.keys(_jupyterlab_application__WEBPACK_IMPORTED_MODULE_0__.JupyterLab.defaultInfo).reduce((acc, val) => {
            if (val in options) {
                acc[val] = JSON.parse(JSON.stringify(options[val]));
            }
            return acc;
        }, {});
        // Populate application info.
        this._info = { ..._jupyterlab_application__WEBPACK_IMPORTED_MODULE_0__.JupyterLab.defaultInfo, ...info };
        this.restored = this.shell.restored;
        this.restored.then(() => this._formatter.invoke());
    }
    /**
     * The NotebookApp application information dictionary.
     */
    get info() {
        return this._info;
    }
    /**
     * The JupyterLab application paths dictionary.
     */
    get paths() {
        return {
            urls: {
                base: _jupyterlab_coreutils__WEBPACK_IMPORTED_MODULE_2__.PageConfig.getOption('baseUrl'),
                notFound: _jupyterlab_coreutils__WEBPACK_IMPORTED_MODULE_2__.PageConfig.getOption('notFoundUrl'),
                app: _jupyterlab_coreutils__WEBPACK_IMPORTED_MODULE_2__.PageConfig.getOption('appUrl'),
                static: _jupyterlab_coreutils__WEBPACK_IMPORTED_MODULE_2__.PageConfig.getOption('staticUrl'),
                settings: _jupyterlab_coreutils__WEBPACK_IMPORTED_MODULE_2__.PageConfig.getOption('settingsUrl'),
                themes: _jupyterlab_coreutils__WEBPACK_IMPORTED_MODULE_2__.PageConfig.getOption('themesUrl'),
                doc: _jupyterlab_coreutils__WEBPACK_IMPORTED_MODULE_2__.PageConfig.getOption('docUrl'),
                translations: _jupyterlab_coreutils__WEBPACK_IMPORTED_MODULE_2__.PageConfig.getOption('translationsApiUrl'),
                hubHost: _jupyterlab_coreutils__WEBPACK_IMPORTED_MODULE_2__.PageConfig.getOption('hubHost') || undefined,
                hubPrefix: _jupyterlab_coreutils__WEBPACK_IMPORTED_MODULE_2__.PageConfig.getOption('hubPrefix') || undefined,
                hubUser: _jupyterlab_coreutils__WEBPACK_IMPORTED_MODULE_2__.PageConfig.getOption('hubUser') || undefined,
                hubServerName: _jupyterlab_coreutils__WEBPACK_IMPORTED_MODULE_2__.PageConfig.getOption('hubServerName') || undefined,
            },
            directories: {
                appSettings: _jupyterlab_coreutils__WEBPACK_IMPORTED_MODULE_2__.PageConfig.getOption('appSettingsDir'),
                schemas: _jupyterlab_coreutils__WEBPACK_IMPORTED_MODULE_2__.PageConfig.getOption('schemasDir'),
                static: _jupyterlab_coreutils__WEBPACK_IMPORTED_MODULE_2__.PageConfig.getOption('staticDir'),
                templates: _jupyterlab_coreutils__WEBPACK_IMPORTED_MODULE_2__.PageConfig.getOption('templatesDir'),
                themes: _jupyterlab_coreutils__WEBPACK_IMPORTED_MODULE_2__.PageConfig.getOption('themesDir'),
                userSettings: _jupyterlab_coreutils__WEBPACK_IMPORTED_MODULE_2__.PageConfig.getOption('userSettingsDir'),
                serverRoot: _jupyterlab_coreutils__WEBPACK_IMPORTED_MODULE_2__.PageConfig.getOption('serverRoot'),
                workspaces: _jupyterlab_coreutils__WEBPACK_IMPORTED_MODULE_2__.PageConfig.getOption('workspacesDir'),
            },
        };
    }
    /**
     * Handle the DOM events for the application.
     *
     * @param event - The DOM event sent to the application.
     */
    handleEvent(event) {
        super.handleEvent(event);
        if (event.type === 'resize') {
            void this._formatter.invoke();
        }
    }
    /**
     * Register plugins from a plugin module.
     *
     * @param mod - The plugin module to register.
     */
    registerPluginModule(mod) {
        let data = mod.default;
        // Handle commonjs exports.
        if (!Object.prototype.hasOwnProperty.call(mod, '__esModule')) {
            data = mod;
        }
        if (!Array.isArray(data)) {
            data = [data];
        }
        data.forEach((item) => {
            try {
                this.registerPlugin(item);
            }
            catch (error) {
                console.error(error);
            }
        });
    }
    /**
     * Register the plugins from multiple plugin modules.
     *
     * @param mods - The plugin modules to register.
     */
    registerPluginModules(mods) {
        mods.forEach((mod) => {
            this.registerPluginModule(mod);
        });
    }
}
/**
 * A namespace for module-private functionality.
 */
var Private;
(function (Private) {
    /**
     * Media query for mobile devices.
     */
    const MOBILE_QUERY = 'only screen and (max-width: 760px)';
    /**
     * Sets the `format` of a Jupyter front-end application.
     *
     * @param app The front-end application whose format is set.
     */
    function setFormat(app) {
        app.format = window.matchMedia(MOBILE_QUERY).matches ? 'mobile' : 'desktop';
    }
    Private.setFormat = setFormat;
})(Private || (Private = {}));


/***/ }),

/***/ "../application/lib/index.js":
/*!***********************************!*\
  !*** ../application/lib/index.js ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   INotebookPathOpener: () => (/* reexport safe */ _tokens__WEBPACK_IMPORTED_MODULE_4__.INotebookPathOpener),
/* harmony export */   INotebookShell: () => (/* reexport safe */ _shell__WEBPACK_IMPORTED_MODULE_1__.INotebookShell),
/* harmony export */   NotebookApp: () => (/* reexport safe */ _app__WEBPACK_IMPORTED_MODULE_0__.NotebookApp),
/* harmony export */   NotebookShell: () => (/* reexport safe */ _shell__WEBPACK_IMPORTED_MODULE_1__.NotebookShell),
/* harmony export */   PanelHandler: () => (/* reexport safe */ _panelhandler__WEBPACK_IMPORTED_MODULE_2__.PanelHandler),
/* harmony export */   Private: () => (/* reexport safe */ _shell__WEBPACK_IMPORTED_MODULE_1__.Private),
/* harmony export */   SidePanelHandler: () => (/* reexport safe */ _panelhandler__WEBPACK_IMPORTED_MODULE_2__.SidePanelHandler),
/* harmony export */   SidePanelPalette: () => (/* reexport safe */ _panelhandler__WEBPACK_IMPORTED_MODULE_2__.SidePanelPalette),
/* harmony export */   defaultNotebookPathOpener: () => (/* reexport safe */ _pathopener__WEBPACK_IMPORTED_MODULE_3__.defaultNotebookPathOpener)
/* harmony export */ });
/* harmony import */ var _app__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./app */ "../application/lib/app.js");
/* harmony import */ var _shell__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./shell */ "../application/lib/shell.js");
/* harmony import */ var _panelhandler__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./panelhandler */ "../application/lib/panelhandler.js");
/* harmony import */ var _pathopener__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./pathopener */ "../application/lib/pathopener.js");
/* harmony import */ var _tokens__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./tokens */ "../application/lib/tokens.js");
// Copyright (c) Jupyter Development Team.
// Distributed under the terms of the Modified BSD License.







/***/ }),

/***/ "../application/lib/panelhandler.js":
/*!******************************************!*\
  !*** ../application/lib/panelhandler.js ***!
  \******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   PanelHandler: () => (/* binding */ PanelHandler),
/* harmony export */   SidePanelHandler: () => (/* binding */ SidePanelHandler),
/* harmony export */   SidePanelPalette: () => (/* binding */ SidePanelPalette)
/* harmony export */ });
/* harmony import */ var _jupyterlab_ui_components__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @jupyterlab/ui-components */ "webpack/sharing/consume/default/@jupyterlab/ui-components");
/* harmony import */ var _jupyterlab_ui_components__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_jupyterlab_ui_components__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _lumino_algorithm__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @lumino/algorithm */ "webpack/sharing/consume/default/@lumino/algorithm");
/* harmony import */ var _lumino_algorithm__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_lumino_algorithm__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _lumino_messaging__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @lumino/messaging */ "webpack/sharing/consume/default/@lumino/messaging");
/* harmony import */ var _lumino_messaging__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_lumino_messaging__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _lumino_signaling__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @lumino/signaling */ "webpack/sharing/consume/default/@lumino/signaling");
/* harmony import */ var _lumino_signaling__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_lumino_signaling__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _lumino_widgets__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @lumino/widgets */ "webpack/sharing/consume/default/@lumino/widgets");
/* harmony import */ var _lumino_widgets__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_lumino_widgets__WEBPACK_IMPORTED_MODULE_4__);
// Copyright (c) Jupyter Development Team.
// Distributed under the terms of the Modified BSD License.





/**
 * A class which manages a panel and sorts its widgets by rank.
 */
class PanelHandler {
    constructor() {
        /**
         * A message hook for child remove messages on the panel handler.
         */
        this._panelChildHook = (handler, msg) => {
            switch (msg.type) {
                case 'child-removed':
                    {
                        const widget = msg.child;
                        _lumino_algorithm__WEBPACK_IMPORTED_MODULE_1__.ArrayExt.removeFirstWhere(this._items, (v) => v.widget === widget);
                    }
                    break;
                default:
                    break;
            }
            return true;
        };
        this._items = new Array();
        this._panel = new _lumino_widgets__WEBPACK_IMPORTED_MODULE_4__.Panel();
        _lumino_messaging__WEBPACK_IMPORTED_MODULE_2__.MessageLoop.installMessageHook(this._panel, this._panelChildHook);
    }
    /**
     * Get the panel managed by the handler.
     */
    get panel() {
        return this._panel;
    }
    /**
     * Add a widget to the panel.
     *
     * If the widget is already added, it will be moved.
     */
    addWidget(widget, rank) {
        widget.parent = null;
        const item = { widget, rank };
        const index = _lumino_algorithm__WEBPACK_IMPORTED_MODULE_1__.ArrayExt.upperBound(this._items, item, Private.itemCmp);
        _lumino_algorithm__WEBPACK_IMPORTED_MODULE_1__.ArrayExt.insert(this._items, index, item);
        this._panel.insertWidget(index, widget);
    }
}
/**
 * A class which manages a side panel that can show at most one widget at a time.
 */
class SidePanelHandler extends PanelHandler {
    /**
     * Construct a new side panel handler.
     */
    constructor(area) {
        super();
        this._isHiddenByUser = false;
        this._widgetAdded = new _lumino_signaling__WEBPACK_IMPORTED_MODULE_3__.Signal(this);
        this._widgetRemoved = new _lumino_signaling__WEBPACK_IMPORTED_MODULE_3__.Signal(this);
        this._area = area;
        this._panel.hide();
        this._currentWidget = null;
        this._lastCurrentWidget = null;
        this._widgetPanel = new _lumino_widgets__WEBPACK_IMPORTED_MODULE_4__.StackedPanel();
        this._widgetPanel.widgetRemoved.connect(this._onWidgetRemoved, this);
        this._closeButton = document.createElement('button');
        _jupyterlab_ui_components__WEBPACK_IMPORTED_MODULE_0__.closeIcon.element({
            container: this._closeButton,
            height: '16px',
            width: 'auto',
        });
        this._closeButton.onclick = () => {
            this.collapse();
            this.hide();
        };
        this._closeButton.className = 'jp-Button jp-SidePanel-collapse';
        this._closeButton.title = 'Collapse side panel';
        const icon = new _lumino_widgets__WEBPACK_IMPORTED_MODULE_4__.Widget({ node: this._closeButton });
        this._panel.addWidget(icon);
        this._panel.addWidget(this._widgetPanel);
    }
    /**
     * Get the current widget in the sidebar panel.
     */
    get currentWidget() {
        return (this._currentWidget ||
            this._lastCurrentWidget ||
            (this._items.length > 0 ? this._items[0].widget : null));
    }
    /**
     * Get the area of the side panel
     */
    get area() {
        return this._area;
    }
    /**
     * Whether the panel is visible
     */
    get isVisible() {
        return this._panel.isVisible;
    }
    /**
     * Get the stacked panel managed by the handler
     */
    get panel() {
        return this._panel;
    }
    /**
     * Get the widgets list.
     */
    get widgets() {
        return this._items.map((obj) => obj.widget);
    }
    /**
     * Signal fired when a widget is added to the panel
     */
    get widgetAdded() {
        return this._widgetAdded;
    }
    /**
     * Signal fired when a widget is removed from the panel
     */
    get widgetRemoved() {
        return this._widgetRemoved;
    }
    /**
     * Get the close button element.
     */
    get closeButton() {
        return this._closeButton;
    }
    /**
     * Expand the sidebar.
     *
     * #### Notes
     * This will open the most recently used widget, or the first widget
     * if there is no most recently used.
     */
    expand(id) {
        if (id) {
            if (this._currentWidget && this._currentWidget.id === id) {
                this.collapse();
                this.hide();
            }
            else {
                this.collapse();
                this.hide();
                this.activate(id);
                this.show();
            }
        }
        else if (this.currentWidget) {
            this._currentWidget = this.currentWidget;
            this.activate(this._currentWidget.id);
            this.show();
        }
    }
    /**
     * Activate a widget residing in the stacked panel by ID.
     *
     * @param id - The widget's unique ID.
     */
    activate(id) {
        const widget = this._findWidgetByID(id);
        if (widget) {
            this._currentWidget = widget;
            widget.show();
            widget.activate();
        }
    }
    /**
     * Test whether the sidebar has the given widget by id.
     */
    has(id) {
        return this._findWidgetByID(id) !== null;
    }
    /**
     * Collapse the sidebar so no items are expanded.
     */
    collapse() {
        var _a;
        (_a = this._currentWidget) === null || _a === void 0 ? void 0 : _a.hide();
        this._currentWidget = null;
    }
    /**
     * Add a widget and its title to the stacked panel.
     *
     * If the widget is already added, it will be moved.
     */
    addWidget(widget, rank) {
        widget.parent = null;
        widget.hide();
        const item = { widget, rank };
        const index = this._findInsertIndex(item);
        _lumino_algorithm__WEBPACK_IMPORTED_MODULE_1__.ArrayExt.insert(this._items, index, item);
        this._widgetPanel.insertWidget(index, widget);
        this._refreshVisibility();
        this._widgetAdded.emit(widget);
    }
    /**
     * Hide the side panel
     */
    hide() {
        this._isHiddenByUser = true;
        this._refreshVisibility();
    }
    /**
     * Show the side panel
     */
    show() {
        this._isHiddenByUser = false;
        this._refreshVisibility();
    }
    /**
     * Find the insertion index for a rank item.
     */
    _findInsertIndex(item) {
        return _lumino_algorithm__WEBPACK_IMPORTED_MODULE_1__.ArrayExt.upperBound(this._items, item, Private.itemCmp);
    }
    /**
     * Find the index of the item with the given widget, or `-1`.
     */
    _findWidgetIndex(widget) {
        return _lumino_algorithm__WEBPACK_IMPORTED_MODULE_1__.ArrayExt.findFirstIndex(this._items, (i) => i.widget === widget);
    }
    /**
     * Find the widget with the given id, or `null`.
     */
    _findWidgetByID(id) {
        const item = (0,_lumino_algorithm__WEBPACK_IMPORTED_MODULE_1__.find)(this._items, (value) => value.widget.id === id);
        return item ? item.widget : null;
    }
    /**
     * Refresh the visibility of the stacked panel.
     */
    _refreshVisibility() {
        this._panel.setHidden(this._isHiddenByUser);
    }
    /*
     * Handle the `widgetRemoved` signal from the panel.
     */
    _onWidgetRemoved(sender, widget) {
        if (widget === this._lastCurrentWidget) {
            this._lastCurrentWidget = null;
        }
        _lumino_algorithm__WEBPACK_IMPORTED_MODULE_1__.ArrayExt.removeAt(this._items, this._findWidgetIndex(widget));
        this._refreshVisibility();
        this._widgetRemoved.emit(widget);
    }
}
/**
 * A class to manages the palette entries associated to the side panels.
 */
class SidePanelPalette {
    /**
     * Construct a new side panel palette.
     */
    constructor(options) {
        this._items = [];
        this._commandPalette = options.commandPalette;
        this._command = options.command;
    }
    /**
     * Get a command palette item from the widget id and the area.
     */
    getItem(widget, area) {
        const itemList = this._items;
        for (let i = 0; i < itemList.length; i++) {
            const item = itemList[i];
            if (item.widgetId === widget.id && item.area === area) {
                return item;
            }
        }
        return null;
    }
    /**
     * Add an item to the command palette.
     */
    addItem(widget, area) {
        // Check if the item does not already exist.
        if (this.getItem(widget, area)) {
            return;
        }
        // Add a new item in command palette.
        const disposableDelegate = this._commandPalette.addItem({
            command: this._command,
            category: 'View',
            args: {
                side: area,
                title: `Show ${widget.title.caption}`,
                id: widget.id,
            },
        });
        // Keep the disposableDelegate object to be able to dispose of the item if the widget
        // is remove from the side panel.
        this._items.push({
            widgetId: widget.id,
            area: area,
            disposable: disposableDelegate,
        });
    }
    /**
     * Remove an item from the command palette.
     */
    removeItem(widget, area) {
        const item = this.getItem(widget, area);
        if (item) {
            item.disposable.dispose();
        }
    }
}
/**
 * A namespace for private module data.
 */
var Private;
(function (Private) {
    /**
     * A less-than comparison function for side bar rank items.
     */
    function itemCmp(first, second) {
        return first.rank - second.rank;
    }
    Private.itemCmp = itemCmp;
})(Private || (Private = {}));


/***/ }),

/***/ "../application/lib/pathopener.js":
/*!****************************************!*\
  !*** ../application/lib/pathopener.js ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   defaultNotebookPathOpener: () => (/* binding */ defaultNotebookPathOpener)
/* harmony export */ });
/* harmony import */ var _jupyterlab_coreutils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @jupyterlab/coreutils */ "webpack/sharing/consume/default/@jupyterlab/coreutils");
/* harmony import */ var _jupyterlab_coreutils__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_jupyterlab_coreutils__WEBPACK_IMPORTED_MODULE_0__);
// Copyright (c) Jupyter Development Team.
// Distributed under the terms of the Modified BSD License.

/**
 * A class to open paths in new browser tabs in the Notebook application.
 */
class DefaultNotebookPathOpener {
    /**
     * Open a path in a new browser tab.
     */
    open(options) {
        const { prefix, path, searchParams, target, features } = options;
        const url = new URL(_jupyterlab_coreutils__WEBPACK_IMPORTED_MODULE_0__.URLExt.join(prefix, path !== null && path !== void 0 ? path : ''), window.location.origin);
        if (searchParams) {
            url.search = searchParams.toString();
        }
        return window.open(url, target, features);
    }
}
const defaultNotebookPathOpener = new DefaultNotebookPathOpener();


/***/ }),

/***/ "../application/lib/shell.js":
/*!***********************************!*\
  !*** ../application/lib/shell.js ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   INotebookShell: () => (/* binding */ INotebookShell),
/* harmony export */   NotebookShell: () => (/* binding */ NotebookShell),
/* harmony export */   Private: () => (/* binding */ Private)
/* harmony export */ });
/* harmony import */ var _jupyterlab_translation__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @jupyterlab/translation */ "webpack/sharing/consume/default/@jupyterlab/translation");
/* harmony import */ var _jupyterlab_translation__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_jupyterlab_translation__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _lumino_algorithm__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @lumino/algorithm */ "webpack/sharing/consume/default/@lumino/algorithm");
/* harmony import */ var _lumino_algorithm__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_lumino_algorithm__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _lumino_coreutils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @lumino/coreutils */ "webpack/sharing/consume/default/@lumino/coreutils");
/* harmony import */ var _lumino_coreutils__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_lumino_coreutils__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _lumino_signaling__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @lumino/signaling */ "webpack/sharing/consume/default/@lumino/signaling");
/* harmony import */ var _lumino_signaling__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_lumino_signaling__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _lumino_widgets__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @lumino/widgets */ "webpack/sharing/consume/default/@lumino/widgets");
/* harmony import */ var _lumino_widgets__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_lumino_widgets__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _panelhandler__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./panelhandler */ "../application/lib/panelhandler.js");
/* harmony import */ var _jupyterlab_ui_components__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @jupyterlab/ui-components */ "webpack/sharing/consume/default/@jupyterlab/ui-components");
/* harmony import */ var _jupyterlab_ui_components__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_jupyterlab_ui_components__WEBPACK_IMPORTED_MODULE_5__);
// Copyright (c) Jupyter Development Team.
// Distributed under the terms of the Modified BSD License.







/**
 * The Jupyter Notebook application shell token.
 */
const INotebookShell = new _lumino_coreutils__WEBPACK_IMPORTED_MODULE_2__.Token('@jupyter-notebook/application:INotebookShell');
/**
 * The default rank for ranked panels.
 */
const DEFAULT_RANK = 900;
/**
 * The application shell.
 */
class NotebookShell extends _lumino_widgets__WEBPACK_IMPORTED_MODULE_4__.Widget {
    constructor() {
        super();
        this._translator = _jupyterlab_translation__WEBPACK_IMPORTED_MODULE_0__.nullTranslator;
        this._currentChanged = new _lumino_signaling__WEBPACK_IMPORTED_MODULE_3__.Signal(this);
        this._mainWidgetLoaded = new _lumino_coreutils__WEBPACK_IMPORTED_MODULE_2__.PromiseDelegate();
        this.id = 'main';
        this._userLayout = {};
        this._topHandler = new _panelhandler__WEBPACK_IMPORTED_MODULE_6__.PanelHandler();
        this._menuHandler = new _panelhandler__WEBPACK_IMPORTED_MODULE_6__.PanelHandler();
        this._leftHandler = new _panelhandler__WEBPACK_IMPORTED_MODULE_6__.SidePanelHandler('left');
        this._rightHandler = new _panelhandler__WEBPACK_IMPORTED_MODULE_6__.SidePanelHandler('right');
        this._main = new _lumino_widgets__WEBPACK_IMPORTED_MODULE_4__.Panel();
        const topWrapper = (this._topWrapper = new _lumino_widgets__WEBPACK_IMPORTED_MODULE_4__.Panel());
        const menuWrapper = (this._menuWrapper = new _lumino_widgets__WEBPACK_IMPORTED_MODULE_4__.Panel());
        this._topHandler.panel.id = 'top-panel';
        this._topHandler.panel.node.setAttribute('role', 'banner');
        this._menuHandler.panel.id = 'menu-panel';
        this._menuHandler.panel.node.setAttribute('role', 'navigation');
        this._main.id = 'main-panel';
        this._main.node.setAttribute('role', 'main');
        this._spacer_top = new _lumino_widgets__WEBPACK_IMPORTED_MODULE_4__.Widget();
        this._spacer_top.id = 'spacer-widget-top';
        this._spacer_bottom = new _lumino_widgets__WEBPACK_IMPORTED_MODULE_4__.Widget();
        this._spacer_bottom.id = 'spacer-widget-bottom';
        // create wrappers around the top and menu areas
        topWrapper.id = 'top-panel-wrapper';
        topWrapper.addWidget(this._topHandler.panel);
        menuWrapper.id = 'menu-panel-wrapper';
        menuWrapper.addWidget(this._menuHandler.panel);
        const rootLayout = new _lumino_widgets__WEBPACK_IMPORTED_MODULE_4__.BoxLayout();
        const leftHandler = this._leftHandler;
        const rightHandler = this._rightHandler;
        leftHandler.panel.id = 'jp-left-stack';
        leftHandler.panel.node.setAttribute('role', 'complementary');
        rightHandler.panel.id = 'jp-right-stack';
        rightHandler.panel.node.setAttribute('role', 'complementary');
        // Hide the side panels by default.
        leftHandler.hide();
        rightHandler.hide();
        const middleLayout = new _lumino_widgets__WEBPACK_IMPORTED_MODULE_4__.BoxLayout({
            spacing: 0,
            direction: 'top-to-bottom',
        });
        _lumino_widgets__WEBPACK_IMPORTED_MODULE_4__.BoxLayout.setStretch(this._topWrapper, 0);
        _lumino_widgets__WEBPACK_IMPORTED_MODULE_4__.BoxLayout.setStretch(this._menuWrapper, 0);
        _lumino_widgets__WEBPACK_IMPORTED_MODULE_4__.BoxLayout.setStretch(this._main, 1);
        const middlePanel = new _lumino_widgets__WEBPACK_IMPORTED_MODULE_4__.Panel({ layout: middleLayout });
        middlePanel.addWidget(this._topWrapper);
        middlePanel.addWidget(this._menuWrapper);
        middlePanel.addWidget(this._spacer_top);
        middlePanel.addWidget(this._main);
        middlePanel.addWidget(this._spacer_bottom);
        middlePanel.layout = middleLayout;
        const vsplitPanel = new _lumino_widgets__WEBPACK_IMPORTED_MODULE_4__.SplitPanel();
        vsplitPanel.id = 'jp-main-vsplit-panel';
        vsplitPanel.spacing = 1;
        vsplitPanel.orientation = 'vertical';
        _lumino_widgets__WEBPACK_IMPORTED_MODULE_4__.SplitPanel.setStretch(vsplitPanel, 1);
        const downPanel = new _jupyterlab_ui_components__WEBPACK_IMPORTED_MODULE_5__.TabPanelSvg({
            tabsMovable: true,
        });
        this._downPanel = downPanel;
        this._downPanel.id = 'jp-down-stack';
        // TODO: Consider storing this as an attribute this._hsplitPanel if saving/restoring layout needed
        const hsplitPanel = new _lumino_widgets__WEBPACK_IMPORTED_MODULE_4__.SplitPanel();
        hsplitPanel.id = 'main-split-panel';
        hsplitPanel.spacing = 1;
        _lumino_widgets__WEBPACK_IMPORTED_MODULE_4__.BoxLayout.setStretch(hsplitPanel, 1);
        _lumino_widgets__WEBPACK_IMPORTED_MODULE_4__.SplitPanel.setStretch(leftHandler.panel, 0);
        _lumino_widgets__WEBPACK_IMPORTED_MODULE_4__.SplitPanel.setStretch(rightHandler.panel, 0);
        _lumino_widgets__WEBPACK_IMPORTED_MODULE_4__.SplitPanel.setStretch(middlePanel, 1);
        hsplitPanel.addWidget(leftHandler.panel);
        hsplitPanel.addWidget(middlePanel);
        hsplitPanel.addWidget(rightHandler.panel);
        // Use relative sizing to set the width of the side panels.
        // This will still respect the min-size of children widget in the stacked
        // panel.
        hsplitPanel.setRelativeSizes([1, 2.5, 1]);
        vsplitPanel.addWidget(hsplitPanel);
        vsplitPanel.addWidget(downPanel);
        rootLayout.spacing = 0;
        rootLayout.addWidget(vsplitPanel);
        // initially hiding the down panel
        this._downPanel.hide();
        // Connect down panel change listeners
        this._downPanel.tabBar.tabMoved.connect(this._onTabPanelChanged, this);
        this._downPanel.stackedPanel.widgetRemoved.connect(this._onTabPanelChanged, this);
        this.layout = rootLayout;
        // Added Skip to Main Link
        const skipLinkWidgetHandler = (this._skipLinkWidgetHandler =
            new Private.SkipLinkWidgetHandler(this));
        this.add(skipLinkWidgetHandler.skipLinkWidget, 'top', { rank: 0 });
        this._skipLinkWidgetHandler.show();
    }
    /**
     * A signal emitted when the current widget changes.
     */
    get currentChanged() {
        return this._currentChanged;
    }
    /**
     * The current widget in the shell's main area.
     */
    get currentWidget() {
        var _a;
        return (_a = this._main.widgets[0]) !== null && _a !== void 0 ? _a : null;
    }
    /**
     * Get the top area wrapper panel
     */
    get top() {
        return this._topWrapper;
    }
    /**
     * Get the menu area wrapper panel
     */
    get menu() {
        return this._menuWrapper;
    }
    /**
     * Get the left area handler
     */
    get leftHandler() {
        return this._leftHandler;
    }
    /**
     * Get the right area handler
     */
    get rightHandler() {
        return this._rightHandler;
    }
    /**
     * Is the left sidebar visible?
     */
    get leftCollapsed() {
        return !(this._leftHandler.isVisible && this._leftHandler.panel.isVisible);
    }
    /**
     * Is the right sidebar visible?
     */
    get rightCollapsed() {
        return !(this._rightHandler.isVisible && this._rightHandler.panel.isVisible);
    }
    /**
     * Promise that resolves when the main widget is loaded
     */
    get restored() {
        return this._mainWidgetLoaded.promise;
    }
    /**
     * Getter and setter for the translator.
     */
    get translator() {
        var _a;
        return (_a = this._translator) !== null && _a !== void 0 ? _a : _jupyterlab_translation__WEBPACK_IMPORTED_MODULE_0__.nullTranslator;
    }
    set translator(value) {
        if (value !== this._translator) {
            this._translator = value;
            const trans = value.load('notebook');
            this._leftHandler.closeButton.title = trans.__('Collapse %1 side panel', this._leftHandler.area);
            this._rightHandler.closeButton.title = trans.__('Collapse %1 side panel', this._rightHandler.area);
        }
    }
    /**
     * User custom shell layout.
     */
    get userLayout() {
        return _lumino_coreutils__WEBPACK_IMPORTED_MODULE_2__.JSONExt.deepCopy(this._userLayout);
    }
    /**
     * Activate a widget in its area.
     */
    activateById(id) {
        // Search all areas that can have widgets for this widget, starting with main.
        for (const area of ['main', 'top', 'left', 'right', 'menu', 'down']) {
            const widget = (0,_lumino_algorithm__WEBPACK_IMPORTED_MODULE_1__.find)(this.widgets(area), (w) => w.id === id);
            if (widget) {
                if (area === 'left') {
                    this.expandLeft(id);
                }
                else if (area === 'right') {
                    this.expandRight(id);
                }
                else if (area === 'down') {
                    this._downPanel.show();
                    widget.activate();
                }
                else {
                    widget.activate();
                }
            }
        }
    }
    /**
     * Add a widget to the application shell.
     *
     * @param widget - The widget being added.
     *
     * @param area - Optional region in the shell into which the widget should
     * be added.
     *
     * @param options - Optional open options.
     *
     */
    add(widget, area, options) {
        var _a, _b;
        let userPosition;
        if ((options === null || options === void 0 ? void 0 : options.type) && this._userLayout[options.type]) {
            userPosition = this._userLayout[options.type];
        }
        else {
            userPosition = this._userLayout[widget.id];
        }
        area = (_a = userPosition === null || userPosition === void 0 ? void 0 : userPosition.area) !== null && _a !== void 0 ? _a : area;
        options =
            options || (userPosition === null || userPosition === void 0 ? void 0 : userPosition.options)
                ? {
                    ...options,
                    ...userPosition === null || userPosition === void 0 ? void 0 : userPosition.options,
                }
                : undefined;
        const rank = (_b = options === null || options === void 0 ? void 0 : options.rank) !== null && _b !== void 0 ? _b : DEFAULT_RANK;
        switch (area) {
            case 'top':
                return this._topHandler.addWidget(widget, rank);
            case 'menu':
                return this._menuHandler.addWidget(widget, rank);
            case 'main':
            case undefined: {
                if (this._main.widgets.length > 0) {
                    // do not add the widget if there is already one
                    return;
                }
                const previousWidget = this.currentWidget;
                this._main.addWidget(widget);
                this._main.update();
                this._currentChanged.emit({
                    newValue: widget,
                    oldValue: previousWidget,
                });
                this._mainWidgetLoaded.resolve();
                break;
            }
            case 'left':
                return this._leftHandler.addWidget(widget, rank);
            case 'right':
                return this._rightHandler.addWidget(widget, rank);
            case 'down':
                return this._downPanel.addWidget(widget);
            default:
                console.warn(`Cannot add widget to area: ${area}`);
        }
    }
    /**
     * Collapse the top area and the spacer to make the view more compact.
     */
    collapseTop() {
        this._topWrapper.setHidden(true);
        this._spacer_top.setHidden(true);
    }
    /**
     * Expand the top area to show the header and the spacer.
     */
    expandTop() {
        this._topWrapper.setHidden(false);
        this._spacer_top.setHidden(false);
    }
    /**
     * Return the list of widgets for the given area.
     *
     * @param area The area
     */
    *widgets(area) {
        switch (area !== null && area !== void 0 ? area : 'main') {
            case 'top':
                yield* this._topHandler.panel.widgets;
                return;
            case 'menu':
                yield* this._menuHandler.panel.widgets;
                return;
            case 'main':
                yield* this._main.widgets;
                return;
            case 'left':
                yield* this._leftHandler.widgets;
                return;
            case 'right':
                yield* this._rightHandler.widgets;
                return;
            case 'down':
                yield* this._downPanel.widgets;
                return;
            default:
                console.error(`This shell has no area called "${area}"`);
                return;
        }
    }
    /**
     * Expand the left panel to show the sidebar with its widget.
     */
    expandLeft(id) {
        this._leftHandler.panel.show();
        this._leftHandler.expand(id); // Show the current widget, if any
    }
    /**
     * Collapse the left panel
     */
    collapseLeft() {
        this._leftHandler.collapse();
        this._leftHandler.panel.hide();
    }
    /**
     * Expand the right panel to show the sidebar with its widget.
     */
    expandRight(id) {
        this._rightHandler.panel.show();
        this._rightHandler.expand(id); // Show the current widget, if any
    }
    /**
     * Collapse the right panel
     */
    collapseRight() {
        this._rightHandler.collapse();
        this._rightHandler.panel.hide();
    }
    /**
     * Restore the layout state and configuration for the application shell.
     */
    async restoreLayout(configuration) {
        this._userLayout = configuration;
    }
    /**
     * Handle a change on the down panel widgets
     */
    _onTabPanelChanged() {
        if (this._downPanel.stackedPanel.widgets.length === 0) {
            this._downPanel.hide();
        }
    }
}
var Private;
(function (Private) {
    class SkipLinkWidgetHandler {
        /**
         * Construct a new skipLink widget handler.
         */
        constructor(shell) {
            this._isDisposed = false;
            const skipLinkWidget = (this._skipLinkWidget = new _lumino_widgets__WEBPACK_IMPORTED_MODULE_4__.Widget());
            const skipToMain = document.createElement('a');
            skipToMain.href = '#first-cell';
            skipToMain.tabIndex = 1;
            skipToMain.text = 'Skip to Main';
            skipToMain.className = 'skip-link';
            skipToMain.addEventListener('click', this);
            skipLinkWidget.addClass('jp-skiplink');
            skipLinkWidget.id = 'jp-skiplink';
            skipLinkWidget.node.appendChild(skipToMain);
        }
        handleEvent(event) {
            switch (event.type) {
                case 'click':
                    this._focusMain();
                    break;
            }
        }
        _focusMain() {
            const input = document.querySelector('#main-panel .jp-InputArea-editor');
            input.tabIndex = 1;
            input.focus();
        }
        /**
         * Get the input element managed by the handler.
         */
        get skipLinkWidget() {
            return this._skipLinkWidget;
        }
        /**
         * Dispose of the handler and the resources it holds.
         */
        dispose() {
            if (this.isDisposed) {
                return;
            }
            this._isDisposed = true;
            this._skipLinkWidget.node.removeEventListener('click', this);
            this._skipLinkWidget.dispose();
        }
        /**
         * Hide the skipLink widget.
         */
        hide() {
            this._skipLinkWidget.hide();
        }
        /**
         * Show the skipLink widget.
         */
        show() {
            this._skipLinkWidget.show();
        }
        /**
         * Test whether the handler has been disposed.
         */
        get isDisposed() {
            return this._isDisposed;
        }
    }
    Private.SkipLinkWidgetHandler = SkipLinkWidgetHandler;
})(Private || (Private = {}));


/***/ }),

/***/ "../application/lib/tokens.js":
/*!************************************!*\
  !*** ../application/lib/tokens.js ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   INotebookPathOpener: () => (/* binding */ INotebookPathOpener)
/* harmony export */ });
/* harmony import */ var _lumino_coreutils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @lumino/coreutils */ "webpack/sharing/consume/default/@lumino/coreutils");
/* harmony import */ var _lumino_coreutils__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_lumino_coreutils__WEBPACK_IMPORTED_MODULE_0__);

/**
 * The INotebookPathOpener token.
 * The main purpose of this token is to allow other extensions or downstream applications
 * to override the default behavior of opening a notebook in a new tab.
 * It also allows passing the path as a URL search parameter, or other options to the window.open call.
 */
const INotebookPathOpener = new _lumino_coreutils__WEBPACK_IMPORTED_MODULE_0__.Token('@jupyter-notebook/application:INotebookPathOpener');


/***/ })

}]);
//# sourceMappingURL=application_lib_index_js-webpack_sharing_consume_default_jupyterlab_rendermime-webpack_sharin-c5b936.b2bf89598840d63c4fde.js.map