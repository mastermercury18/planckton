// Copyright (c) Jupyter Development Team.
// Distributed under the terms of the Modified BSD License.
import { DOMUtils, IToolbarWidgetRegistry, ICommandPalette, } from '@jupyterlab/apputils';
import { PageConfig, Text, Time, URLExt } from '@jupyterlab/coreutils';
import { IDocumentManager } from '@jupyterlab/docmanager';
import { IMainMenu } from '@jupyterlab/mainmenu';
import { NotebookPanel, INotebookTracker, INotebookTools, } from '@jupyterlab/notebook';
import { ISettingRegistry } from '@jupyterlab/settingregistry';
import { ITranslator, nullTranslator } from '@jupyterlab/translation';
import { INotebookShell } from '@jupyter-notebook/application';
import { Poll } from '@lumino/polling';
import { Widget } from '@lumino/widgets';
import { TrustedComponent } from './trusted';
import { LabIcon } from '@jupyterlab/ui-components';
import { ToolbarButton } from '@jupyterlab/apputils';
import plancktonSvg from '../style/icons/planckton.svg';
import { PlancktonComponent } from './planckton';
// Module-level variable to persist the Planckton widget
let plancktonWidget = null;
/**
 * The class for kernel status errors.
 */
const KERNEL_STATUS_ERROR_CLASS = 'jp-NotebookKernelStatus-error';
/**
 * The class for kernel status warnings.
 */
const KERNEL_STATUS_WARN_CLASS = 'jp-NotebookKernelStatus-warn';
/**
 * The class for kernel status infos.
 */
const KERNEL_STATUS_INFO_CLASS = 'jp-NotebookKernelStatus-info';
/**
 * The class to fade out the kernel status.
 */
const KERNEL_STATUS_FADE_OUT_CLASS = 'jp-NotebookKernelStatus-fade';
/**
 * The class for scrolled outputs
 */
const SCROLLED_OUTPUTS_CLASS = 'jp-mod-outputsScrolled';
/**
 * The class for the full width notebook
 */
const FULL_WIDTH_NOTEBOOK_CLASS = 'jp-mod-fullwidth';
/**
 * The command IDs used by the notebook plugins.
 */
var CommandIDs;
(function (CommandIDs) {
    /**
     * A command to open right sidebar for Editing Notebook Metadata
     */
    CommandIDs.openEditNotebookMetadata = 'notebook:edit-metadata';
    /**
     * A command to toggle full width of the notebook
     */
    CommandIDs.toggleFullWidth = 'notebook:toggle-full-width';
})(CommandIDs || (CommandIDs = {}));
/**
 * A plugin for the checkpoint indicator
 */
const checkpoints = {
    id: '@jupyter-notebook/notebook-extension:checkpoints',
    description: 'A plugin for the checkpoint indicator.',
    autoStart: true,
    requires: [IDocumentManager, ITranslator],
    optional: [INotebookShell, IToolbarWidgetRegistry],
    activate: (app, docManager, translator, notebookShell, toolbarRegistry) => {
        const { shell } = app;
        const trans = translator.load('notebook');
        const node = document.createElement('div');
        if (toolbarRegistry) {
            toolbarRegistry.addFactory('TopBar', 'checkpoint', (toolbar) => {
                const widget = new Widget({ node });
                widget.id = DOMUtils.createDomID();
                widget.addClass('jp-NotebookCheckpoint');
                return widget;
            });
        }
        const onChange = async () => {
            const current = shell.currentWidget;
            if (!current) {
                return;
            }
            const context = docManager.contextForWidget(current);
            context === null || context === void 0 ? void 0 : context.fileChanged.disconnect(onChange);
            context === null || context === void 0 ? void 0 : context.fileChanged.connect(onChange);
            const checkpoints = await (context === null || context === void 0 ? void 0 : context.listCheckpoints());
            if (!checkpoints || !checkpoints.length) {
                return;
            }
            const checkpoint = checkpoints[checkpoints.length - 1];
            node.textContent = trans.__('Last Checkpoint: %1', Time.formatHuman(new Date(checkpoint.last_modified)));
        };
        if (notebookShell) {
            notebookShell.currentChanged.connect(onChange);
        }
        new Poll({
            auto: true,
            factory: () => onChange(),
            frequency: {
                interval: 2000,
                backoff: false,
            },
            standby: 'when-hidden',
        });
    },
};
/**
 * Add a command to close the browser tab when clicking on "Close and Shut Down"
 */
