"use strict";
/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(self["webpackChunk_JUPYTERLAB_CORE_OUTPUT"] = self["webpackChunk_JUPYTERLAB_CORE_OUTPUT"] || []).push([["packages_documentsearch-extension_lib_index_js-_f4311"],{

/***/ "../packages/documentsearch-extension/lib/index.js":
/*!*********************************************************!*\
  !*** ../packages/documentsearch-extension/lib/index.js ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("{__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var _jupyterlab_documentsearch__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @jupyterlab/documentsearch */ \"webpack/sharing/consume/default/@jupyterlab/documentsearch/@jupyterlab/documentsearch\");\n/* harmony import */ var _jupyterlab_documentsearch__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_jupyterlab_documentsearch__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _jupyter_notebook_application__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @jupyter-notebook/application */ \"webpack/sharing/consume/default/@jupyter-notebook/application/@jupyter-notebook/application\");\n/* harmony import */ var _jupyter_notebook_application__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_jupyter_notebook_application__WEBPACK_IMPORTED_MODULE_1__);\n\n\nconst SEARCHABLE_CLASS = 'jp-mod-searchable';\n/**\n * A plugin to add document search functionalities.\n */\nconst notebookShellWidgetListener = {\n    id: '@jupyter-notebook/documentsearch-extension:notebookShellWidgetListener',\n    requires: [_jupyter_notebook_application__WEBPACK_IMPORTED_MODULE_1__.INotebookShell, _jupyterlab_documentsearch__WEBPACK_IMPORTED_MODULE_0__.ISearchProviderRegistry],\n    autoStart: true,\n    description: 'A plugin to add document search functionalities',\n    activate: (app, notebookShell, registry) => {\n        // If a given widget is searchable, apply the searchable class.\n        // If it's not searchable, remove the class.\n        const transformWidgetSearchability = (widget) => {\n            if (!widget) {\n                return;\n            }\n            if (registry.hasProvider(widget)) {\n                widget.addClass(SEARCHABLE_CLASS);\n            }\n            else {\n                widget.removeClass(SEARCHABLE_CLASS);\n            }\n        };\n        // Update searchability of the active widget when the registry\n        // changes, in case a provider for the current widget was added\n        // or removed\n        registry.changed.connect(() => transformWidgetSearchability(notebookShell.currentWidget));\n        // Apply the searchable class only to the active widget if it is actually\n        // searchable. Remove the searchable class from a widget when it's\n        // no longer active.\n        notebookShell.currentChanged.connect((_, args) => {\n            if (notebookShell.currentWidget) {\n                transformWidgetSearchability(notebookShell.currentWidget);\n            }\n        });\n    },\n};\n/**\n * Export the plugins as default.\n */\nconst plugins = [notebookShellWidgetListener];\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (plugins);\n\n\n//# sourceURL=webpack://_JUPYTERLAB.CORE_OUTPUT/../packages/documentsearch-extension/lib/index.js?\n}");

/***/ })

}]);