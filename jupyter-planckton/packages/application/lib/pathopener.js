// Copyright (c) Jupyter Development Team.
// Distributed under the terms of the Modified BSD License.
import { URLExt } from '@jupyterlab/coreutils';
/**
 * A class to open paths in new browser tabs in the Notebook application.
 */
class DefaultNotebookPathOpener {
    /**
     * Open a path in a new browser tab.
     */
    open(options) {
        const { prefix, path, searchParams, target, features } = options;
        const url = new URL(URLExt.join(prefix, path !== null && path !== void 0 ? path : ''), window.location.origin);
        if (searchParams) {
            url.search = searchParams.toString();
        }
        return window.open(url, target, features);
    }
}
export const defaultNotebookPathOpener = new DefaultNotebookPathOpener();
