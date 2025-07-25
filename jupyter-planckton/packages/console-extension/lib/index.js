// Copyright (c) Jupyter Development Team.
// Distributed under the terms of the Modified BSD License.
import { IRouter, } from '@jupyterlab/application';
import { IConsoleTracker } from '@jupyterlab/console';
import { PageConfig, URLExt } from '@jupyterlab/coreutils';
import { INotebookPathOpener, defaultNotebookPathOpener, } from '@jupyter-notebook/application';
import { find } from '@lumino/algorithm';
/**
 * A plugin to open consoles in a new tab
 */
const opener = {
    id: '@jupyter-notebook/console-extension:opener',
    requires: [IRouter],
    autoStart: true,
    description: 'A plugin to open consoles in a new tab',
    activate: (app, router) => {
        const { commands } = app;
        const consolePattern = new RegExp('/consoles/(.*)');
        const command = 'router:console';
        commands.addCommand(command, {
            execute: (args) => {
                const parsed = args;
                const matches = parsed.path.match(consolePattern);
                if (!matches) {
                    return;
                }
                const [, match] = matches;
                if (!match) {
                    return;
                }
                const path = decodeURIComponent(match);
                commands.execute('console:create', { path });
            },
        });
        router.register({ command, pattern: consolePattern });
    },
};
/**
 * Open consoles in a new tab.
 */
const redirect = {
    id: '@jupyter-notebook/console-extension:redirect',
    requires: [IConsoleTracker],
    optional: [INotebookPathOpener],
    autoStart: true,
    description: 'Open consoles in a new tab',
    activate: (app, tracker, notebookPathOpener) => {
        const baseUrl = PageConfig.getBaseUrl();
        const opener = notebookPathOpener !== null && notebookPathOpener !== void 0 ? notebookPathOpener : defaultNotebookPathOpener;
        tracker.widgetAdded.connect(async (send, console) => {
            const { sessionContext } = console;
            await sessionContext.ready;
            const widget = find(app.shell.widgets('main'), (w) => w.id === console.id);
            if (widget) {
                // bail if the console is already added to the main area
                return;
            }
            opener.open({
                prefix: URLExt.join(baseUrl, 'consoles'),
                path: sessionContext.path,
                target: '_blank',
            });
            // the widget is not needed anymore
            console.dispose();
        });
    },
};
/**
 * Export the plugins as default.
 */
const plugins = [opener, redirect];
export default plugins;
