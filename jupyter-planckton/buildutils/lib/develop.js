"use strict";
/* -----------------------------------------------------------------------------
| Copyright (c) Jupyter Development Team.
| Distributed under the terms of the Modified BSD License.
|----------------------------------------------------------------------------*/
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = __importDefault(require("commander"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
const process_1 = __importDefault(require("process"));
const buildutils_1 = require("@jupyterlab/buildutils");
commander_1.default
    .description('Setup the repository for develop mode')
    .option('--overwrite', 'Force linking the notebook schemas')
    .option('--source', 'The path to the notebook package')
    .action((options) => {
    var _a;
    const { overwrite } = options;
    const prefix = (0, buildutils_1.run)('python -c "import sys; print(sys.prefix)"', {
        stdio: 'pipe',
    }, true);
    const source = path_1.default.resolve((_a = options.source) !== null && _a !== void 0 ? _a : process_1.default.cwd());
    const sourceDir = path_1.default.join(source, 'notebook', 'schemas', '@jupyter-notebook');
    const destDir = path_1.default.join(prefix, 'share', 'jupyter', 'lab', 'schemas', '@jupyter-notebook');
    if (overwrite) {
        try {
            fs_extra_1.default.removeSync(destDir);
            console.log('Removed previous destination:', destDir);
        }
        catch (e) {
            console.info('Skip unlink', destDir);
        }
    }
    console.log('Symlinking:', sourceDir, destDir);
    fs_extra_1.default.symlinkSync(sourceDir, destDir, 'dir');
});
commander_1.default.parse(process_1.default.argv);
