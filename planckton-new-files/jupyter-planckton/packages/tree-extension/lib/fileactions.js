// Copyright (c) Jupyter Development Team.
// Distributed under the terms of the Modified BSD License.
import { CommandToolbarButtonComponent, ReactWidget, } from '@jupyterlab/apputils';
import React from 'react';
export class FilesActionButtons {
    /**
     * The constructor of FilesActionButtons.
     * @param options
     */
    constructor(options) {
        /**
         * Triggered when the selection change in file browser.
         */
        this._onSelectionChanged = () => {
            var _a, _b, _c, _d, _e, _f;
            const selectedItems = Array.from(this._browser.selectedItems());
            const selection = selectedItems.length > 0;
            const oneFolder = selectedItems.some((item) => item.type === 'directory');
            (_a = this._widgets.get('placeholder')) === null || _a === void 0 ? void 0 : _a.setHidden(selection);
            (_b = this._widgets.get('delete')) === null || _b === void 0 ? void 0 : _b.setHidden(!selection);
            (_c = this._widgets.get('duplicate')) === null || _c === void 0 ? void 0 : _c.setHidden(!selection || oneFolder);
            (_d = this._widgets.get('download')) === null || _d === void 0 ? void 0 : _d.setHidden(!selection || oneFolder);
            (_e = this._widgets.get('open')) === null || _e === void 0 ? void 0 : _e.setHidden(!selection || oneFolder);
            (_f = this._widgets.get('rename')) === null || _f === void 0 ? void 0 : _f.setHidden(selectedItems.length !== 1);
        };
        this._widgets = new Map();
        this._browser = options.browser;
        const { commands, selectionChanged, translator } = options;
        const trans = translator.load('notebook');
        // Placeholder, when no file is selected.
        const placeholder = ReactWidget.create(React.createElement("div", { key: 'placeholder' }, trans.__('Select items to perform actions on them.')));
        placeholder.id = 'fileAction-placeholder';
        this._widgets.set('placeholder', placeholder);
        // The action buttons.
        const actions = ['open', 'download', 'rename', 'duplicate', 'delete'];
        actions.forEach((action) => {
            const widget = ReactWidget.create(React.createElement(CommandToolbarButtonComponent, { key: action, commands: commands, id: `filebrowser:${action}`, args: { toolbar: true }, icon: undefined }));
            widget.id = `fileAction-${action}`;
            widget.addClass('jp-ToolbarButton');
            widget.addClass('jp-FileAction');
            this._widgets.set(action, widget);
        });
        selectionChanged.connect(this._onSelectionChanged, this);
        this._onSelectionChanged();
    }
    /**
     * Return an iterator with all the action widgets.
     */
    get widgets() {
        return this._widgets.values();
    }
}