const closeTab = {
    id: '@jupyter-notebook/notebook-extension:close-tab',
    description: 'Add a command to close the browser tab when clicking on "Close and Shut Down".',
    autoStart: true,
    requires: [IMainMenu],
    optional: [ITranslator],
    activate: (app, menu, translator) => {
        const { commands } = app;
        translator = translator !== null && translator !== void 0 ? translator : nullTranslator;
        const trans = translator.load('notebook');
        const id = 'notebook:close-and-halt';
        commands.addCommand(id, {
            label: trans.__('Close and Shut Down Notebook'),
            execute: async () => {
                // Shut the kernel down, without confirmation
                await commands.execute('notebook:shutdown-kernel', { activate: false });
                window.close();
            },
        });
        menu.fileMenu.closeAndCleaners.add({
            id,
            // use a small rank to it takes precedence over the default
            // shut down action for the notebook
            rank: 0,
        });
    },
};
/**
 * Add a command to open the tree view from the notebook view
 */
const openTreeTab = {
    id: '@jupyter-notebook/notebook-extension:open-tree-tab',
    description: 'Add a command to open a browser tab on the tree view when clicking "Open...".',
    autoStart: true,
    optional: [ITranslator],
    activate: (app, translator) => {
        const { commands } = app;
        translator = translator !== null && translator !== void 0 ? translator : nullTranslator;
        const trans = translator.load('notebook');
        const id = 'notebook:open-tree-tab';
        commands.addCommand(id, {
            label: trans.__('Open…'),
            execute: async () => {
                const url = URLExt.join(PageConfig.getBaseUrl(), 'tree');
                window.open(url);
            },
        });
    },
};
/**
 * A plugin to set the notebook to full width.
 */
const fullWidthNotebook = {
    id: '@jupyter-notebook/notebook-extension:full-width-notebook',
    description: 'A plugin to set the notebook to full width.',
    autoStart: true,
    requires: [INotebookTracker],
    optional: [ICommandPalette, ISettingRegistry, ITranslator],
    activate: (app, tracker, palette, settingRegistry, translator) => {
        const trans = (translator !== null && translator !== void 0 ? translator : nullTranslator).load('notebook');
        let fullWidth = false;
        const toggleFullWidth = () => {
            const current = tracker.currentWidget;
            fullWidth = !fullWidth;
            if (!current) {
                return;
            }
            const content = current;
            content.toggleClass(FULL_WIDTH_NOTEBOOK_CLASS, fullWidth);
        };
        let notebookSettings;
        if (settingRegistry) {
            const loadSettings = settingRegistry.load(fullWidthNotebook.id);
            const updateSettings = (settings) => {
                const newFullWidth = settings.get('fullWidthNotebook')
                    .composite;
                if (newFullWidth !== fullWidth) {
                    toggleFullWidth();
                }
            };
            Promise.all([loadSettings, app.restored])
                .then(([settings]) => {
                notebookSettings = settings;
                updateSettings(settings);
                settings.changed.connect((settings) => {
                    updateSettings(settings);
                });
            })
                .catch((reason) => {
                console.error(reason.message);
            });
        }
        app.commands.addCommand(CommandIDs.toggleFullWidth, {
            label: trans.__('Enable Full Width Notebook'),
            execute: () => {
                toggleFullWidth();
                if (notebookSettings) {
                    notebookSettings.set('fullWidthNotebook', fullWidth);
                }
            },
            isEnabled: () => tracker.currentWidget !== null,
            isToggled: () => fullWidth,
        });
        if (palette) {
            palette.addItem({
                command: CommandIDs.toggleFullWidth,
                category: 'Notebook Operations',
            });
        }
    },
};
/**
 * The kernel logo plugin.
 */
