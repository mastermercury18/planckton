// Copyright (c) Jupyter Development Team.
// Distributed under the terms of the Modified BSD License.
import { IRouter, } from '@jupyterlab/application';
import { PageConfig, URLExt } from '@jupyterlab/coreutils';
import { ITerminalTracker } from '@jupyterlab/terminal';
import { INotebookPathOpener, defaultNotebookPathOpener, } from '@jupyter-notebook/application';
import { find } from '@lumino/algorithm';
/**
 * A plugin to open terminals in a new tab
 */
const opener = {
    id: '@jupyter-notebook/terminal-extension:opener',
    description: 'A plugin to open terminals in a new tab.',
    requires: [IRouter, ITerminalTracker],
    autoStart: true,
    activate: (app, router, tracker) => {
        const { commands } = app;
        const terminalPattern = new RegExp('/terminals/(.*)');
        const command = 'router:terminal';
        commands.addCommand(command, {
            execute: (args) => {
                const parsed = args;
                const matches = parsed.path.match(terminalPattern);
                if (!matches) {
                    return;
                }
                const [, name] = matches;
                if (!name) {
                    return;
                }
                tracker.widgetAdded.connect((send, terminal) => {
                    terminal.content.setOption('closeOnExit', false);
                });
                commands.execute('terminal:open', { name });
            },
        });
        router.register({ command, pattern: terminalPattern });
    },
};
/**
 * Open terminals in a new tab.
 */
const redirect = {
    id: '@jupyter-notebook/terminal-extension:redirect',
    description: 'Open terminals in a new tab.',
    requires: [ITerminalTracker],
    optional: [INotebookPathOpener],
    autoStart: true,
    activate: (app, tracker, notebookPathOpener) => {
        const baseUrl = PageConfig.getBaseUrl();
        const opener = notebookPathOpener !== null && notebookPathOpener !== void 0 ? notebookPathOpener : defaultNotebookPathOpener;
        tracker.widgetAdded.connect((send, terminal) => {
            const widget = find(app.shell.widgets('main'), (w) => w.id === terminal.id);
            if (widget) {
                // bail if the terminal is already added to the main area
                return;
            }
            const name = terminal.content.session.name;
            opener.open({
                prefix: URLExt.join(baseUrl, 'terminals'),
                path: name,
                target: '_blank',
            });
            // dispose the widget since it is not used on this page
            terminal.dispose();
        });
    },
};
/**
 * Export the plugins as default.
 */
const plugins = [opener, redirect];
export default plugins;
