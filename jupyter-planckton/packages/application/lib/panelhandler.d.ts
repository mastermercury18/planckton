import { ICommandPalette } from '@jupyterlab/apputils';
import { IDisposable } from '@lumino/disposable';
import { ISignal } from '@lumino/signaling';
import { Panel, Widget } from '@lumino/widgets';
/**
 * A class which manages a panel and sorts its widgets by rank.
 */
export declare class PanelHandler {
    constructor();
    /**
     * Get the panel managed by the handler.
     */
    get panel(): Panel;
    /**
     * Add a widget to the panel.
     *
     * If the widget is already added, it will be moved.
     */
    addWidget(widget: Widget, rank: number): void;
    /**
     * A message hook for child remove messages on the panel handler.
     */
    private _panelChildHook;
    protected _items: Private.IRankItem[];
    protected _panel: Panel;
}
/**
 * A class which manages a side panel that can show at most one widget at a time.
 */
export declare class SidePanelHandler extends PanelHandler {
    /**
     * Construct a new side panel handler.
     */
    constructor(area: SidePanel.Area);
    /**
     * Get the current widget in the sidebar panel.
     */
    get currentWidget(): Widget | null;
    /**
     * Get the area of the side panel
     */
    get area(): SidePanel.Area;
    /**
     * Whether the panel is visible
     */
    get isVisible(): boolean;
    /**
     * Get the stacked panel managed by the handler
     */
    get panel(): Panel;
    /**
     * Get the widgets list.
     */
    get widgets(): Readonly<Widget[]>;
    /**
     * Signal fired when a widget is added to the panel
     */
    get widgetAdded(): ISignal<SidePanelHandler, Widget>;
    /**
     * Signal fired when a widget is removed from the panel
     */
    get widgetRemoved(): ISignal<SidePanelHandler, Widget>;
    /**
     * Get the close button element.
     */
    get closeButton(): HTMLButtonElement;
    /**
     * Expand the sidebar.
     *
     * #### Notes
     * This will open the most recently used widget, or the first widget
     * if there is no most recently used.
     */
    expand(id?: string): void;
    /**
     * Activate a widget residing in the stacked panel by ID.
     *
     * @param id - The widget's unique ID.
     */
    activate(id: string): void;
    /**
     * Test whether the sidebar has the given widget by id.
     */
    has(id: string): boolean;
    /**
     * Collapse the sidebar so no items are expanded.
     */
    collapse(): void;
    /**
     * Add a widget and its title to the stacked panel.
     *
     * If the widget is already added, it will be moved.
     */
    addWidget(widget: Widget, rank: number): void;
    /**
     * Hide the side panel
     */
    hide(): void;
    /**
     * Show the side panel
     */
    show(): void;
    /**
     * Find the insertion index for a rank item.
     */
    private _findInsertIndex;
    /**
     * Find the index of the item with the given widget, or `-1`.
     */
    private _findWidgetIndex;
    /**
     * Find the widget with the given id, or `null`.
     */
    private _findWidgetByID;
    /**
     * Refresh the visibility of the stacked panel.
     */
    private _refreshVisibility;
    private _onWidgetRemoved;
    private _area;
    private _isHiddenByUser;
    private _widgetPanel;
    private _currentWidget;
    private _lastCurrentWidget;
    private _closeButton;
    private _widgetAdded;
    private _widgetRemoved;
}
/**
 * A name space for SideBarPanel functions.
 */
export declare namespace SidePanel {
    /**
     * The areas of the sidebar panel
     */
    type Area = 'left' | 'right';
}
/**
 * A class to manages the palette entries associated to the side panels.
 */
export declare class SidePanelPalette {
    /**
     * Construct a new side panel palette.
     */
    constructor(options: SidePanelPaletteOption);
    /**
     * Get a command palette item from the widget id and the area.
     */
    getItem(widget: Readonly<Widget>, area: 'left' | 'right'): SidePanelPaletteItem | null;
    /**
     * Add an item to the command palette.
     */
    addItem(widget: Readonly<Widget>, area: 'left' | 'right'): void;
    /**
     * Remove an item from the command palette.
     */
    removeItem(widget: Readonly<Widget>, area: 'left' | 'right'): void;
    _command: string;
    _commandPalette: ICommandPalette;
    _items: SidePanelPaletteItem[];
}
type SidePanelPaletteItem = {
    /**
     * The ID of the widget associated to the command palette.
     */
    widgetId: string;
    /**
     * The area of the panel associated to the command palette.
     */
    area: 'left' | 'right';
    /**
     * The disposable object to remove the item from command palette.
     */
    disposable: IDisposable;
};
/**
 * An interface for the options to include in SideBarPalette constructor.
 */
type SidePanelPaletteOption = {
    /**
     * The commands palette.
     */
    commandPalette: ICommandPalette;
    /**
     * The command to call from each side panel menu entry.
     *
     * ### Notes
     * That command required 3 args :
     *      side: 'left' | 'right', the area to toggle
     *      title: string, label of the command
     *      id: string, id of the widget to activate
     */
    command: string;
};
/**
 * A namespace for private module data.
 */
declare namespace Private {
    /**
     * An object which holds a widget and its sort rank.
     */
    interface IRankItem {
        /**
         * The widget for the item.
         */
        widget: Widget;
        /**
         * The sort rank of the widget.
         */
        rank: number;
    }
    /**
     * A less-than comparison function for side bar rank items.
     */
    function itemCmp(first: IRankItem, second: IRankItem): number;
}
export {};
