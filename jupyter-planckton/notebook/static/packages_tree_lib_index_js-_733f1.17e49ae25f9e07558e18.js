"use strict";
/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(self["webpackChunk_JUPYTERLAB_CORE_OUTPUT"] = self["webpackChunk_JUPYTERLAB_CORE_OUTPUT"] || []).push([["packages_tree_lib_index_js-_733f1"],{

/***/ "../packages/tree/lib/index.js":
/*!*************************************!*\
  !*** ../packages/tree/lib/index.js ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("{__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   INotebookTree: () => (/* reexport safe */ _token__WEBPACK_IMPORTED_MODULE_1__.INotebookTree),\n/* harmony export */   NotebookTreeWidget: () => (/* reexport safe */ _notebook_tree__WEBPACK_IMPORTED_MODULE_0__.NotebookTreeWidget)\n/* harmony export */ });\n/* harmony import */ var _notebook_tree__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./notebook-tree */ \"../packages/tree/lib/notebook-tree.js\");\n/* harmony import */ var _token__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./token */ \"../packages/tree/lib/token.js\");\n\n\n\n\n//# sourceURL=webpack://_JUPYTERLAB.CORE_OUTPUT/../packages/tree/lib/index.js?\n}");

/***/ }),

/***/ "../packages/tree/lib/notebook-tree.js":
/*!*********************************************!*\
  !*** ../packages/tree/lib/notebook-tree.js ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("{__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   NotebookTreeWidget: () => (/* binding */ NotebookTreeWidget)\n/* harmony export */ });\n/* harmony import */ var _jupyterlab_ui_components__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @jupyterlab/ui-components */ \"webpack/sharing/consume/default/@jupyterlab/ui-components/@jupyterlab/ui-components?6d29\");\n/* harmony import */ var _jupyterlab_ui_components__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_jupyterlab_ui_components__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _lumino_widgets__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @lumino/widgets */ \"webpack/sharing/consume/default/@lumino/widgets/@lumino/widgets\");\n/* harmony import */ var _lumino_widgets__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_lumino_widgets__WEBPACK_IMPORTED_MODULE_1__);\n\n\n/**\n * The widget added in main area of the tree view.\n */\nclass NotebookTreeWidget extends _lumino_widgets__WEBPACK_IMPORTED_MODULE_1__.TabPanel {\n    /**\n     * Constructor of the NotebookTreeWidget.\n     */\n    constructor() {\n        super({\n            tabPlacement: 'top',\n            tabsMovable: true,\n            renderer: _jupyterlab_ui_components__WEBPACK_IMPORTED_MODULE_0__.TabBarSvg.defaultRenderer,\n        });\n        this.addClass('jp-TreePanel');\n    }\n}\n\n\n//# sourceURL=webpack://_JUPYTERLAB.CORE_OUTPUT/../packages/tree/lib/notebook-tree.js?\n}");

/***/ }),

/***/ "../packages/tree/lib/token.js":
/*!*************************************!*\
  !*** ../packages/tree/lib/token.js ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("{__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   INotebookTree: () => (/* binding */ INotebookTree)\n/* harmony export */ });\n/* harmony import */ var _lumino_coreutils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @lumino/coreutils */ \"webpack/sharing/consume/default/@lumino/coreutils/@lumino/coreutils\");\n/* harmony import */ var _lumino_coreutils__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_lumino_coreutils__WEBPACK_IMPORTED_MODULE_0__);\n\n/**\n * The INotebookTree token.\n */\nconst INotebookTree = new _lumino_coreutils__WEBPACK_IMPORTED_MODULE_0__.Token('@jupyter-notebook/tree:INotebookTree');\n\n\n//# sourceURL=webpack://_JUPYTERLAB.CORE_OUTPUT/../packages/tree/lib/token.js?\n}");

/***/ })

}]);