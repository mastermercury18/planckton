"use strict";
/* -----------------------------------------------------------------------------
| Copyright (c) Jupyter Development Team.
| Distributed under the terms of the Modified BSD License.
|----------------------------------------------------------------------------*/
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Inspired by: https://github.com/jupyterlab/jupyterlab/blob/master/buildutils/src/patch-release.ts
 */
const utils = __importStar(require("@jupyterlab/buildutils"));
const commander_1 = __importDefault(require("commander"));
const utils_1 = require("./utils");
// Specify the program signature.
commander_1.default
    .description('Create a patch release')
    .option('--force', 'Force the upgrade')
    .option('--skip-commit', 'Whether to skip commit changes')
    .action((options) => {
    // Make sure we can patch release.
    const pyVersion = (0, utils_1.getPythonVersion)();
    if (pyVersion.includes('a') ||
        pyVersion.includes('b') ||
        pyVersion.includes('rc')) {
        throw new Error('Can only make a patch release from a final version');
    }
    // Run pre-bump actions.
    utils.prebump();
    // Patch the python version
    utils.run('hatch version patch');
    // Version the changed
    let cmd = 'jlpm run lerna version patch --no-push --force-publish --no-git-tag-version';
    if (options.force) {
        cmd += ' --yes';
    }
    utils.run(cmd);
    // Whether to commit after bumping
    const commit = options.skipCommit !== true;
    (0, utils_1.postbump)(commit);
});
commander_1.default.parse(process.argv);
