import { ReactWidget } from '@jupyterlab/apputils';
import { NotebookActions } from '@jupyterlab/notebook';
import React, { useEffect, useState } from 'react';
/**
 * Check if a notebook is trusted
 * @param notebook The notebook to check
 * @returns true if the notebook is trusted, false otherwise
 */
const isTrusted = (notebook) => {
    const model = notebook.model;
    if (!model) {
        return false;
    }
    const cells = Array.from(model.cells);
    let total = 0;
    let trusted = 0;
    for (const currentCell of cells) {
        if (currentCell.type !== 'code') {
            continue;
        }
        total++;
        if (currentCell.trusted) {
            trusted++;
        }
    }
    return trusted === total;
};
/**
 * A React component to display the Trusted badge in the menu bar.
 * @param notebook The Notebook
 * @param translator The Translation service
 */
const TrustedButton = ({ notebook, translator, }) => {
    const trans = translator.load('notebook');
    const [trusted, setTrusted] = useState(isTrusted(notebook));
    const checkTrust = () => {
        const v = isTrusted(notebook);
        setTrusted(v);
    };
    const trust = async () => {
        await NotebookActions.trust(notebook, translator);
        checkTrust();
    };
    useEffect(() => {
        notebook.modelContentChanged.connect(checkTrust);
        notebook.activeCellChanged.connect(checkTrust);
        checkTrust();
        return () => {
            notebook.modelContentChanged.disconnect(checkTrust);
            notebook.activeCellChanged.disconnect(checkTrust);
        };
    });
    return (React.createElement("button", { className: 'jp-NotebookTrustedStatus', style: !trusted ? { cursor: 'pointer' } : { cursor: 'help' }, onClick: () => !trusted && trust(), title: trusted
            ? trans.__('JavaScript enabled for notebook display')
            : trans.__('JavaScript disabled for notebook display') }, trusted ? trans.__('Trusted') : trans.__('Not Trusted')));
};
/**
 * A namespace for TrustedComponent static methods.
 */
export var TrustedComponent;
(function (TrustedComponent) {
    /**
     * Create a new TrustedComponent
     *
     * @param notebook The notebook
     * @param translator The translator
     */
    TrustedComponent.create = ({ notebook, translator, }) => {
        return ReactWidget.create(React.createElement(TrustedButton, { notebook: notebook, translator: translator }));
    };
})(TrustedComponent || (TrustedComponent = {}));
