import { ReactWidget } from '@jupyterlab/apputils';
import React from 'react';
export class PlancktonDebugWidget extends ReactWidget {
    render() {
        return (React.createElement("div", { style: { padding: 20, background: 'yellow', color: 'black', fontWeight: 'bold' } }, "Hello from Planckton Debug Widget!"));
    }
}
