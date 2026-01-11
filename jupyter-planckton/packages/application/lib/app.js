// Copyright (c) Jupyter Development Team.
// Distributed under the terms of the Modified BSD License.
import { JupyterLab, JupyterFrontEnd, } from '@jupyterlab/application';
import { Base64ModelFactory } from '@jupyterlab/docregistry';
import { createRendermimePlugins } from '@jupyterlab/application/lib/mimerenderers';
import { LabStatus } from '@jupyterlab/application/lib/status';
import { PageConfig } from '@jupyterlab/coreutils';
import { Throttler } from '@lumino/polling';
import { NotebookShell } from './shell';
/**
 * App is the main application class. It is instantiated once and shared.
 */
export class NotebookApp extends JupyterFrontEnd {
    /**
     * Construct a new NotebookApp object.
     *
     * @param options The instantiation options for an application.
     */
    constructor(options = { shell: new NotebookShell() }) {
        var _a, _b;
        super({ ...options, shell: (_a = options.shell) !== null && _a !== void 0 ? _a : new NotebookShell() });
        /**
         * The name of the application.
         */
        this.name = 'Jupyter Notebook';
        /**
         * A namespace/prefix plugins may use to denote their provenance.
         */
        this.namespace = this.name;
        /**
         * The application busy and dirty status signals and flags.
         */
        this.status = new LabStatus(this);
        /**
         * The version of the application.
         */
        this.version = (_b = PageConfig.getOption('appVersion')) !== null && _b !== void 0 ? _b : 'unknown';
        this._info = JupyterLab.defaultInfo;
        this._formatter = new Throttler(() => {
            Private.setFormat(this);
        }, 250);
        // Add initial model factory.
        this.docRegistry.addModelFactory(new Base64ModelFactory());
        if (options.mimeExtensions) {
            for (const plugin of createRendermimePlugins(options.mimeExtensions)) {
                this.registerPlugin(plugin);
            }
        }
        // Create an IInfo dictionary from the options to override the defaults.
        const info = Object.keys(JupyterLab.defaultInfo).reduce((acc, val) => {
            if (val in options) {
                acc[val] = JSON.parse(JSON.stringify(options[val]));
            }
            return acc;
        }, {});
        // Populate application info.
        this._info = { ...JupyterLab.defaultInfo, ...info };
        this.restored = this.shell.restored;
        this.restored.then(() => this._formatter.invoke());
    }
    /**
     * The NotebookApp application information dictionary.
     */
    get info() {
        return this._info;
    }
    /**
     * The JupyterLab application paths dictionary.
     */
    get paths() {
        return {
            urls: {
                base: PageConfig.getOption('baseUrl'),
                notFound: PageConfig.getOption('notFoundUrl'),
                app: PageConfig.getOption('appUrl'),
                static: PageConfig.getOption('staticUrl'),
                settings: PageConfig.getOption('settingsUrl'),
                themes: PageConfig.getOption('themesUrl'),
                doc: PageConfig.getOption('docUrl'),
                translations: PageConfig.getOption('translationsApiUrl'),
                hubHost: PageConfig.getOption('hubHost') || undefined,
                hubPrefix: PageConfig.getOption('hubPrefix') || undefined,
                hubUser: PageConfig.getOption('hubUser') || undefined,
                hubServerName: PageConfig.getOption('hubServerName') || undefined,
            },
            directories: {
                appSettings: PageConfig.getOption('appSettingsDir'),
                schemas: PageConfig.getOption('schemasDir'),
                static: PageConfig.getOption('staticDir'),
                templates: PageConfig.getOption('templatesDir'),
                themes: PageConfig.getOption('themesDir'),
                userSettings: PageConfig.getOption('userSettingsDir'),
                serverRoot: PageConfig.getOption('serverRoot'),
                workspaces: PageConfig.getOption('workspacesDir'),
            },
        };
    }
    /**
     * Handle the DOM events for the application.
     *
     * @param event - The DOM event sent to the application.
     */
    handleEvent(event) {
        super.handleEvent(event);
        if (event.type === 'resize') {
            void this._formatter.invoke();
        }
    }
    /**
     * Register plugins from a plugin module.
     *
     * @param mod - The plugin module to register.
     */
    registerPluginModule(mod) {
        let data = mod.default;
        // Handle commonjs exports.
        if (!Object.prototype.hasOwnProperty.call(mod, '__esModule')) {
            data = mod;
        }
        if (!Array.isArray(data)) {
            data = [data];
        }
        data.forEach((item) => {
            try {
                this.registerPlugin(item);
            }
            catch (error) {
                console.error(error);
            }
        });
    }
    /**
     * Register the plugins from multiple plugin modules.
     *
     * @param mods - The plugin modules to register.
     */
    registerPluginModules(mods) {
        mods.forEach((mod) => {
            this.registerPluginModule(mod);
        });
    }
}
/**
 * A namespace for module-private functionality.
 */
var Private;
(function (Private) {
    /**
     * Media query for mobile devices.
     */
    const MOBILE_QUERY = 'only screen and (max-width: 760px)';
    /**
     * Sets the `format` of a Jupyter front-end application.
     *
     * @param app The front-end application whose format is set.
     */
    function setFormat(app) {
        app.format = window.matchMedia(MOBILE_QUERY).matches ? 'mobile' : 'desktop';
    }
    Private.setFormat = setFormat;
})(Private || (Private = {}));