const kernelLogo = {
    id: '@jupyter-notebook/notebook-extension:kernel-logo',
    description: 'The kernel logo plugin.',
    autoStart: true,
    requires: [INotebookShell],
    optional: [IToolbarWidgetRegistry],
    activate: (app, shell, toolbarRegistry) => {
        const { serviceManager } = app;
        const node = document.createElement('div');
        const img = document.createElement('img');
        const onChange = async () => {
            var _a, _b, _c, _d, _e;
            const current = shell.currentWidget;
            if (!(current instanceof NotebookPanel)) {
                return;
            }
            if (!node.hasChildNodes()) {
                node.appendChild(img);
            }
            await current.sessionContext.ready;
            current.sessionContext.kernelChanged.disconnect(onChange);
            current.sessionContext.kernelChanged.connect(onChange);
            const name = (_c = (_b = (_a = current.sessionContext.session) === null || _a === void 0 ? void 0 : _a.kernel) === null || _b === void 0 ? void 0 : _b.name) !== null && _c !== void 0 ? _c : '';
            const spec = (_e = (_d = serviceManager.kernelspecs) === null || _d === void 0 ? void 0 : _d.specs) === null || _e === void 0 ? void 0 : _e.kernelspecs[name];
            if (!spec) {
                node.childNodes[0].remove();
                return;
            }
            const kernelIconUrl = spec.resources['logo-64x64'];
            if (!kernelIconUrl) {
                node.childNodes[0].remove();
                return;
            }
            img.src = kernelIconUrl;
            img.title = spec.display_name;
        };
        if (toolbarRegistry) {
            toolbarRegistry.addFactory('TopBar', 'kernelLogo', (toolbar) => {
                const widget = new Widget({ node });
                widget.addClass('jp-NotebookKernelLogo');
                return widget;
            });
        }
        app.started.then(() => {
            shell.currentChanged.connect(onChange);
        });
    },
};
/**
 * A plugin to display the kernel status;
 */
const kernelStatus = {
    id: '@jupyter-notebook/notebook-extension:kernel-status',
    description: 'A plugin to display the kernel status.',
    autoStart: true,
    requires: [INotebookShell, ITranslator],
    activate: (app, shell, translator) => {
        const trans = translator.load('notebook');
        const widget = new Widget();
        widget.addClass('jp-NotebookKernelStatus');
        app.shell.add(widget, 'menu', { rank: 10010 });
        const removeClasses = () => {
            widget.removeClass(KERNEL_STATUS_ERROR_CLASS);
            widget.removeClass(KERNEL_STATUS_WARN_CLASS);
            widget.removeClass(KERNEL_STATUS_INFO_CLASS);
            widget.removeClass(KERNEL_STATUS_FADE_OUT_CLASS);
        };
        const onStatusChanged = (sessionContext) => {
            const status = sessionContext.kernelDisplayStatus;
            let text = `Kernel ${Text.titleCase(status)}`;
            removeClasses();
            switch (status) {
                case 'busy':
                case 'idle':
                    text = '';
                    widget.addClass(KERNEL_STATUS_FADE_OUT_CLASS);
                    break;
                case 'dead':
                case 'terminating':
                    widget.addClass(KERNEL_STATUS_ERROR_CLASS);
                    break;
                case 'unknown':
                    widget.addClass(KERNEL_STATUS_WARN_CLASS);
                    break;
                default:
                    widget.addClass(KERNEL_STATUS_INFO_CLASS);
                    widget.addClass(KERNEL_STATUS_FADE_OUT_CLASS);
                    break;
            }
            widget.node.textContent = trans.__(text);
        };
        const onChange = async () => {
            const current = shell.currentWidget;
            if (!(current instanceof NotebookPanel)) {
                return;
            }
            const sessionContext = current.sessionContext;
            sessionContext.statusChanged.connect(onStatusChanged);
        };
        shell.currentChanged.connect(onChange);
    },
};
/**
 * A plugin to enable scrolling for outputs by default.
 * Mimic the logic from the classic notebook, as found here:
 * https://github.com/jupyter/notebook/blob/a9a31c096eeffe1bff4e9164c6a0442e0e13cdb3/notebook/static/notebook/js/outputarea.js#L96-L120
 */
