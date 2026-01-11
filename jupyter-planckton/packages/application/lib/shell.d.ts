import { JupyterFrontEnd } from '@jupyterlab/application';
import { DocumentRegistry } from '@jupyterlab/docregistry';
import { ITranslator } from '@jupyterlab/translation';
import { Token } from '@lumino/coreutils';
import { ISignal } from '@lumino/signaling';
import { FocusTracker, Widget } from '@lumino/widgets';
import { SidePanelHandler } from './panelhandler';
/**
 * The Jupyter Notebook application shell token.
 */
export declare const INotebookShell: Token<INotebookShell>;
/**
 * The Jupyter Notebook application shell interface.
 */
export interface INotebookShell extends NotebookShell {
}
/**
 * The namespace for INotebookShell type information.
 */
export declare namespace INotebookShell {
    /**
     * The areas of the application shell where widgets can reside.
     */
    type Area = 'main' | 'top' | 'menu' | 'left' | 'right' | 'down';
    /**
     * Widget position
     */
    interface IWidgetPosition {
        /**
         * Widget area
         */
        area?: Area;
        /**
         * Widget opening options
         */
        options?: DocumentRegistry.IOpenOptions;
    }
    /**
     * Mapping of widget type identifier and their user customized position
     */
    interface IUserLayout {
        /**
         * Widget customized position
         */
        [k: string]: IWidgetPosition;
    }
}
/**
 * The application shell.
 */
export declare class NotebookShell extends Widget implements JupyterFrontEnd.IShell {
    constructor();
    /**
     * A signal emitted when the current widget changes.
     */
    get currentChanged(): ISignal<JupyterFrontEnd.IShell, FocusTracker.IChangedArgs<Widget>>;
    /**
     * The current widget in the shell's main area.
     */
    get currentWidget(): Widget | null;
    /**
     * Get the top area wrapper panel
     */
    get top(): Widget;
    /**
     * Get the menu area wrapper panel
     */
    get menu(): Widget;
    /**
     * Get the left area handler
     */
    get leftHandler(): SidePanelHandler;
    /**
     * Get the right area handler
     */
    get rightHandler(): SidePanelHandler;
    /**
     * Is the left sidebar visible?
     */
    get leftCollapsed(): boolean;
    /**
     * Is the right sidebar visible?
     */
    get rightCollapsed(): boolean;
    /**
     * Promise that resolves when the main widget is loaded
     */
    get restored(): Promise<void>;
    /**
     * Getter and setter for the translator.
     */
    get translator(): ITranslator;
    set translator(value: ITranslator);
    /**
     * User custom shell layout.
     */
    get userLayout(): any;
    /**
     * Activate a widget in its area.
     */
    activateById(id: string): void;
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
    add(widget: Widget, area?: INotebookShell.Area, options?: DocumentRegistry.IOpenOptions): void;
    /**
     * Collapse the top area and the spacer to make the view more compact.
     */
    collapseTop(): void;
    /**
     * Expand the top area to show the header and the spacer.
     */
    expandTop(): void;
    /**
     * Return the list of widgets for the given area.
     *
     * @param area The area
     */
    widgets(area: INotebookShell.Area): IterableIterator<Widget>;
    /**
     * Expand the left panel to show the sidebar with its widget.
     */
    expandLeft(id?: string): void;
    /**
     * Collapse the left panel
     */
    collapseLeft(): void;
    /**
     * Expand the right panel to show the sidebar with its widget.
     */
    expandRight(id?: string): void;
    /**
     * Collapse the right panel
     */
    collapseRight(): void;
    /**
     * Restore the layout state and configuration for the application shell.
     */
    restoreLayout(configuration: INotebookShell.IUserLayout): Promise<void>;
    /**
     * Handle a change on the down panel widgets
     */
    private _onTabPanelChanged;
    private _topWrapper;
    private _topHandler;
    private _menuWrapper;
    private _menuHandler;
    private _leftHandler;
    private _rightHandler;
    private _spacer_top;
    private _spacer_bottom;
    private _skipLinkWidgetHandler;
    private _main;
    private _downPanel;
    private _translator;
    private _currentChanged;
    private _mainWidgetLoaded;
    private _userLayout;
}
export declare namespace Private {
    class SkipLinkWidgetHandler {
        /**
         * Construct a new skipLink widget handler.
         */
        constructor(shell: INotebookShell);
        handleEvent(event: Event): void;
        private _focusMain;
        /**
         * Get the input element managed by the handler.
         */
        get skipLinkWidget(): Widget;
        /**
         * Dispose of the handler and the resources it holds.
         */
        dispose(): void;
        /**
         * Hide the skipLink widget.
         */
        hide(): void;
        /**
         * Show the skipLink widget.
         */
        show(): void;
        /**
         * Test whether the handler has been disposed.
         */
        get isDisposed(): boolean;
        private _skipLinkWidget;
        private _isDisposed;
    }
}
