import { JupyterLab, JupyterFrontEnd, JupyterFrontEndPlugin } from '@jupyterlab/application';
import { LabStatus } from '@jupyterlab/application/lib/status';
import { IRenderMime } from '@jupyterlab/rendermime-interfaces';
import { INotebookShell } from './shell';
/**
 * App is the main application class. It is instantiated once and shared.
 */
export declare class NotebookApp extends JupyterFrontEnd<INotebookShell> {
    /**
     * Construct a new NotebookApp object.
     *
     * @param options The instantiation options for an application.
     */
    constructor(options?: NotebookApp.IOptions);
    /**
     * The name of the application.
     */
    readonly name = "Jupyter Notebook";
    /**
     * A namespace/prefix plugins may use to denote their provenance.
     */
    readonly namespace = "Jupyter Notebook";
    /**
     * The application busy and dirty status signals and flags.
     */
    readonly status: LabStatus;
    /**
     * Promise that resolves when the state is first restored
     */
    readonly restored: Promise<void>;
    /**
     * The version of the application.
     */
    readonly version: string;
    /**
     * The NotebookApp application information dictionary.
     */
    get info(): JupyterLab.IInfo;
    /**
     * The JupyterLab application paths dictionary.
     */
    get paths(): JupyterFrontEnd.IPaths;
    /**
     * Handle the DOM events for the application.
     *
     * @param event - The DOM event sent to the application.
     */
    handleEvent(event: Event): void;
    /**
     * Register plugins from a plugin module.
     *
     * @param mod - The plugin module to register.
     */
    registerPluginModule(mod: NotebookApp.IPluginModule): void;
    /**
     * Register the plugins from multiple plugin modules.
     *
     * @param mods - The plugin modules to register.
     */
    registerPluginModules(mods: NotebookApp.IPluginModule[]): void;
    private _info;
    private _formatter;
}
/**
 * A namespace for App static items.
 */
export declare namespace NotebookApp {
    /**
     * The instantiation options for an App application.
     */
    interface IOptions extends JupyterFrontEnd.IOptions<INotebookShell>, Partial<IInfo> {
    }
    /**
     * The information about a Jupyter Notebook application.
     */
    interface IInfo {
        /**
         * The mime renderer extensions.
         */
        readonly mimeExtensions: IRenderMime.IExtensionModule[];
        /**
         * The information about available plugins.
         */
        readonly availablePlugins: JupyterLab.IPluginInfo[];
    }
    /**
     * The interface for a module that exports a plugin or plugins as
     * the default value.
     */
    interface IPluginModule {
        /**
         * The default export.
         */
        default: JupyterFrontEndPlugin<any> | JupyterFrontEndPlugin<any>[];
    }
}
