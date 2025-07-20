import { ReactWidget } from '@jupyterlab/apputils';
import { Notebook } from '@jupyterlab/notebook';
import { ITranslator } from '@jupyterlab/translation';
/**
 * A namespace for TrustedComponent static methods.
 */
export declare namespace TrustedComponent {
    /**
     * Create a new TrustedComponent
     *
     * @param notebook The notebook
     * @param translator The translator
     */
    const create: ({ notebook, translator, }: {
        notebook: Notebook;
        translator: ITranslator;
    }) => ReactWidget;
}