const scrollOutput = {
    id: '@jupyter-notebook/notebook-extension:scroll-output',
    description: 'A plugin to enable scrolling for outputs by default.',
    autoStart: true,
    requires: [INotebookTracker],
    optional: [ISettingRegistry],
    activate: async (app, tracker, settingRegistry) => {
        const autoScrollThreshold = 100;
        let autoScrollOutputs = true;
        // decide whether to scroll the output of the cell based on some heuristics
        const autoScroll = (cell) => {
            if (!autoScrollOutputs) {
                // bail if disabled via the settings
                cell.removeClass(SCROLLED_OUTPUTS_CLASS);
                return;
            }
            const { outputArea } = cell;
            // respect cells with an explicit scrolled state
            const scrolled = cell.model.getMetadata('scrolled');
            if (scrolled !== undefined) {
                return;
            }
            const { node } = outputArea;
            const height = node.scrollHeight;
            const fontSize = parseFloat(node.style.fontSize.replace('px', ''));
            const lineHeight = (fontSize || 14) * 1.3;
            // do not set via cell.outputScrolled = true, as this would
            // otherwise synchronize the scrolled state to the notebook metadata
            const scroll = height > lineHeight * autoScrollThreshold;
            cell.toggleClass(SCROLLED_OUTPUTS_CLASS, scroll);
        };
        const handlers = {};
        const setAutoScroll = (cell) => {
            if (cell.model.type === 'code') {
                const codeCell = cell;
                const id = codeCell.model.id;
                autoScroll(codeCell);
                if (handlers[id]) {
                    codeCell.outputArea.model.changed.disconnect(handlers[id]);
                }
                handlers[id] = () => autoScroll(codeCell);
                codeCell.outputArea.model.changed.connect(handlers[id]);
            }
        };
        tracker.widgetAdded.connect((sender, notebook) => {
            var _a;
            // when the notebook widget is created, process all the cells
            notebook.sessionContext.ready.then(() => {
                notebook.content.widgets.forEach(setAutoScroll);
            });
            (_a = notebook.model) === null || _a === void 0 ? void 0 : _a.cells.changed.connect((sender, args) => {
                notebook.content.widgets.forEach(setAutoScroll);
            });
        });
        if (settingRegistry) {
            const loadSettings = settingRegistry.load(scrollOutput.id);
            const updateSettings = (settings) => {
                autoScrollOutputs = settings.get('autoScrollOutputs')
                    .composite;
            };
            Promise.all([loadSettings, app.restored])
                .then(([settings]) => {
                updateSettings(settings);
                settings.changed.connect((settings) => {
                    updateSettings(settings);
                });
            })
                .catch((reason) => {
                console.error(reason.message);
            });
        }
    },
};
/**
 * A plugin to add the NotebookTools to the side panel;
 */
const notebookToolsWidget = {
    id: '@jupyter-notebook/notebook-extension:notebook-tools',
    description: 'A plugin to add the NotebookTools to the side panel.',
    autoStart: true,
    requires: [INotebookShell],
    optional: [INotebookTools],
    activate: (app, shell, notebookTools) => {
        const onChange = async () => {
            const current = shell.currentWidget;
            if (!(current instanceof NotebookPanel)) {
                return;
            }
            // Add the notebook tools in right area.
            if (notebookTools) {
                shell.add(notebookTools, 'right', { type: 'Property Inspector' });
            }
        };
        shell.currentChanged.connect(onChange);
    },
};
/**
 * A plugin to update the tab icon based on the kernel status.
 */
const tabIcon = {
    id: '@jupyter-notebook/notebook-extension:tab-icon',
    description: 'A plugin to update the tab icon based on the kernel status.',
    autoStart: true,
    requires: [INotebookTracker],
    activate: (app, tracker) => {
        // the favicons are provided by Jupyter Server
        const baseURL = PageConfig.getBaseUrl();
        const notebookIcon = URLExt.join(baseURL, 'static/favicons/favicon-notebook.ico');
        const busyIcon = URLExt.join(baseURL, 'static/favicons/favicon-busy-1.ico');
        const updateBrowserFavicon = (status) => {
            const link = document.querySelector("link[rel*='icon']");
            switch (status) {
                case 'busy':
                    link.href = busyIcon;
                    break;
                case 'idle':
                    link.href = notebookIcon;
                    break;
            }
        };
        const onChange = async () => {
            const current = tracker.currentWidget;
            const sessionContext = current === null || current === void 0 ? void 0 : current.sessionContext;
            if (!sessionContext) {
                return;
            }
            sessionContext.statusChanged.connect(() => {
                const status = sessionContext.kernelDisplayStatus;
                updateBrowserFavicon(status);
            });
        };
        tracker.currentChanged.connect(onChange);
    },
};
/**
 * A plugin that adds a Trusted indicator to the menu area
 */
const trusted = {
    id: '@jupyter-notebook/notebook-extension:trusted',
    description: 'A plugin that adds a Trusted indicator to the menu area.',
    autoStart: true,
    requires: [INotebookShell, ITranslator],
    activate: (app, notebookShell, translator) => {
        const onChange = async () => {
            const current = notebookShell.currentWidget;
            if (!(current instanceof NotebookPanel)) {
                return;
            }
            const notebook = current.content;
            await current.context.ready;
            const widget = TrustedComponent.create({ notebook, translator });
            notebookShell.add(widget, 'menu', {
                rank: 11000,
            });
        };
        notebookShell.currentChanged.connect(onChange);
    },
};
/**
 * Add a command to open right sidebar for Editing Notebook Metadata when clicking on "Edit Notebook Metadata" under Edit menu
 */
