import { TabBarSvg } from '@jupyterlab/ui-components';
import { TabPanel } from '@lumino/widgets';
/**
 * The widget added in main area of the tree view.
 */
export class NotebookTreeWidget extends TabPanel {
    /**
     * Constructor of the NotebookTreeWidget.
     */
    constructor() {
        super({
            tabPlacement: 'top',
            tabsMovable: true,
            renderer: TabBarSvg.defaultRenderer,
        });
        this.addClass('jp-TreePanel');
    }
}
