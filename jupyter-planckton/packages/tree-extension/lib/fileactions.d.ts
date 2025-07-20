import { ReactWidget } from '@jupyterlab/apputils';
import { FileBrowser } from '@jupyterlab/filebrowser';
import { ITranslator } from '@jupyterlab/translation';
import { CommandRegistry } from '@lumino/commands';
import { ISignal } from '@lumino/signaling';
export declare class FilesActionButtons {
    /**
     * The constructor of FilesActionButtons.
     * @param options
     */
    constructor(options: {
        commands: CommandRegistry;
        browser: FileBrowser;
        selectionChanged: ISignal<FileBrowser, void>;
        translator: ITranslator;
    });
    /**
     * Return an iterator with all the action widgets.
     */
    get widgets(): IterableIterator<ReactWidget>;
    /**
     * Triggered when the selection change in file browser.
     */
    private _onSelectionChanged;
    private _browser;
    private _widgets;
}
