// Copyright (c) Jupyter Development Team.
// Distributed under the terms of the Modified BSD License.
import { closeIcon } from '@jupyterlab/ui-components';
import { ArrayExt, find } from '@lumino/algorithm';
import { MessageLoop } from '@lumino/messaging';
import { Signal } from '@lumino/signaling';
import { Panel, StackedPanel, Widget } from '@lumino/widgets';
/**
 * A class which manages a panel and sorts its widgets by rank.
 */
export class PanelHandler {
    constructor() {
        /**
         * A message hook for child remove messages on the panel handler.
         */
        this._panelChildHook = (handler, msg) => {
            switch (msg.type) {
                case 'child-removed':
                    {
                        const widget = msg.child;
                        ArrayExt.removeFirstWhere(this._items, (v) => v.widget === widget);
                    }
                    break;
                default:
                    break;
            }
            return true;
        };
        this._items = new Array();
        this._panel = new Panel();
        MessageLoop.installMessageHook(this._panel, this._panelChildHook);
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
        const index = ArrayExt.upperBound(this._items, item, Private.itemCmp);
        ArrayExt.insert(this._items, index, item);
        this._panel.insertWidget(index, widget);
    }
}
/**
 * A class which manages a side panel that can show at most one widget at a time.
 */
export class SidePanelHandler extends PanelHandler {
    /**
     * Construct a new side panel handler.
     */
    constructor(area) {
        super();
        this._isHiddenByUser = false;
        this._widgetAdded = new Signal(this);
        this._widgetRemoved = new Signal(this);
        this._area = area;
        this._panel.hide();
        this._currentWidget = null;
        this._lastCurrentWidget = null;
        this._widgetPanel = new StackedPanel();
        this._widgetPanel.widgetRemoved.connect(this._onWidgetRemoved, this);
        this._closeButton = document.createElement('button');
        closeIcon.element({
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
        const icon = new Widget({ node: this._closeButton });
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
        ArrayExt.insert(this._items, index, item);
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
        return ArrayExt.upperBound(this._items, item, Private.itemCmp);
    }
    /**
     * Find the index of the item with the given widget, or `-1`.
     */
    _findWidgetIndex(widget) {
        return ArrayExt.findFirstIndex(this._items, (i) => i.widget === widget);
    }
    /**
     * Find the widget with the given id, or `null`.
     */
    _findWidgetByID(id) {
        const item = find(this._items, (value) => value.widget.id === id);
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
        ArrayExt.removeAt(this._items, this._findWidgetIndex(widget));
        this._refreshVisibility();
        this._widgetRemoved.emit(widget);
    }
}
/**
 * A class to manages the palette entries associated to the side panels.
 */
export class SidePanelPalette {
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
