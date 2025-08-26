"use strict";
(self["webpackChunk_jupyter_notebook_lab_extension"] = self["webpackChunk_jupyter_notebook_lab_extension"] || []).push([["lib_index_js"],{

/***/ "./lib/index.js":
/*!**********************!*\
  !*** ./lib/index.js ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _jupyterlab_application__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @jupyterlab/application */ "webpack/sharing/consume/default/@jupyterlab/application");
/* harmony import */ var _jupyterlab_application__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_jupyterlab_application__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _jupyterlab_apputils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @jupyterlab/apputils */ "webpack/sharing/consume/default/@jupyterlab/apputils");
/* harmony import */ var _jupyterlab_apputils__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_jupyterlab_apputils__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _jupyterlab_coreutils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @jupyterlab/coreutils */ "webpack/sharing/consume/default/@jupyterlab/coreutils");
/* harmony import */ var _jupyterlab_coreutils__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_jupyterlab_coreutils__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _jupyterlab_notebook__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @jupyterlab/notebook */ "webpack/sharing/consume/default/@jupyterlab/notebook");
/* harmony import */ var _jupyterlab_notebook__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_jupyterlab_notebook__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _jupyterlab_translation__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @jupyterlab/translation */ "webpack/sharing/consume/default/@jupyterlab/translation");
/* harmony import */ var _jupyterlab_translation__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_jupyterlab_translation__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _lumino_widgets__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @lumino/widgets */ "webpack/sharing/consume/default/@lumino/widgets");
/* harmony import */ var _lumino_widgets__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_lumino_widgets__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _jupyter_notebook_application__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @jupyter-notebook/application */ "webpack/sharing/consume/default/@jupyter-notebook/application/@jupyter-notebook/application");
/* harmony import */ var _jupyter_notebook_application__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(_jupyter_notebook_application__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var _jupyterlab_ui_components__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @jupyterlab/ui-components */ "webpack/sharing/consume/default/@jupyterlab/ui-components");
/* harmony import */ var _jupyterlab_ui_components__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(_jupyterlab_ui_components__WEBPACK_IMPORTED_MODULE_7__);
// Copyright (c) Jupyter Development Team.
// Distributed under the terms of the Modified BSD License.








/**
 * The command IDs used by the application plugin.
 */
var CommandIDs;
(function (CommandIDs) {
    /**
     * Launch Jupyter Notebook Tree
     */
    CommandIDs.launchNotebookTree = 'jupyter-notebook:launch-tree';
    /**
     * Open Jupyter Notebook
     */
    CommandIDs.openNotebook = 'jupyter-notebook:open-notebook';
    /**
     * Open in JupyterLab
     */
    CommandIDs.openLab = 'jupyter-notebook:open-lab';
    /**
     * Open in NbClassic
     */
    CommandIDs.openNbClassic = 'jupyter-notebook:open-nbclassic';
})(CommandIDs || (CommandIDs = {}));
/**
 * A plugin to add custom toolbar items to the notebook page
 */