const editNotebookMetadata = {
    id: '@jupyter-notebook/notebook-extension:edit-notebook-metadata',
    description: 'Add a command to open right sidebar for Editing Notebook Metadata when clicking on "Edit Notebook Metadata" under Edit menu',
    autoStart: true,
    optional: [ICommandPalette, ITranslator, INotebookTools],
    activate: (app, palette, translator, notebookTools) => {
        const { commands, shell } = app;
        translator = translator !== null && translator !== void 0 ? translator : nullTranslator;
        const trans = translator.load('notebook');
        commands.addCommand(CommandIDs.openEditNotebookMetadata, {
            label: trans.__('Edit Notebook Metadata'),
            execute: async () => {
                const command = 'application:toggle-panel';
                const args = {
                    side: 'right',
                    title: 'Show Notebook Tools',
                    id: 'notebook-tools',
                };
                // Check if Show Notebook Tools (Right Sidebar) is open (expanded)
                if (!commands.isToggled(command, args)) {
                    await commands.execute(command, args).then((_) => {
                        // For expanding the 'Advanced Tools' section (default: collapsed)
                        if (notebookTools) {
                            const tools = (notebookTools === null || notebookTools === void 0 ? void 0 : notebookTools.layout).widgets;
                            tools.forEach((tool) => {
                                if (tool.widget.title.label === trans.__('Advanced Tools') &&
                                    tool.collapsed) {
                                    tool.toggle();
                                }
                            });
                        }
                    });
                }
            },
            isVisible: () => shell.currentWidget !== null &&
                shell.currentWidget instanceof NotebookPanel,
        });
        if (palette) {
            palette.addItem({
                command: CommandIDs.openEditNotebookMetadata,
                category: 'Notebook Operations',
            });
        }
    },
};
/**
 * A plugin to add the Planckton AI chat panel and toolbar button to the notebook UI.
 */
const PLANCKTON_PANEL_ID = 'jp-PlancktonPanel';
const plancktonPanel = {
    id: '@jupyter-notebook/notebook-extension:planckton-panel',
    description: 'A plugin to add the Planckton AI chat panel and toolbar button to the notebook UI.',
    autoStart: true,
    requires: [INotebookTracker],
    activate: (app, tracker) => {
        app.docRegistry.addWidgetExtension('Notebook', {
            createNew: (panel) => {
                // Add the Planckton button to the toolbar
                const button = new ToolbarButton({
                    className: 'jp-PlancktonToolbarButton',
                    icon: plancktonIcon,
                    tooltip: 'Open Planckton AI Assistant',
                    onClick: () => {
                        console.log('[Planckton] Planckton toolbar button clicked');
                        // Only add the panel if it doesn't already exist
                        let widget = Array.from(app.shell.widgets('main')).find(w => w.id === PLANCKTON_PANEL_ID);
                        if (!widget) {
                            console.log('[Planckton] Creating new Planckton chat panel');
                            // Use the actual Planckton ReactWidget
                            plancktonWidget = PlancktonComponent.create();
                            plancktonWidget.id = PLANCKTON_PANEL_ID;
                            plancktonWidget.title.label = 'Planckton AI Assistant';
                            plancktonWidget.title.closable = true;
                            app.shell.add(plancktonWidget, 'right');
                            app.shell.expandRight(plancktonWidget.id);
                            plancktonWidget.show();
                            plancktonWidget.update();
                            console.log('[Planckton] Planckton chat panel added and shown');
                        }
                        else {
                            console.log('[Planckton] Planckton chat panel already exists, activating');
                            app.shell.activateById(PLANCKTON_PANEL_ID);
                        }
                    }
                });
                panel.toolbar.insertAfter('debug', 'planckton', button);
                return button;
            }
        });
    }
};
/**
 * Register the Planckton icon
 */
export const plancktonIcon = new LabIcon({
    name: 'notebook-extension:planckton',
    svgstr: plancktonSvg
});
/**
 * Export the plugins as default.
 */
const plugins = [
    checkpoints,
    closeTab,
    openTreeTab,
    editNotebookMetadata,
    fullWidthNotebook,
    kernelLogo,
    kernelStatus,
    notebookToolsWidget,
    scrollOutput,
    tabIcon,
    trusted,
    plancktonPanel,
];
export default plugins;
