import { INotebookPathOpener } from './tokens';
/**
 * A class to open paths in new browser tabs in the Notebook application.
 */
declare class DefaultNotebookPathOpener implements INotebookPathOpener {
    /**
     * Open a path in a new browser tab.
     */
    open(options: INotebookPathOpener.IOpenOptions): WindowProxy | null;
}
export declare const defaultNotebookPathOpener: DefaultNotebookPathOpener;
export {};