const interfaceSwitcher = {
    id: '@jupyter-notebook/lab-extension:interface-switcher',
    description: 'A plugin to add custom toolbar items to the notebook page.',
    autoStart: true,
    requires: [_jupyterlab_translation__WEBPACK_IMPORTED_MODULE_4__.ITranslator],
    optional: [
        _jupyterlab_notebook__WEBPACK_IMPORTED_MODULE_3__.INotebookTracker,
        _jupyterlab_apputils__WEBPACK_IMPORTED_MODULE_1__.ICommandPalette,
        _jupyter_notebook_application__WEBPACK_IMPORTED_MODULE_6__.INotebookPathOpener,
        _jupyter_notebook_application__WEBPACK_IMPORTED_MODULE_6__.INotebookShell,
        _jupyterlab_application__WEBPACK_IMPORTED_MODULE_0__.ILabShell,
        _jupyterlab_apputils__WEBPACK_IMPORTED_MODULE_1__.IToolbarWidgetRegistry,
    ],
    activate: (app, translator, notebookTracker, palette, notebookPathOpener, notebookShell, labShell, toolbarRegistry) => {
        if (!notebookTracker) {
            // bail if trying to use this plugin without a notebook tracker
            return;
        }
        const { commands, shell } = app;
        const baseUrl = _jupyterlab_coreutils__WEBPACK_IMPORTED_MODULE_2__.PageConfig.getBaseUrl();
        const trans = translator.load('notebook');
        const nbClassicEnabled = _jupyterlab_coreutils__WEBPACK_IMPORTED_MODULE_2__.PageConfig.getOption('nbclassic_enabled') === 'true';
        const switcher = new _lumino_widgets__WEBPACK_IMPORTED_MODULE_5__.Menu({ commands });
        const switcherOptions = [];
        const opener = notebookPathOpener !== null && notebookPathOpener !== void 0 ? notebookPathOpener : _jupyter_notebook_application__WEBPACK_IMPORTED_MODULE_6__.defaultNotebookPathOpener;
        if (!notebookShell) {
            switcherOptions.push({
                command: CommandIDs.openNotebook,
                commandLabel: trans.__('Notebook'),
                commandDescription: trans.__('Open in %1', 'Jupyter Notebook'),
                buttonLabel: 'openNotebook',
                urlPrefix: `${baseUrl}tree`,
            });
        }
        if (!labShell) {
            switcherOptions.push({
                command: CommandIDs.openLab,
                commandLabel: trans.__('JupyterLab'),
                commandDescription: trans.__('Open in %1', 'JupyterLab'),
                buttonLabel: 'openLab',
                urlPrefix: `${baseUrl}doc/tree`,
            });
        }
        if (nbClassicEnabled) {
            switcherOptions.push({
                command: CommandIDs.openNbClassic,
                commandLabel: trans.__('NbClassic'),
                commandDescription: trans.__('Open in %1', 'NbClassic'),
                buttonLabel: 'openNbClassic',
                urlPrefix: `${baseUrl}nbclassic/notebooks`,
            });
        }
        const isEnabled = () => {
            return (notebookTracker.currentWidget !== null &&
                notebookTracker.currentWidget === shell.currentWidget);
        };
        const addSwitcherCommand = (option) => {
            const { command, commandLabel, commandDescription, urlPrefix } = option;
            const execute = () => {
                const current = notebookTracker.currentWidget;
                if (!current) {
                    return;
                }
                opener.open({
                    prefix: urlPrefix,
                    path: current.context.path,
                });
            };
            commands.addCommand(command, {
                label: (args) => {
                    args.noLabel ? '' : commandLabel;
                    if (args.isMenu || args.isPalette) {
                        return commandDescription;
                    }
                    return commandLabel;
                },
                caption: commandLabel,
                execute,
                isEnabled,
            });
            if (palette) {
                palette.addItem({
                    command,
                    category: 'Other',
                    args: { isPalette: true },
                });
            }
        };
        switcherOptions.forEach((option) => {
            const { command } = option;
            addSwitcherCommand(option);
            switcher.addItem({ command });
        });
        let toolbarFactory;
        if (switcherOptions.length === 1) {
            toolbarFactory = (panel) => {
                const toolbarButton = new _jupyterlab_ui_components__WEBPACK_IMPORTED_MODULE_7__.CommandToolbarButton({
                    commands,
                    id: switcherOptions[0].command,
                    label: switcherOptions[0].commandLabel,
                    icon: _jupyterlab_ui_components__WEBPACK_IMPORTED_MODULE_7__.launchIcon,
                });
                toolbarButton.addClass('jp-nb-interface-switcher-button');
                return toolbarButton;
            };
        }
        else {
            const overflowOptions = {
                overflowMenuOptions: { isVisible: false },
            };
            const menubar = new _lumino_widgets__WEBPACK_IMPORTED_MODULE_5__.MenuBar(overflowOptions);
            switcher.title.label = trans.__('Open in...');
            switcher.title.icon = _jupyterlab_ui_components__WEBPACK_IMPORTED_MODULE_7__.caretDownIcon;
            menubar.addMenu(switcher);
            toolbarFactory = (panel) => {
                const menubar = new _lumino_widgets__WEBPACK_IMPORTED_MODULE_5__.MenuBar(overflowOptions);
                menubar.addMenu(switcher);
                menubar.addClass('jp-InterfaceSwitcher');
                return menubar;
            };
        }
        if (toolbarRegistry) {
            toolbarRegistry.addFactory('Notebook', 'interfaceSwitcher', toolbarFactory);
        }
    },
};
/**
 * A plugin to add a command to open the Jupyter Notebook Tree.
 */
const launchNotebookTree = {
    id: '@jupyter-notebook/lab-extension:launch-tree',
    description: 'A plugin to add a command to open the Jupyter Notebook Tree.',
    autoStart: true,
    requires: [_jupyterlab_translation__WEBPACK_IMPORTED_MODULE_4__.ITranslator],
    optional: [_jupyterlab_apputils__WEBPACK_IMPORTED_MODULE_1__.ICommandPalette],
    activate: (app, translator, palette) => {
        const { commands } = app;
        const trans = translator.load('notebook');
        const category = trans.__('Help');
        commands.addCommand(CommandIDs.launchNotebookTree, {
            label: trans.__('Launch Jupyter Notebook File Browser'),
            execute: () => {
                const url = _jupyterlab_coreutils__WEBPACK_IMPORTED_MODULE_2__.URLExt.join(_jupyterlab_coreutils__WEBPACK_IMPORTED_MODULE_2__.PageConfig.getBaseUrl(), 'tree');
                window.open(url);
            },
        });
        if (palette) {
            palette.addItem({ command: CommandIDs.launchNotebookTree, category });
        }
    },
};
/**
 * Export the plugins as default.
 */
const plugins = [
    launchNotebookTree,
    interfaceSwitcher,
];
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (plugins);


/***/ })

}]);
//# sourceMappingURL=lib_index_js.cbdea86d575fad65eab5.js.map