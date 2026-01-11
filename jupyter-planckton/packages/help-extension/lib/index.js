// Copyright (c) Jupyter Development Team.
// Distributed under the terms of the Modified BSD License.
import { Dialog, ICommandPalette } from '@jupyterlab/apputils';
import { IMainMenu } from '@jupyterlab/mainmenu';
import { ITranslator } from '@jupyterlab/translation';
import { jupyterIcon } from '@jupyter-notebook/ui-components';
import * as React from 'react';
/**
 * A list of resources to show in the help menu.
 */
const RESOURCES = [
    {
        text: 'About Jupyter',
        url: 'https://jupyter.org',
    },
    {
        text: 'Markdown Reference',
        url: 'https://commonmark.org/help/',
    },
    {
        text: 'Documentation',
        url: 'https://jupyter-notebook.readthedocs.io/en/stable/',
    },
];
/**
 * The command IDs used by the help plugin.
 */
var CommandIDs;
(function (CommandIDs) {
    CommandIDs.open = 'help:open';
    CommandIDs.about = 'help:about';
})(CommandIDs || (CommandIDs = {}));
/**
 * A plugin to open the about section with resources.
 */
const open = {
    id: '@jupyter-notebook/help-extension:open',
    autoStart: true,
    description: 'A plugin to open the about section with resources',
    activate: (app) => {
        const { commands } = app;
        commands.addCommand(CommandIDs.open, {
            label: (args) => args['text'],
            execute: (args) => {
                const url = args['url'];
                window.open(url);
            },
        });
    },
};
/**
 * Plugin to add a command to show an About Jupyter Notebook and Markdown Reference.
 */
const about = {
    id: '@jupyter-notebook/help-extension:about',
    autoStart: true,
    requires: [ITranslator],
    optional: [IMainMenu, ICommandPalette],
    description: 'Plugin to add a command to show an About Jupyter Notebook and Markdown Reference',
    activate: (app, translator, menu, palette) => {
        const { commands } = app;
        const trans = translator.load('notebook');
        const category = trans.__('Help');
        commands.addCommand(CommandIDs.about, {
            label: trans.__('About %1', app.name),
            execute: () => {
                const title = (React.createElement(React.Fragment, null,
                    React.createElement("span", { className: "jp-AboutNotebook-header" },
                        React.createElement(jupyterIcon.react, { width: "196px", height: "auto" }))));
                const notebookURL = 'https://github.com/jupyter/notebook';
                const contributorURL = 'https://github.com/jupyter/notebook/pulse';
                const aboutJupyter = trans.__('JUPYTER NOTEBOOK ON GITHUB');
                const contributorList = trans.__('CONTRIBUTOR LIST');
                const externalLinks = (React.createElement("span", null,
                    React.createElement("a", { href: notebookURL, target: "_blank", rel: "noopener noreferrer", className: "jp-Button-flat jp-AboutNotebook-about-externalLinks" }, aboutJupyter),
                    React.createElement("a", { href: contributorURL, target: "_blank", rel: "noopener noreferrer", className: "jp-Button-flat jp-AboutNotebook-about-externalLinks" }, contributorList)));
                const version = trans.__('Version: %1', app.version);
                const copyright = trans.__('© 2021-2023 Jupyter Notebook Contributors');
                const body = (React.createElement(React.Fragment, null,
                    React.createElement("span", { className: "jp-AboutNotebook-version" }, version),
                    React.createElement("div", null, externalLinks),
                    React.createElement("span", { className: "jp-AboutNotebook-about-copyright" }, copyright)));
                const dialog = new Dialog({
                    title,
                    body,
                    buttons: [
                        Dialog.createButton({
                            label: trans.__('Dismiss'),
                            className: 'jp-AboutNotebook-about-button jp-mod-reject jp-mod-styled',
                        }),
                    ],
                });
                dialog.addClass('jp-AboutNotebook');
                void dialog.launch();
            },
        });
        if (palette) {
            palette.addItem({ command: CommandIDs.about, category });
        }
        const resourcesGroup = RESOURCES.map((args) => ({
            args,
            command: CommandIDs.open,
        }));
        if (menu) {
            menu.helpMenu.addGroup(resourcesGroup, 30);
        }
    },
};
const plugins = [open, about];
export default plugins;
