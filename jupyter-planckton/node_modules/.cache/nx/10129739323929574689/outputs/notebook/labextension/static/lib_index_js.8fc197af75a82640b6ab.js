"use strict";
(self["webpackChunk_jupyter_notebook_lab_extension"] = self["webpackChunk_jupyter_notebook_lab_extension"] || []).push([["lib_index_js"],{

/***/ "../../node_modules/@jupyterlab/builder/node_modules/css-loader/dist/cjs.js!../notebook-extension/style/base.css":
/*!***********************************************************************************************************************!*\
  !*** ../../node_modules/@jupyterlab/builder/node_modules/css-loader/dist/cjs.js!../notebook-extension/style/base.css ***!
  \***********************************************************************************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_jupyterlab_builder_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../node_modules/@jupyterlab/builder/node_modules/css-loader/dist/runtime/sourceMaps.js */ "../../node_modules/@jupyterlab/builder/node_modules/css-loader/dist/runtime/sourceMaps.js");
/* harmony import */ var _node_modules_jupyterlab_builder_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_jupyterlab_builder_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_jupyterlab_builder_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../node_modules/@jupyterlab/builder/node_modules/css-loader/dist/runtime/api.js */ "../../node_modules/@jupyterlab/builder/node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_jupyterlab_builder_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_jupyterlab_builder_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _node_modules_jupyterlab_builder_node_modules_css_loader_dist_cjs_js_variables_css__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! -!../../../node_modules/@jupyterlab/builder/node_modules/css-loader/dist/cjs.js!./variables.css */ "../../node_modules/@jupyterlab/builder/node_modules/css-loader/dist/cjs.js!../notebook-extension/style/variables.css");
// Imports



var ___CSS_LOADER_EXPORT___ = _node_modules_jupyterlab_builder_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_jupyterlab_builder_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
___CSS_LOADER_EXPORT___.i(_node_modules_jupyterlab_builder_node_modules_css_loader_dist_cjs_js_variables_css__WEBPACK_IMPORTED_MODULE_2__["default"]);
// Module
___CSS_LOADER_EXPORT___.push([module.id, `/*-----------------------------------------------------------------------------
| Copyright (c) Jupyter Development Team.
|
| Distributed under the terms of the Modified BSD License.
|----------------------------------------------------------------------------*/

/**
  Document oriented look for the notebook.
  This includes changes to the look and feel of the JupyterLab Notebook
  component like:
  - scrollbar to the right of the page
  - drop shadow on the notebook
  - smaller empty space at the bottom of the notebook
  - compact view on mobile
*/

/* Make the notebook take up the full width of the page when jp-mod-fullwidth is set */

body[data-notebook='notebooks']
  .jp-NotebookPanel.jp-mod-fullwidth
  .jp-WindowedPanel-outer {
  padding-left: unset;
  padding-right: unset !important;
  width: unset;
}

/* Keep the notebook centered on the page */

body[data-notebook='notebooks'] .jp-NotebookPanel-toolbar {
  padding-left: calc(calc(100% - var(--jp-notebook-max-width)) * 0.5);
  padding-right: calc(calc(100% - var(--jp-notebook-max-width)) * 0.5);
}

body[data-notebook='notebooks'] .jp-WindowedPanel-outer {
  width: unset !important;
  padding-top: unset;
  padding-left: calc(calc(100% - var(--jp-notebook-max-width)) * 0.5);
  padding-right: calc(
    calc(
        100% - var(--jp-notebook-max-width) - var(--jp-notebook-padding-offset)
      ) * 0.5
  ) !important;
  background: var(--jp-layout-color2);
}

body[data-notebook='notebooks'] .jp-WindowedPanel-inner {
  margin-top: var(--jp-notebook-toolbar-margin-bottom);
  /* Adjustments for the extra top and bottom notebook padding */
  margin-bottom: calc(4 * var(--jp-notebook-padding));
}

body[data-notebook='notebooks'] .jp-Notebook-cell {
  background: var(--jp-layout-color0);
}

/* Empty space at the bottom of the notebook (similar to classic) */
body[data-notebook='notebooks']
  .jp-Notebook.jp-mod-scrollPastEnd
  .jp-WindowedPanel-outer::after {
  min-height: 100px;
}

/* Fix background colors */

body[data-notebook='notebooks'] .jp-WindowedPanel-outer > * {
  background: var(--jp-layout-color0);
}

body[data-notebook='notebooks']
  .jp-Notebook.jp-mod-commandMode
  .jp-Cell.jp-mod-active.jp-mod-selected:not(.jp-mod-multiSelected) {
  background: var(--jp-layout-color0) !important;
}

body[data-notebook='notebooks']
  .jp-Notebook
  .jp-Notebook-cell:not(:first-child)::before {
  content: ' ';
  height: 100%;
  position: absolute;
  top: 0;
  width: 11px;
}

/* Cell toolbar adjustments */

body[data-notebook='notebooks'] .jp-cell-toolbar {
  background: unset;
  box-shadow: unset;
}

/** first code cell on mobile
    (keep the selector above the media query)
*/
body[data-notebook='notebooks']
  .jp-CodeCell[data-windowed-list-index='0']
  .jp-cell-toolbar {
  top: unset;
}

@media only screen and (max-width: 760px) {
  /* first code cell on mobile */
  body[data-notebook='notebooks']
    .jp-CodeCell[data-windowed-list-index='0']
    .jp-cell-toolbar {
    top: var(--jp-notebook-padding);
  }

  body[data-notebook='notebooks'] .jp-MarkdownCell .jp-cell-toolbar,
  body[data-notebook='notebooks'] .jp-RawCell .jp-cell-toolbar {
    top: calc(0.5 * var(--jp-notebook-padding));
  }
}

/* Tweak the notebook footer (to add a new cell) */
body[data-notebook='notebooks'] .jp-Notebook-footer {
  background: unset;
  width: 100%;
  margin-left: unset;
}

/* Mobile View */

body[data-format='mobile'] .jp-NotebookCheckpoint {
  display: none;
}

body[data-format='mobile'] .jp-WindowedPanel-outer > *:first-child {
  margin-top: 0;
}

body[data-format='mobile'] .jp-ToolbarButton .jp-DebuggerBugButton {
  display: none;
}

body[data-notebook='notebooks'] .jp-WindowedPanel-viewport {
  background: var(--jp-layout-color0);
  box-shadow: var(--jp-elevation-z4);

  /* Extra padding at the top and bottom so the notebook looks nicer */
  padding-top: calc(2 * var(--jp-notebook-padding));
  padding-bottom: calc(2 * var(--jp-notebook-padding));
}

/* Notebook box shadow */

body[data-notebook='notebooks']
  .jp-Notebook
  > *:first-child:last-child::before {
  content: '';
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  box-shadow: 0px 0px 12px 1px var(--jp-shadow-umbra-color);
}

/* Additional customizations of the components on the notebook page */

.jp-NotebookKernelLogo {
  flex: 0 0 auto;
  display: flex;
  align-items: center;
  text-align: center;
  margin-right: 8px;
}

.jp-NotebookKernelLogo img {
  max-width: 28px;
  max-height: 28px;
  display: flex;
}

.jp-NotebookKernelStatus {
  margin: 0;
  font-weight: normal;
  font-size: var(--jp-ui-font-size1);
  color: var(--jp-ui-font-color0);
  font-family: var(--jp-ui-font-family);
  line-height: var(--jp-private-title-panel-height);
  padding-left: var(--jp-kernel-status-padding);
  padding-right: var(--jp-kernel-status-padding);
}

.jp-NotebookKernelStatus-error {
  background-color: var(--jp-error-color0);
}

.jp-NotebookKernelStatus-warn {
  background-color: var(--jp-warn-color0);
}

.jp-NotebookKernelStatus-info {
  background-color: var(--jp-info-color0);
}

.jp-NotebookKernelStatus-fade {
  animation: 0.5s fade-out forwards;
}

.jp-NotebookTrustedStatus {
  background: var(--jp-layout-color1);
  color: var(--jp-ui-font-color1);
  margin-top: 4px;
  margin-bottom: 4px;
  border: solid 1px var(--jp-border-color2);
  cursor: help;
}

.jp-NotebookTrustedStatus-not-trusted {
  cursor: pointer;
}

@keyframes fade-out {
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}

#jp-title h1 {
  cursor: pointer;
  font-size: 18px;
  margin: 0;
  font-weight: normal;
  color: var(--jp-ui-font-color0);
  font-family: var(--jp-ui-font-family);
  line-height: calc(1.5 * var(--jp-private-title-panel-height));
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}

#jp-title h1:hover {
  background: var(--jp-layout-color2);
}

.jp-NotebookCheckpoint {
  font-size: 14px;
  margin-left: 5px;
  margin-right: 5px;
  font-weight: normal;
  color: var(--jp-ui-font-color0);
  font-family: var(--jp-ui-font-family);
  line-height: calc(1.5 * var(--jp-private-title-panel-height));
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}

.jp-skiplink {
  position: absolute;
  top: -100em;
}

.jp-skiplink:focus-within {
  position: absolute;
  z-index: 10000;
  top: 0;
  left: 46%;
  margin: 0 auto;
  padding: 1em;
  width: 15%;
  box-shadow: var(--jp-elevation-z4);
  border-radius: 4px;
  background: var(--jp-layout-color0);
  text-align: center;
}

.jp-skiplink:focus-within a {
  text-decoration: underline;
  color: var(--jp-content-link-color);
}

/* Planckton AI Assistant Panel Styles */
.jp-PlancktonPanel {
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  background: #f8fbff;
  border-radius: 0;
  box-shadow: none;
  font-family: var(--jp-ui-font-family, sans-serif);
}
.jp-PlancktonPanel-header {
  font-size: 1.2em;
  font-weight: bold;
  padding: 12px 16px;
  background: #e3f0ff;
  border-bottom: 1px solid #b3d8ff;
  color: #1a4e7a;
}
.jp-PlancktonPanel-messages {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  background: #f8fbff;
}
.jp-PlancktonPanel-msg {
  width: 100%;
  box-sizing: border-box;
  margin-bottom: 10px;
  border-radius: 6px;
  word-break: break-word;
}
.jp-PlancktonPanel-msg-user {
  align-self: flex-end;
}
.jp-PlancktonPanel-msg-planckton {
  align-self: flex-start;
}
.jp-PlancktonPanel-input {
  display: flex;
  padding: 12px 16px;
  border-top: 1px solid #b3d8ff;
  background: #f1f5f9;
}
.jp-PlancktonPanel-input input[type="text"] {
  flex: 1;
  padding: 8px;
  border: 1px solid #b3d8ff;
  border-radius: 4px;
  font-size: 1em;
  margin-right: 8px;
}
.jp-PlancktonPanel-input button {
  background: #2563eb;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 8px 16px;
  font-size: 1em;
  cursor: pointer;
  transition: background 0.2s;
}
.jp-PlancktonPanel-input button:disabled {
  background: #b3d8ff;
  cursor: not-allowed;
}

/* Planckton Toolbar Button */
.jp-PlancktonToolbarButton {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  margin-left: 4px;
}
.jp-PlancktonToolbarButton svg {
  width: 22px;
  height: 22px;
  fill: #2563eb;
  transition: filter 0.2s;
}
.jp-PlancktonToolbarButton:hover svg {
  filter: brightness(1.2) drop-shadow(0 0 2px #60a5fa);
}
`, "",{"version":3,"sources":["webpack://./../notebook-extension/style/base.css"],"names":[],"mappings":"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","sourcesContent":["/*-----------------------------------------------------------------------------\n| Copyright (c) Jupyter Development Team.\n|\n| Distributed under the terms of the Modified BSD License.\n|----------------------------------------------------------------------------*/\n\n@import './variables.css';\n\n/**\n  Document oriented look for the notebook.\n  This includes changes to the look and feel of the JupyterLab Notebook\n  component like:\n  - scrollbar to the right of the page\n  - drop shadow on the notebook\n  - smaller empty space at the bottom of the notebook\n  - compact view on mobile\n*/\n\n/* Make the notebook take up the full width of the page when jp-mod-fullwidth is set */\n\nbody[data-notebook='notebooks']\n  .jp-NotebookPanel.jp-mod-fullwidth\n  .jp-WindowedPanel-outer {\n  padding-left: unset;\n  padding-right: unset !important;\n  width: unset;\n}\n\n/* Keep the notebook centered on the page */\n\nbody[data-notebook='notebooks'] .jp-NotebookPanel-toolbar {\n  padding-left: calc(calc(100% - var(--jp-notebook-max-width)) * 0.5);\n  padding-right: calc(calc(100% - var(--jp-notebook-max-width)) * 0.5);\n}\n\nbody[data-notebook='notebooks'] .jp-WindowedPanel-outer {\n  width: unset !important;\n  padding-top: unset;\n  padding-left: calc(calc(100% - var(--jp-notebook-max-width)) * 0.5);\n  padding-right: calc(\n    calc(\n        100% - var(--jp-notebook-max-width) - var(--jp-notebook-padding-offset)\n      ) * 0.5\n  ) !important;\n  background: var(--jp-layout-color2);\n}\n\nbody[data-notebook='notebooks'] .jp-WindowedPanel-inner {\n  margin-top: var(--jp-notebook-toolbar-margin-bottom);\n  /* Adjustments for the extra top and bottom notebook padding */\n  margin-bottom: calc(4 * var(--jp-notebook-padding));\n}\n\nbody[data-notebook='notebooks'] .jp-Notebook-cell {\n  background: var(--jp-layout-color0);\n}\n\n/* Empty space at the bottom of the notebook (similar to classic) */\nbody[data-notebook='notebooks']\n  .jp-Notebook.jp-mod-scrollPastEnd\n  .jp-WindowedPanel-outer::after {\n  min-height: 100px;\n}\n\n/* Fix background colors */\n\nbody[data-notebook='notebooks'] .jp-WindowedPanel-outer > * {\n  background: var(--jp-layout-color0);\n}\n\nbody[data-notebook='notebooks']\n  .jp-Notebook.jp-mod-commandMode\n  .jp-Cell.jp-mod-active.jp-mod-selected:not(.jp-mod-multiSelected) {\n  background: var(--jp-layout-color0) !important;\n}\n\nbody[data-notebook='notebooks']\n  .jp-Notebook\n  .jp-Notebook-cell:not(:first-child)::before {\n  content: ' ';\n  height: 100%;\n  position: absolute;\n  top: 0;\n  width: 11px;\n}\n\n/* Cell toolbar adjustments */\n\nbody[data-notebook='notebooks'] .jp-cell-toolbar {\n  background: unset;\n  box-shadow: unset;\n}\n\n/** first code cell on mobile\n    (keep the selector above the media query)\n*/\nbody[data-notebook='notebooks']\n  .jp-CodeCell[data-windowed-list-index='0']\n  .jp-cell-toolbar {\n  top: unset;\n}\n\n@media only screen and (max-width: 760px) {\n  /* first code cell on mobile */\n  body[data-notebook='notebooks']\n    .jp-CodeCell[data-windowed-list-index='0']\n    .jp-cell-toolbar {\n    top: var(--jp-notebook-padding);\n  }\n\n  body[data-notebook='notebooks'] .jp-MarkdownCell .jp-cell-toolbar,\n  body[data-notebook='notebooks'] .jp-RawCell .jp-cell-toolbar {\n    top: calc(0.5 * var(--jp-notebook-padding));\n  }\n}\n\n/* Tweak the notebook footer (to add a new cell) */\nbody[data-notebook='notebooks'] .jp-Notebook-footer {\n  background: unset;\n  width: 100%;\n  margin-left: unset;\n}\n\n/* Mobile View */\n\nbody[data-format='mobile'] .jp-NotebookCheckpoint {\n  display: none;\n}\n\nbody[data-format='mobile'] .jp-WindowedPanel-outer > *:first-child {\n  margin-top: 0;\n}\n\nbody[data-format='mobile'] .jp-ToolbarButton .jp-DebuggerBugButton {\n  display: none;\n}\n\nbody[data-notebook='notebooks'] .jp-WindowedPanel-viewport {\n  background: var(--jp-layout-color0);\n  box-shadow: var(--jp-elevation-z4);\n\n  /* Extra padding at the top and bottom so the notebook looks nicer */\n  padding-top: calc(2 * var(--jp-notebook-padding));\n  padding-bottom: calc(2 * var(--jp-notebook-padding));\n}\n\n/* Notebook box shadow */\n\nbody[data-notebook='notebooks']\n  .jp-Notebook\n  > *:first-child:last-child::before {\n  content: '';\n  position: absolute;\n  top: 0;\n  bottom: 0;\n  left: 0;\n  right: 0;\n  box-shadow: 0px 0px 12px 1px var(--jp-shadow-umbra-color);\n}\n\n/* Additional customizations of the components on the notebook page */\n\n.jp-NotebookKernelLogo {\n  flex: 0 0 auto;\n  display: flex;\n  align-items: center;\n  text-align: center;\n  margin-right: 8px;\n}\n\n.jp-NotebookKernelLogo img {\n  max-width: 28px;\n  max-height: 28px;\n  display: flex;\n}\n\n.jp-NotebookKernelStatus {\n  margin: 0;\n  font-weight: normal;\n  font-size: var(--jp-ui-font-size1);\n  color: var(--jp-ui-font-color0);\n  font-family: var(--jp-ui-font-family);\n  line-height: var(--jp-private-title-panel-height);\n  padding-left: var(--jp-kernel-status-padding);\n  padding-right: var(--jp-kernel-status-padding);\n}\n\n.jp-NotebookKernelStatus-error {\n  background-color: var(--jp-error-color0);\n}\n\n.jp-NotebookKernelStatus-warn {\n  background-color: var(--jp-warn-color0);\n}\n\n.jp-NotebookKernelStatus-info {\n  background-color: var(--jp-info-color0);\n}\n\n.jp-NotebookKernelStatus-fade {\n  animation: 0.5s fade-out forwards;\n}\n\n.jp-NotebookTrustedStatus {\n  background: var(--jp-layout-color1);\n  color: var(--jp-ui-font-color1);\n  margin-top: 4px;\n  margin-bottom: 4px;\n  border: solid 1px var(--jp-border-color2);\n  cursor: help;\n}\n\n.jp-NotebookTrustedStatus-not-trusted {\n  cursor: pointer;\n}\n\n@keyframes fade-out {\n  0% {\n    opacity: 1;\n  }\n  100% {\n    opacity: 0;\n  }\n}\n\n#jp-title h1 {\n  cursor: pointer;\n  font-size: 18px;\n  margin: 0;\n  font-weight: normal;\n  color: var(--jp-ui-font-color0);\n  font-family: var(--jp-ui-font-family);\n  line-height: calc(1.5 * var(--jp-private-title-panel-height));\n  text-overflow: ellipsis;\n  overflow: hidden;\n  white-space: nowrap;\n}\n\n#jp-title h1:hover {\n  background: var(--jp-layout-color2);\n}\n\n.jp-NotebookCheckpoint {\n  font-size: 14px;\n  margin-left: 5px;\n  margin-right: 5px;\n  font-weight: normal;\n  color: var(--jp-ui-font-color0);\n  font-family: var(--jp-ui-font-family);\n  line-height: calc(1.5 * var(--jp-private-title-panel-height));\n  text-overflow: ellipsis;\n  overflow: hidden;\n  white-space: nowrap;\n}\n\n.jp-skiplink {\n  position: absolute;\n  top: -100em;\n}\n\n.jp-skiplink:focus-within {\n  position: absolute;\n  z-index: 10000;\n  top: 0;\n  left: 46%;\n  margin: 0 auto;\n  padding: 1em;\n  width: 15%;\n  box-shadow: var(--jp-elevation-z4);\n  border-radius: 4px;\n  background: var(--jp-layout-color0);\n  text-align: center;\n}\n\n.jp-skiplink:focus-within a {\n  text-decoration: underline;\n  color: var(--jp-content-link-color);\n}\n\n/* Planckton AI Assistant Panel Styles */\n.jp-PlancktonPanel {\n  position: relative;\n  display: flex;\n  flex-direction: column;\n  height: 100%;\n  width: 100%;\n  background: #f8fbff;\n  border-radius: 0;\n  box-shadow: none;\n  font-family: var(--jp-ui-font-family, sans-serif);\n}\n.jp-PlancktonPanel-header {\n  font-size: 1.2em;\n  font-weight: bold;\n  padding: 12px 16px;\n  background: #e3f0ff;\n  border-bottom: 1px solid #b3d8ff;\n  color: #1a4e7a;\n}\n.jp-PlancktonPanel-messages {\n  flex: 1;\n  overflow-y: auto;\n  padding: 16px;\n  background: #f8fbff;\n}\n.jp-PlancktonPanel-msg {\n  width: 100%;\n  box-sizing: border-box;\n  margin-bottom: 10px;\n  border-radius: 6px;\n  word-break: break-word;\n}\n.jp-PlancktonPanel-msg-user {\n  align-self: flex-end;\n}\n.jp-PlancktonPanel-msg-planckton {\n  align-self: flex-start;\n}\n.jp-PlancktonPanel-input {\n  display: flex;\n  padding: 12px 16px;\n  border-top: 1px solid #b3d8ff;\n  background: #f1f5f9;\n}\n.jp-PlancktonPanel-input input[type=\"text\"] {\n  flex: 1;\n  padding: 8px;\n  border: 1px solid #b3d8ff;\n  border-radius: 4px;\n  font-size: 1em;\n  margin-right: 8px;\n}\n.jp-PlancktonPanel-input button {\n  background: #2563eb;\n  color: white;\n  border: none;\n  border-radius: 4px;\n  padding: 8px 16px;\n  font-size: 1em;\n  cursor: pointer;\n  transition: background 0.2s;\n}\n.jp-PlancktonPanel-input button:disabled {\n  background: #b3d8ff;\n  cursor: not-allowed;\n}\n\n/* Planckton Toolbar Button */\n.jp-PlancktonToolbarButton {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  width: 32px;\n  height: 32px;\n  background: none;\n  border: none;\n  cursor: pointer;\n  padding: 0;\n  margin-left: 4px;\n}\n.jp-PlancktonToolbarButton svg {\n  width: 22px;\n  height: 22px;\n  fill: #2563eb;\n  transition: filter 0.2s;\n}\n.jp-PlancktonToolbarButton:hover svg {\n  filter: brightness(1.2) drop-shadow(0 0 2px #60a5fa);\n}\n"],"sourceRoot":""}]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "../../node_modules/@jupyterlab/builder/node_modules/css-loader/dist/cjs.js!../notebook-extension/style/index.css":
/*!************************************************************************************************************************!*\
  !*** ../../node_modules/@jupyterlab/builder/node_modules/css-loader/dist/cjs.js!../notebook-extension/style/index.css ***!
  \************************************************************************************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_jupyterlab_builder_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../node_modules/@jupyterlab/builder/node_modules/css-loader/dist/runtime/sourceMaps.js */ "../../node_modules/@jupyterlab/builder/node_modules/css-loader/dist/runtime/sourceMaps.js");
/* harmony import */ var _node_modules_jupyterlab_builder_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_jupyterlab_builder_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_jupyterlab_builder_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../node_modules/@jupyterlab/builder/node_modules/css-loader/dist/runtime/api.js */ "../../node_modules/@jupyterlab/builder/node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_jupyterlab_builder_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_jupyterlab_builder_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _node_modules_jupyterlab_builder_node_modules_css_loader_dist_cjs_js_base_css__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! -!../../../node_modules/@jupyterlab/builder/node_modules/css-loader/dist/cjs.js!./base.css */ "../../node_modules/@jupyterlab/builder/node_modules/css-loader/dist/cjs.js!../notebook-extension/style/base.css");
// Imports



var ___CSS_LOADER_EXPORT___ = _node_modules_jupyterlab_builder_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_jupyterlab_builder_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
___CSS_LOADER_EXPORT___.i(_node_modules_jupyterlab_builder_node_modules_css_loader_dist_cjs_js_base_css__WEBPACK_IMPORTED_MODULE_2__["default"]);
// Module
___CSS_LOADER_EXPORT___.push([module.id, `/* Planckton Chat Panel Styles */
.jp-PlancktonPanel {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: var(--jp-layout-color0);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  width: 100%;
  box-sizing: border-box;
}

.jp-PlancktonPanel-header {
  background: var(--jp-layout-color1);
  border-bottom: 1px solid var(--jp-border-color1);
  padding: 12px 16px;
  flex-shrink: 0;
  width: 100%;
  box-sizing: border-box;
}

.jp-PlancktonPanel-header-title {
  display: flex;
  align-items: center;
  font-weight: 600;
  font-size: 14px;
  color: var(--jp-ui-font-color1);
}

.jp-PlancktonPanel-header-icon {
  margin-right: 8px;
  font-size: 16px;
}

.jp-PlancktonPanel-messages {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
  box-sizing: border-box;
}

.jp-PlancktonPanel-msg {
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
}

.jp-PlancktonPanel-msg-user {
  align-self: flex-end;
  align-items: flex-end;
}

.jp-PlancktonPanel-msg-planckton {
  align-self: flex-start;
  align-items: flex-start;
}

.jp-PlancktonPanel-msg-header {
  margin-bottom: 4px;
}

.jp-PlancktonPanel-msg-sender {
  font-size: 12px;
  font-weight: 500;
  color: var(--jp-ui-font-color2);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* User message bubble - Rectangular with rounded edges */
.jp-PlancktonPanel-msg-user .jp-PlancktonPanel-msg-content {
  background: #ff0000;
  color: white;
  border-radius: 12px;
  padding: 16px 20px;
  font-size: 16px;
  line-height: 1.6;
  width: fit-content;
  max-width: 85%;
  align-self: flex-end;
  box-shadow: 0 1px 3px rgba(0,0,0,0.10);
  box-sizing: border-box;
  white-space: pre-wrap;
  word-break: break-word;
}

/* AI message - Rectangular with rounded edges */
.jp-PlancktonPanel-msg-planckton .jp-PlancktonPanel-msg-content {
  background: #0000ff;
  color: white;
  border-radius: 12px;
  padding: 16px 20px;
  font-size: 16px;
  line-height: 1.6;
  width: 100%;
  max-width: 85%;
  align-self: flex-start;
  box-shadow: 0 1px 3px rgba(0,0,0,0.10);
  box-sizing: border-box;
  white-space: pre-wrap;
  word-break: break-word;
}

/* Code blocks in boxes - ChatGPT style */
.jp-PlancktonPanel-code-block {
  position: relative;
  margin: 12px 0;
  border-radius: 8px;
  overflow: hidden;
  background: #f7f7f8;
  border: 1px solid #e5e5e7;
  width: 100%;
  max-width: 100%;
  word-break: break-word;
  overflow-x: auto;
  box-sizing: border-box;
  padding: 0;
}

.jp-PlancktonPanel-code-block-header {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  background: #f7f7f8;
  padding: 8px 12px;
  border-bottom: 1px solid #e5e5e7;
}

.jp-PlancktonPanel-code-language {
  position: absolute;
  left: 12px;
  font-size: 12px;
  color: #6e6e80;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.jp-PlancktonPanel-copy-btn {
  background: none;
  border: none;
  color: #6e6e80;
  cursor: pointer;
  font-size: 14px;
  padding: 2px 6px;
  border-radius: 4px;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 4px;
}

.jp-PlancktonPanel-copy-btn:hover {
  background: #e5e5e7;
  color: #343541;
}

.jp-PlancktonPanel-code {
  margin: 0;
  padding: 16px;
  background: #ffffff;
  color: #343541;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 14px;
  line-height: 1.5;
  white-space: pre-wrap;
  word-break: break-all;
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
  overflow-x: auto;
}

.jp-PlancktonPanel-code code {
  background: none;
  padding: 0;
  border: none;
  font-family: inherit;
  font-size: inherit;
  white-space: pre-wrap;
  word-break: break-all;
}

.jp-PlancktonPanel-thinking {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--jp-ui-font-color2);
  font-style: italic;
  background: #f7f7f8;
  border-radius: 12px;
  padding: 16px 20px;
  font-size: 16px;
  line-height: 1.6;
  width: 100%;
  max-width: 85%;
  align-self: flex-start;
  box-shadow: 0 1px 3px rgba(0,0,0,0.10);
  box-sizing: border-box;
}

.jp-PlancktonPanel-thinking-dots {
  display: flex;
  gap: 2px;
}

.jp-PlancktonPanel-thinking-dots span {
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: var(--jp-ui-font-color2);
  animation: thinking 1.4s infinite ease-in-out;
}

.jp-PlancktonPanel-thinking-dots span:nth-child(1) {
  animation-delay: -0.32s;
}

.jp-PlancktonPanel-thinking-dots span:nth-child(2) {
  animation-delay: -0.16s;
}

@keyframes thinking {
  0%, 80%, 100% {
    transform: scale(0.8);
    opacity: 0.5;
  }
  40% {
    transform: scale(1);
    opacity: 1;
  }
}

.jp-PlancktonPanel-input {
  display: flex;
  gap: 8px;
  padding: 16px;
  background: var(--jp-layout-color1);
  border-top: 1px solid var(--jp-border-color1);
  flex-shrink: 0;
  width: 100%;
  box-sizing: border-box;
  align-items: flex-end;
}

.jp-PlancktonPanel-textarea {
  flex: 1;
  padding: 10px 12px;
  border: 1px solid var(--jp-border-color2);
  border-radius: 8px;
  font-size: 14px;
  background: var(--jp-layout-color0);
  color: var(--jp-ui-font-color1);
  outline: none;
  transition: border-color 0.2s ease, height 0.2s ease;
  resize: none;
  height: 40px;
  min-height: 40px;
  max-height: 200px;
  overflow-y: auto;
  font-family: inherit;
  line-height: 1.4;
  box-sizing: border-box;
}

.jp-PlancktonPanel-textarea:focus {
  border-color: var(--jp-brand-color1);
  box-shadow: 0 0 0 2px rgba(var(--jp-brand-color1-rgb), 0.2);
}

.jp-PlancktonPanel-textarea:disabled {
  background: var(--jp-layout-color2);
  color: var(--jp-ui-font-color2);
  cursor: not-allowed;
}

/* Keep the old input styles for backward compatibility */
.jp-PlancktonPanel-input input {
  flex: 1;
  padding: 10px 12px;
  border: 1px solid var(--jp-border-color2);
  border-radius: 8px;
  font-size: 14px;
  background: var(--jp-layout-color0);
  color: var(--jp-ui-font-color1);
  outline: none;
  transition: border-color 0.2s ease;
}

.jp-PlancktonPanel-input input:focus {
  border-color: var(--jp-brand-color1);
  box-shadow: 0 0 0 2px rgba(var(--jp-brand-color1-rgb), 0.2);
}

.jp-PlancktonPanel-input input:disabled {
  background: var(--jp-layout-color2);
  color: var(--jp-ui-font-color2);
  cursor: not-allowed;
}

.jp-PlancktonPanel-send-btn {
  padding: 10px 16px;
  background: var(--jp-brand-color1);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s ease;
  white-space: nowrap;
}

.jp-PlancktonPanel-send-btn:hover:not(:disabled) {
  background: var(--jp-brand-color0);
}

.jp-PlancktonPanel-send-btn:disabled {
  background: var(--jp-layout-color3);
  color: var(--jp-ui-font-color2);
  cursor: not-allowed;
}

/* Scrollbar styling */
.jp-PlancktonPanel-messages::-webkit-scrollbar {
  width: 6px;
}

.jp-PlancktonPanel-messages::-webkit-scrollbar-track {
  background: transparent;
}

.jp-PlancktonPanel-messages::-webkit-scrollbar-thumb {
  background: var(--jp-border-color2);
  border-radius: 3px;
}

.jp-PlancktonPanel-messages::-webkit-scrollbar-thumb:hover {
  background: var(--jp-border-color1);
}
`, "",{"version":3,"sources":["webpack://./../notebook-extension/style/index.css"],"names":[],"mappings":"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","sourcesContent":["@import url('./base.css');\n\n/* Planckton Chat Panel Styles */\n.jp-PlancktonPanel {\n  display: flex;\n  flex-direction: column;\n  height: 100%;\n  background: var(--jp-layout-color0);\n  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;\n  width: 100%;\n  box-sizing: border-box;\n}\n\n.jp-PlancktonPanel-header {\n  background: var(--jp-layout-color1);\n  border-bottom: 1px solid var(--jp-border-color1);\n  padding: 12px 16px;\n  flex-shrink: 0;\n  width: 100%;\n  box-sizing: border-box;\n}\n\n.jp-PlancktonPanel-header-title {\n  display: flex;\n  align-items: center;\n  font-weight: 600;\n  font-size: 14px;\n  color: var(--jp-ui-font-color1);\n}\n\n.jp-PlancktonPanel-header-icon {\n  margin-right: 8px;\n  font-size: 16px;\n}\n\n.jp-PlancktonPanel-messages {\n  flex: 1;\n  overflow-y: auto;\n  padding: 16px;\n  display: flex;\n  flex-direction: column;\n  gap: 16px;\n  width: 100%;\n  box-sizing: border-box;\n}\n\n.jp-PlancktonPanel-msg {\n  display: flex;\n  flex-direction: column;\n  width: 100%;\n  max-width: 100%;\n  box-sizing: border-box;\n}\n\n.jp-PlancktonPanel-msg-user {\n  align-self: flex-end;\n  align-items: flex-end;\n}\n\n.jp-PlancktonPanel-msg-planckton {\n  align-self: flex-start;\n  align-items: flex-start;\n}\n\n.jp-PlancktonPanel-msg-header {\n  margin-bottom: 4px;\n}\n\n.jp-PlancktonPanel-msg-sender {\n  font-size: 12px;\n  font-weight: 500;\n  color: var(--jp-ui-font-color2);\n  text-transform: uppercase;\n  letter-spacing: 0.5px;\n}\n\n/* User message bubble - Rectangular with rounded edges */\n.jp-PlancktonPanel-msg-user .jp-PlancktonPanel-msg-content {\n  background: #ff0000;\n  color: white;\n  border-radius: 12px;\n  padding: 16px 20px;\n  font-size: 16px;\n  line-height: 1.6;\n  width: fit-content;\n  max-width: 85%;\n  align-self: flex-end;\n  box-shadow: 0 1px 3px rgba(0,0,0,0.10);\n  box-sizing: border-box;\n  white-space: pre-wrap;\n  word-break: break-word;\n}\n\n/* AI message - Rectangular with rounded edges */\n.jp-PlancktonPanel-msg-planckton .jp-PlancktonPanel-msg-content {\n  background: #0000ff;\n  color: white;\n  border-radius: 12px;\n  padding: 16px 20px;\n  font-size: 16px;\n  line-height: 1.6;\n  width: 100%;\n  max-width: 85%;\n  align-self: flex-start;\n  box-shadow: 0 1px 3px rgba(0,0,0,0.10);\n  box-sizing: border-box;\n  white-space: pre-wrap;\n  word-break: break-word;\n}\n\n/* Code blocks in boxes - ChatGPT style */\n.jp-PlancktonPanel-code-block {\n  position: relative;\n  margin: 12px 0;\n  border-radius: 8px;\n  overflow: hidden;\n  background: #f7f7f8;\n  border: 1px solid #e5e5e7;\n  width: 100%;\n  max-width: 100%;\n  word-break: break-word;\n  overflow-x: auto;\n  box-sizing: border-box;\n  padding: 0;\n}\n\n.jp-PlancktonPanel-code-block-header {\n  display: flex;\n  align-items: center;\n  justify-content: flex-end;\n  background: #f7f7f8;\n  padding: 8px 12px;\n  border-bottom: 1px solid #e5e5e7;\n}\n\n.jp-PlancktonPanel-code-language {\n  position: absolute;\n  left: 12px;\n  font-size: 12px;\n  color: #6e6e80;\n  text-transform: uppercase;\n  letter-spacing: 0.5px;\n}\n\n.jp-PlancktonPanel-copy-btn {\n  background: none;\n  border: none;\n  color: #6e6e80;\n  cursor: pointer;\n  font-size: 14px;\n  padding: 2px 6px;\n  border-radius: 4px;\n  transition: all 0.2s;\n  display: flex;\n  align-items: center;\n  gap: 4px;\n}\n\n.jp-PlancktonPanel-copy-btn:hover {\n  background: #e5e5e7;\n  color: #343541;\n}\n\n.jp-PlancktonPanel-code {\n  margin: 0;\n  padding: 16px;\n  background: #ffffff;\n  color: #343541;\n  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;\n  font-size: 14px;\n  line-height: 1.5;\n  white-space: pre-wrap;\n  word-break: break-all;\n  width: 100%;\n  max-width: 100%;\n  box-sizing: border-box;\n  overflow-x: auto;\n}\n\n.jp-PlancktonPanel-code code {\n  background: none;\n  padding: 0;\n  border: none;\n  font-family: inherit;\n  font-size: inherit;\n  white-space: pre-wrap;\n  word-break: break-all;\n}\n\n.jp-PlancktonPanel-thinking {\n  display: flex;\n  align-items: center;\n  gap: 8px;\n  color: var(--jp-ui-font-color2);\n  font-style: italic;\n  background: #f7f7f8;\n  border-radius: 12px;\n  padding: 16px 20px;\n  font-size: 16px;\n  line-height: 1.6;\n  width: 100%;\n  max-width: 85%;\n  align-self: flex-start;\n  box-shadow: 0 1px 3px rgba(0,0,0,0.10);\n  box-sizing: border-box;\n}\n\n.jp-PlancktonPanel-thinking-dots {\n  display: flex;\n  gap: 2px;\n}\n\n.jp-PlancktonPanel-thinking-dots span {\n  width: 4px;\n  height: 4px;\n  border-radius: 50%;\n  background: var(--jp-ui-font-color2);\n  animation: thinking 1.4s infinite ease-in-out;\n}\n\n.jp-PlancktonPanel-thinking-dots span:nth-child(1) {\n  animation-delay: -0.32s;\n}\n\n.jp-PlancktonPanel-thinking-dots span:nth-child(2) {\n  animation-delay: -0.16s;\n}\n\n@keyframes thinking {\n  0%, 80%, 100% {\n    transform: scale(0.8);\n    opacity: 0.5;\n  }\n  40% {\n    transform: scale(1);\n    opacity: 1;\n  }\n}\n\n.jp-PlancktonPanel-input {\n  display: flex;\n  gap: 8px;\n  padding: 16px;\n  background: var(--jp-layout-color1);\n  border-top: 1px solid var(--jp-border-color1);\n  flex-shrink: 0;\n  width: 100%;\n  box-sizing: border-box;\n  align-items: flex-end;\n}\n\n.jp-PlancktonPanel-textarea {\n  flex: 1;\n  padding: 10px 12px;\n  border: 1px solid var(--jp-border-color2);\n  border-radius: 8px;\n  font-size: 14px;\n  background: var(--jp-layout-color0);\n  color: var(--jp-ui-font-color1);\n  outline: none;\n  transition: border-color 0.2s ease, height 0.2s ease;\n  resize: none;\n  height: 40px;\n  min-height: 40px;\n  max-height: 200px;\n  overflow-y: auto;\n  font-family: inherit;\n  line-height: 1.4;\n  box-sizing: border-box;\n}\n\n.jp-PlancktonPanel-textarea:focus {\n  border-color: var(--jp-brand-color1);\n  box-shadow: 0 0 0 2px rgba(var(--jp-brand-color1-rgb), 0.2);\n}\n\n.jp-PlancktonPanel-textarea:disabled {\n  background: var(--jp-layout-color2);\n  color: var(--jp-ui-font-color2);\n  cursor: not-allowed;\n}\n\n/* Keep the old input styles for backward compatibility */\n.jp-PlancktonPanel-input input {\n  flex: 1;\n  padding: 10px 12px;\n  border: 1px solid var(--jp-border-color2);\n  border-radius: 8px;\n  font-size: 14px;\n  background: var(--jp-layout-color0);\n  color: var(--jp-ui-font-color1);\n  outline: none;\n  transition: border-color 0.2s ease;\n}\n\n.jp-PlancktonPanel-input input:focus {\n  border-color: var(--jp-brand-color1);\n  box-shadow: 0 0 0 2px rgba(var(--jp-brand-color1-rgb), 0.2);\n}\n\n.jp-PlancktonPanel-input input:disabled {\n  background: var(--jp-layout-color2);\n  color: var(--jp-ui-font-color2);\n  cursor: not-allowed;\n}\n\n.jp-PlancktonPanel-send-btn {\n  padding: 10px 16px;\n  background: var(--jp-brand-color1);\n  color: white;\n  border: none;\n  border-radius: 8px;\n  font-size: 14px;\n  font-weight: 500;\n  cursor: pointer;\n  transition: background-color 0.2s ease;\n  white-space: nowrap;\n}\n\n.jp-PlancktonPanel-send-btn:hover:not(:disabled) {\n  background: var(--jp-brand-color0);\n}\n\n.jp-PlancktonPanel-send-btn:disabled {\n  background: var(--jp-layout-color3);\n  color: var(--jp-ui-font-color2);\n  cursor: not-allowed;\n}\n\n/* Scrollbar styling */\n.jp-PlancktonPanel-messages::-webkit-scrollbar {\n  width: 6px;\n}\n\n.jp-PlancktonPanel-messages::-webkit-scrollbar-track {\n  background: transparent;\n}\n\n.jp-PlancktonPanel-messages::-webkit-scrollbar-thumb {\n  background: var(--jp-border-color2);\n  border-radius: 3px;\n}\n\n.jp-PlancktonPanel-messages::-webkit-scrollbar-thumb:hover {\n  background: var(--jp-border-color1);\n}\n"],"sourceRoot":""}]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "../../node_modules/@jupyterlab/builder/node_modules/css-loader/dist/cjs.js!../notebook-extension/style/variables.css":
/*!****************************************************************************************************************************!*\
  !*** ../../node_modules/@jupyterlab/builder/node_modules/css-loader/dist/cjs.js!../notebook-extension/style/variables.css ***!
  \****************************************************************************************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_jupyterlab_builder_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../node_modules/@jupyterlab/builder/node_modules/css-loader/dist/runtime/sourceMaps.js */ "../../node_modules/@jupyterlab/builder/node_modules/css-loader/dist/runtime/sourceMaps.js");
/* harmony import */ var _node_modules_jupyterlab_builder_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_jupyterlab_builder_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_jupyterlab_builder_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../node_modules/@jupyterlab/builder/node_modules/css-loader/dist/runtime/api.js */ "../../node_modules/@jupyterlab/builder/node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_jupyterlab_builder_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_jupyterlab_builder_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_jupyterlab_builder_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_jupyterlab_builder_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, `:root {
  --jp-notebook-toolbar-margin-bottom: 20px;
  --jp-notebook-padding-offset: 20px;

  --jp-kernel-status-padding: 5px;
}
`, "",{"version":3,"sources":["webpack://./../notebook-extension/style/variables.css"],"names":[],"mappings":"AAAA;EACE,yCAAyC;EACzC,kCAAkC;;EAElC,+BAA+B;AACjC","sourcesContent":[":root {\n  --jp-notebook-toolbar-margin-bottom: 20px;\n  --jp-notebook-padding-offset: 20px;\n\n  --jp-kernel-status-padding: 5px;\n}\n"],"sourceRoot":""}]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "../../node_modules/@jupyterlab/builder/node_modules/css-loader/dist/runtime/api.js":
/*!******************************************************************************************!*\
  !*** ../../node_modules/@jupyterlab/builder/node_modules/css-loader/dist/runtime/api.js ***!
  \******************************************************************************************/
/***/ ((module) => {



/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Tobias Koppers @sokra
*/
module.exports = function (cssWithMappingToString) {
  var list = [];

  // return the list of modules as css string
  list.toString = function toString() {
    return this.map(function (item) {
      var content = "";
      var needLayer = typeof item[5] !== "undefined";
      if (item[4]) {
        content += "@supports (".concat(item[4], ") {");
      }
      if (item[2]) {
        content += "@media ".concat(item[2], " {");
      }
      if (needLayer) {
        content += "@layer".concat(item[5].length > 0 ? " ".concat(item[5]) : "", " {");
      }
      content += cssWithMappingToString(item);
      if (needLayer) {
        content += "}";
      }
      if (item[2]) {
        content += "}";
      }
      if (item[4]) {
        content += "}";
      }
      return content;
    }).join("");
  };

  // import a list of modules into the list
  list.i = function i(modules, media, dedupe, supports, layer) {
    if (typeof modules === "string") {
      modules = [[null, modules, undefined]];
    }
    var alreadyImportedModules = {};
    if (dedupe) {
      for (var k = 0; k < this.length; k++) {
        var id = this[k][0];
        if (id != null) {
          alreadyImportedModules[id] = true;
        }
      }
    }
    for (var _k = 0; _k < modules.length; _k++) {
      var item = [].concat(modules[_k]);
      if (dedupe && alreadyImportedModules[item[0]]) {
        continue;
      }
      if (typeof layer !== "undefined") {
        if (typeof item[5] === "undefined") {
          item[5] = layer;
        } else {
          item[1] = "@layer".concat(item[5].length > 0 ? " ".concat(item[5]) : "", " {").concat(item[1], "}");
          item[5] = layer;
        }
      }
      if (media) {
        if (!item[2]) {
          item[2] = media;
        } else {
          item[1] = "@media ".concat(item[2], " {").concat(item[1], "}");
          item[2] = media;
        }
      }
      if (supports) {
        if (!item[4]) {
          item[4] = "".concat(supports);
        } else {
          item[1] = "@supports (".concat(item[4], ") {").concat(item[1], "}");
          item[4] = supports;
        }
      }
      list.push(item);
    }
  };
  return list;
};

/***/ }),

/***/ "../../node_modules/@jupyterlab/builder/node_modules/css-loader/dist/runtime/sourceMaps.js":
/*!*************************************************************************************************!*\
  !*** ../../node_modules/@jupyterlab/builder/node_modules/css-loader/dist/runtime/sourceMaps.js ***!
  \*************************************************************************************************/
/***/ ((module) => {



module.exports = function (item) {
  var content = item[1];
  var cssMapping = item[3];
  if (!cssMapping) {
    return content;
  }
  if (typeof btoa === "function") {
    var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(cssMapping))));
    var data = "sourceMappingURL=data:application/json;charset=utf-8;base64,".concat(base64);
    var sourceMapping = "/*# ".concat(data, " */");
    return [content].concat([sourceMapping]).join("\n");
  }
  return [content].join("\n");
};

/***/ }),

/***/ "../../node_modules/@jupyterlab/builder/node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js":
/*!*****************************************************************************************************************!*\
  !*** ../../node_modules/@jupyterlab/builder/node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js ***!
  \*****************************************************************************************************************/
/***/ ((module) => {



var stylesInDOM = [];
function getIndexByIdentifier(identifier) {
  var result = -1;
  for (var i = 0; i < stylesInDOM.length; i++) {
    if (stylesInDOM[i].identifier === identifier) {
      result = i;
      break;
    }
  }
  return result;
}
function modulesToDom(list, options) {
  var idCountMap = {};
  var identifiers = [];
  for (var i = 0; i < list.length; i++) {
    var item = list[i];
    var id = options.base ? item[0] + options.base : item[0];
    var count = idCountMap[id] || 0;
    var identifier = "".concat(id, " ").concat(count);
    idCountMap[id] = count + 1;
    var indexByIdentifier = getIndexByIdentifier(identifier);
    var obj = {
      css: item[1],
      media: item[2],
      sourceMap: item[3],
      supports: item[4],
      layer: item[5]
    };
    if (indexByIdentifier !== -1) {
      stylesInDOM[indexByIdentifier].references++;
      stylesInDOM[indexByIdentifier].updater(obj);
    } else {
      var updater = addElementStyle(obj, options);
      options.byIndex = i;
      stylesInDOM.splice(i, 0, {
        identifier: identifier,
        updater: updater,
        references: 1
      });
    }
    identifiers.push(identifier);
  }
  return identifiers;
}
function addElementStyle(obj, options) {
  var api = options.domAPI(options);
  api.update(obj);
  var updater = function updater(newObj) {
    if (newObj) {
      if (newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap && newObj.supports === obj.supports && newObj.layer === obj.layer) {
        return;
      }
      api.update(obj = newObj);
    } else {
      api.remove();
    }
  };
  return updater;
}
module.exports = function (list, options) {
  options = options || {};
  list = list || [];
  var lastIdentifiers = modulesToDom(list, options);
  return function update(newList) {
    newList = newList || [];
    for (var i = 0; i < lastIdentifiers.length; i++) {
      var identifier = lastIdentifiers[i];
      var index = getIndexByIdentifier(identifier);
      stylesInDOM[index].references--;
    }
    var newLastIdentifiers = modulesToDom(newList, options);
    for (var _i = 0; _i < lastIdentifiers.length; _i++) {
      var _identifier = lastIdentifiers[_i];
      var _index = getIndexByIdentifier(_identifier);
      if (stylesInDOM[_index].references === 0) {
        stylesInDOM[_index].updater();
        stylesInDOM.splice(_index, 1);
      }
    }
    lastIdentifiers = newLastIdentifiers;
  };
};

/***/ }),

/***/ "../../node_modules/@jupyterlab/builder/node_modules/style-loader/dist/runtime/insertBySelector.js":
/*!*********************************************************************************************************!*\
  !*** ../../node_modules/@jupyterlab/builder/node_modules/style-loader/dist/runtime/insertBySelector.js ***!
  \*********************************************************************************************************/
/***/ ((module) => {



var memo = {};

/* istanbul ignore next  */
function getTarget(target) {
  if (typeof memo[target] === "undefined") {
    var styleTarget = document.querySelector(target);

    // Special case to return head of iframe instead of iframe itself
    if (window.HTMLIFrameElement && styleTarget instanceof window.HTMLIFrameElement) {
      try {
        // This will throw an exception if access to iframe is blocked
        // due to cross-origin restrictions
        styleTarget = styleTarget.contentDocument.head;
      } catch (e) {
        // istanbul ignore next
        styleTarget = null;
      }
    }
    memo[target] = styleTarget;
  }
  return memo[target];
}

/* istanbul ignore next  */
function insertBySelector(insert, style) {
  var target = getTarget(insert);
  if (!target) {
    throw new Error("Couldn't find a style target. This probably means that the value for the 'insert' parameter is invalid.");
  }
  target.appendChild(style);
}
module.exports = insertBySelector;

/***/ }),

/***/ "../../node_modules/@jupyterlab/builder/node_modules/style-loader/dist/runtime/insertStyleElement.js":
/*!***********************************************************************************************************!*\
  !*** ../../node_modules/@jupyterlab/builder/node_modules/style-loader/dist/runtime/insertStyleElement.js ***!
  \***********************************************************************************************************/
/***/ ((module) => {



/* istanbul ignore next  */
function insertStyleElement(options) {
  var element = document.createElement("style");
  options.setAttributes(element, options.attributes);
  options.insert(element, options.options);
  return element;
}
module.exports = insertStyleElement;

/***/ }),

/***/ "../../node_modules/@jupyterlab/builder/node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js":
/*!***********************************************************************************************************************!*\
  !*** ../../node_modules/@jupyterlab/builder/node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js ***!
  \***********************************************************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {



/* istanbul ignore next  */
function setAttributesWithoutAttributes(styleElement) {
  var nonce =  true ? __webpack_require__.nc : 0;
  if (nonce) {
    styleElement.setAttribute("nonce", nonce);
  }
}
module.exports = setAttributesWithoutAttributes;

/***/ }),

/***/ "../../node_modules/@jupyterlab/builder/node_modules/style-loader/dist/runtime/styleDomAPI.js":
/*!****************************************************************************************************!*\
  !*** ../../node_modules/@jupyterlab/builder/node_modules/style-loader/dist/runtime/styleDomAPI.js ***!
  \****************************************************************************************************/
/***/ ((module) => {



/* istanbul ignore next  */
function apply(styleElement, options, obj) {
  var css = "";
  if (obj.supports) {
    css += "@supports (".concat(obj.supports, ") {");
  }
  if (obj.media) {
    css += "@media ".concat(obj.media, " {");
  }
  var needLayer = typeof obj.layer !== "undefined";
  if (needLayer) {
    css += "@layer".concat(obj.layer.length > 0 ? " ".concat(obj.layer) : "", " {");
  }
  css += obj.css;
  if (needLayer) {
    css += "}";
  }
  if (obj.media) {
    css += "}";
  }
  if (obj.supports) {
    css += "}";
  }
  var sourceMap = obj.sourceMap;
  if (sourceMap && typeof btoa !== "undefined") {
    css += "\n/*# sourceMappingURL=data:application/json;base64,".concat(btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))), " */");
  }

  // For old IE
  /* istanbul ignore if  */
  options.styleTagTransform(css, styleElement, options.options);
}
function removeStyleElement(styleElement) {
  // istanbul ignore if
  if (styleElement.parentNode === null) {
    return false;
  }
  styleElement.parentNode.removeChild(styleElement);
}

/* istanbul ignore next  */
function domAPI(options) {
  if (typeof document === "undefined") {
    return {
      update: function update() {},
      remove: function remove() {}
    };
  }
  var styleElement = options.insertStyleElement(options);
  return {
    update: function update(obj) {
      apply(styleElement, options, obj);
    },
    remove: function remove() {
      removeStyleElement(styleElement);
    }
  };
}
module.exports = domAPI;

/***/ }),

/***/ "../../node_modules/@jupyterlab/builder/node_modules/style-loader/dist/runtime/styleTagTransform.js":
/*!**********************************************************************************************************!*\
  !*** ../../node_modules/@jupyterlab/builder/node_modules/style-loader/dist/runtime/styleTagTransform.js ***!
  \**********************************************************************************************************/
/***/ ((module) => {



/* istanbul ignore next  */
function styleTagTransform(css, styleElement) {
  if (styleElement.styleSheet) {
    styleElement.styleSheet.cssText = css;
  } else {
    while (styleElement.firstChild) {
      styleElement.removeChild(styleElement.firstChild);
    }
    styleElement.appendChild(document.createTextNode(css));
  }
}
module.exports = styleTagTransform;

/***/ }),

/***/ "../notebook-extension/style/base.css":
/*!********************************************!*\
  !*** ../notebook-extension/style/base.css ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_jupyterlab_builder_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !../../../node_modules/@jupyterlab/builder/node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "../../node_modules/@jupyterlab/builder/node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_jupyterlab_builder_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_jupyterlab_builder_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_jupyterlab_builder_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !../../../node_modules/@jupyterlab/builder/node_modules/style-loader/dist/runtime/styleDomAPI.js */ "../../node_modules/@jupyterlab/builder/node_modules/style-loader/dist/runtime/styleDomAPI.js");
/* harmony import */ var _node_modules_jupyterlab_builder_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_jupyterlab_builder_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _node_modules_jupyterlab_builder_node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! !../../../node_modules/@jupyterlab/builder/node_modules/style-loader/dist/runtime/insertBySelector.js */ "../../node_modules/@jupyterlab/builder/node_modules/style-loader/dist/runtime/insertBySelector.js");
/* harmony import */ var _node_modules_jupyterlab_builder_node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_node_modules_jupyterlab_builder_node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _node_modules_jupyterlab_builder_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! !../../../node_modules/@jupyterlab/builder/node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js */ "../../node_modules/@jupyterlab/builder/node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js");
/* harmony import */ var _node_modules_jupyterlab_builder_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_node_modules_jupyterlab_builder_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _node_modules_jupyterlab_builder_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! !../../../node_modules/@jupyterlab/builder/node_modules/style-loader/dist/runtime/insertStyleElement.js */ "../../node_modules/@jupyterlab/builder/node_modules/style-loader/dist/runtime/insertStyleElement.js");
/* harmony import */ var _node_modules_jupyterlab_builder_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_node_modules_jupyterlab_builder_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _node_modules_jupyterlab_builder_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! !../../../node_modules/@jupyterlab/builder/node_modules/style-loader/dist/runtime/styleTagTransform.js */ "../../node_modules/@jupyterlab/builder/node_modules/style-loader/dist/runtime/styleTagTransform.js");
/* harmony import */ var _node_modules_jupyterlab_builder_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_node_modules_jupyterlab_builder_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _node_modules_jupyterlab_builder_node_modules_css_loader_dist_cjs_js_base_css__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! !!../../../node_modules/@jupyterlab/builder/node_modules/css-loader/dist/cjs.js!./base.css */ "../../node_modules/@jupyterlab/builder/node_modules/css-loader/dist/cjs.js!../notebook-extension/style/base.css");

      
      
      
      
      
      
      
      
      

var options = {};

options.styleTagTransform = (_node_modules_jupyterlab_builder_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default());
options.setAttributes = (_node_modules_jupyterlab_builder_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default());

      options.insert = _node_modules_jupyterlab_builder_node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default().bind(null, "head");
    
options.domAPI = (_node_modules_jupyterlab_builder_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default());
options.insertStyleElement = (_node_modules_jupyterlab_builder_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default());

var update = _node_modules_jupyterlab_builder_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_jupyterlab_builder_node_modules_css_loader_dist_cjs_js_base_css__WEBPACK_IMPORTED_MODULE_6__["default"], options);




       /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_jupyterlab_builder_node_modules_css_loader_dist_cjs_js_base_css__WEBPACK_IMPORTED_MODULE_6__["default"] && _node_modules_jupyterlab_builder_node_modules_css_loader_dist_cjs_js_base_css__WEBPACK_IMPORTED_MODULE_6__["default"].locals ? _node_modules_jupyterlab_builder_node_modules_css_loader_dist_cjs_js_base_css__WEBPACK_IMPORTED_MODULE_6__["default"].locals : undefined);


/***/ }),

/***/ "../notebook-extension/style/index.css":
/*!*********************************************!*\
  !*** ../notebook-extension/style/index.css ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_jupyterlab_builder_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !../../../node_modules/@jupyterlab/builder/node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "../../node_modules/@jupyterlab/builder/node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_jupyterlab_builder_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_jupyterlab_builder_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_jupyterlab_builder_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !../../../node_modules/@jupyterlab/builder/node_modules/style-loader/dist/runtime/styleDomAPI.js */ "../../node_modules/@jupyterlab/builder/node_modules/style-loader/dist/runtime/styleDomAPI.js");
/* harmony import */ var _node_modules_jupyterlab_builder_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_jupyterlab_builder_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _node_modules_jupyterlab_builder_node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! !../../../node_modules/@jupyterlab/builder/node_modules/style-loader/dist/runtime/insertBySelector.js */ "../../node_modules/@jupyterlab/builder/node_modules/style-loader/dist/runtime/insertBySelector.js");
/* harmony import */ var _node_modules_jupyterlab_builder_node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_node_modules_jupyterlab_builder_node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _node_modules_jupyterlab_builder_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! !../../../node_modules/@jupyterlab/builder/node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js */ "../../node_modules/@jupyterlab/builder/node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js");
/* harmony import */ var _node_modules_jupyterlab_builder_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_node_modules_jupyterlab_builder_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _node_modules_jupyterlab_builder_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! !../../../node_modules/@jupyterlab/builder/node_modules/style-loader/dist/runtime/insertStyleElement.js */ "../../node_modules/@jupyterlab/builder/node_modules/style-loader/dist/runtime/insertStyleElement.js");
/* harmony import */ var _node_modules_jupyterlab_builder_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_node_modules_jupyterlab_builder_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _node_modules_jupyterlab_builder_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! !../../../node_modules/@jupyterlab/builder/node_modules/style-loader/dist/runtime/styleTagTransform.js */ "../../node_modules/@jupyterlab/builder/node_modules/style-loader/dist/runtime/styleTagTransform.js");
/* harmony import */ var _node_modules_jupyterlab_builder_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_node_modules_jupyterlab_builder_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _node_modules_jupyterlab_builder_node_modules_css_loader_dist_cjs_js_index_css__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! !!../../../node_modules/@jupyterlab/builder/node_modules/css-loader/dist/cjs.js!./index.css */ "../../node_modules/@jupyterlab/builder/node_modules/css-loader/dist/cjs.js!../notebook-extension/style/index.css");

      
      
      
      
      
      
      
      
      

var options = {};

options.styleTagTransform = (_node_modules_jupyterlab_builder_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default());
options.setAttributes = (_node_modules_jupyterlab_builder_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default());

      options.insert = _node_modules_jupyterlab_builder_node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default().bind(null, "head");
    
options.domAPI = (_node_modules_jupyterlab_builder_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default());
options.insertStyleElement = (_node_modules_jupyterlab_builder_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default());

var update = _node_modules_jupyterlab_builder_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_jupyterlab_builder_node_modules_css_loader_dist_cjs_js_index_css__WEBPACK_IMPORTED_MODULE_6__["default"], options);




       /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_jupyterlab_builder_node_modules_css_loader_dist_cjs_js_index_css__WEBPACK_IMPORTED_MODULE_6__["default"] && _node_modules_jupyterlab_builder_node_modules_css_loader_dist_cjs_js_index_css__WEBPACK_IMPORTED_MODULE_6__["default"].locals ? _node_modules_jupyterlab_builder_node_modules_css_loader_dist_cjs_js_index_css__WEBPACK_IMPORTED_MODULE_6__["default"].locals : undefined);


/***/ }),

/***/ "../notebook-extension/style/index.js":
/*!********************************************!*\
  !*** ../notebook-extension/style/index.js ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _base_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./base.css */ "../notebook-extension/style/base.css");
/* harmony import */ var _index_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./index.css */ "../notebook-extension/style/index.css");




/***/ }),

/***/ "./lib/index.js":
/*!**********************!*\
  !*** ./lib/index.js ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _jupyter_notebook_notebook_extension_style_index_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @jupyter-notebook/notebook-extension/style/index.js */ "../notebook-extension/style/index.js");
/* harmony import */ var _jupyterlab_application__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @jupyterlab/application */ "webpack/sharing/consume/default/@jupyterlab/application");
/* harmony import */ var _jupyterlab_application__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_jupyterlab_application__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _jupyterlab_apputils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @jupyterlab/apputils */ "webpack/sharing/consume/default/@jupyterlab/apputils");
/* harmony import */ var _jupyterlab_apputils__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_jupyterlab_apputils__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _jupyterlab_coreutils__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @jupyterlab/coreutils */ "webpack/sharing/consume/default/@jupyterlab/coreutils");
/* harmony import */ var _jupyterlab_coreutils__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_jupyterlab_coreutils__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _jupyterlab_notebook__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @jupyterlab/notebook */ "webpack/sharing/consume/default/@jupyterlab/notebook");
/* harmony import */ var _jupyterlab_notebook__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_jupyterlab_notebook__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _jupyterlab_translation__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @jupyterlab/translation */ "webpack/sharing/consume/default/@jupyterlab/translation");
/* harmony import */ var _jupyterlab_translation__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_jupyterlab_translation__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _lumino_widgets__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @lumino/widgets */ "webpack/sharing/consume/default/@lumino/widgets");
/* harmony import */ var _lumino_widgets__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(_lumino_widgets__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var _jupyter_notebook_application__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @jupyter-notebook/application */ "webpack/sharing/consume/default/@jupyter-notebook/application/@jupyter-notebook/application");
/* harmony import */ var _jupyter_notebook_application__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(_jupyter_notebook_application__WEBPACK_IMPORTED_MODULE_7__);
/* harmony import */ var _jupyterlab_ui_components__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @jupyterlab/ui-components */ "webpack/sharing/consume/default/@jupyterlab/ui-components");
/* harmony import */ var _jupyterlab_ui_components__WEBPACK_IMPORTED_MODULE_8___default = /*#__PURE__*/__webpack_require__.n(_jupyterlab_ui_components__WEBPACK_IMPORTED_MODULE_8__);
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
    requires: [_jupyterlab_translation__WEBPACK_IMPORTED_MODULE_5__.ITranslator],
    optional: [
        _jupyterlab_notebook__WEBPACK_IMPORTED_MODULE_4__.INotebookTracker,
        _jupyterlab_apputils__WEBPACK_IMPORTED_MODULE_2__.ICommandPalette,
        _jupyter_notebook_application__WEBPACK_IMPORTED_MODULE_7__.INotebookPathOpener,
        _jupyter_notebook_application__WEBPACK_IMPORTED_MODULE_7__.INotebookShell,
        _jupyterlab_application__WEBPACK_IMPORTED_MODULE_1__.ILabShell,
        _jupyterlab_apputils__WEBPACK_IMPORTED_MODULE_2__.IToolbarWidgetRegistry,
    ],
    activate: (app, translator, notebookTracker, palette, notebookPathOpener, notebookShell, labShell, toolbarRegistry) => {
        if (!notebookTracker) {
            // bail if trying to use this plugin without a notebook tracker
            return;
        }
        const { commands, shell } = app;
        const baseUrl = _jupyterlab_coreutils__WEBPACK_IMPORTED_MODULE_3__.PageConfig.getBaseUrl();
        const trans = translator.load('notebook');
        const nbClassicEnabled = _jupyterlab_coreutils__WEBPACK_IMPORTED_MODULE_3__.PageConfig.getOption('nbclassic_enabled') === 'true';
        const switcher = new _lumino_widgets__WEBPACK_IMPORTED_MODULE_6__.Menu({ commands });
        const switcherOptions = [];
        const opener = notebookPathOpener !== null && notebookPathOpener !== void 0 ? notebookPathOpener : _jupyter_notebook_application__WEBPACK_IMPORTED_MODULE_7__.defaultNotebookPathOpener;
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
                const toolbarButton = new _jupyterlab_ui_components__WEBPACK_IMPORTED_MODULE_8__.CommandToolbarButton({
                    commands,
                    id: switcherOptions[0].command,
                    label: switcherOptions[0].commandLabel,
                    icon: _jupyterlab_ui_components__WEBPACK_IMPORTED_MODULE_8__.launchIcon,
                });
                toolbarButton.addClass('jp-nb-interface-switcher-button');
                return toolbarButton;
            };
        }
        else {
            const overflowOptions = {
                overflowMenuOptions: { isVisible: false },
            };
            const menubar = new _lumino_widgets__WEBPACK_IMPORTED_MODULE_6__.MenuBar(overflowOptions);
            switcher.title.label = trans.__('Open in...');
            switcher.title.icon = _jupyterlab_ui_components__WEBPACK_IMPORTED_MODULE_8__.caretDownIcon;
            menubar.addMenu(switcher);
            toolbarFactory = (panel) => {
                const menubar = new _lumino_widgets__WEBPACK_IMPORTED_MODULE_6__.MenuBar(overflowOptions);
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
    requires: [_jupyterlab_translation__WEBPACK_IMPORTED_MODULE_5__.ITranslator],
    optional: [_jupyterlab_apputils__WEBPACK_IMPORTED_MODULE_2__.ICommandPalette],
    activate: (app, translator, palette) => {
        const { commands } = app;
        const trans = translator.load('notebook');
        const category = trans.__('Help');
        commands.addCommand(CommandIDs.launchNotebookTree, {
            label: trans.__('Launch Jupyter Notebook File Browser'),
            execute: () => {
                const url = _jupyterlab_coreutils__WEBPACK_IMPORTED_MODULE_3__.URLExt.join(_jupyterlab_coreutils__WEBPACK_IMPORTED_MODULE_3__.PageConfig.getBaseUrl(), 'tree');
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
//# sourceMappingURL=lib_index_js.8fc197af75a82640b6ab.js.map