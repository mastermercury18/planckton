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
 * Inspired by: https://github.com/jupyterlab/jupyterlab/blob/master/buildutils/src/bumpversion.ts
 */
const utils = __importStar(require("@jupyterlab/buildutils"));
const commander_1 = __importDefault(require("commander"));
const utils_1 = require("./utils");
// Specify the program signature.
commander_1.default
    .description('Update the version')
    .option('--dry-run', 'Dry run')
    .option('--force', 'Force the upgrade')
    .option('--skip-commit', 'Whether to skip commit changes')
    .arguments('<spec>')
    .action((spec, opts) => {
    // Get the previous version.
    const prev = (0, utils_1.getPythonVersion)();
    const isFinal = /\d+\.\d+\.\d+$/.test(prev);
    // Whether to commit after bumping
    const commit = opts.skipCommit !== true;
    // for "next", determine whether to use "patch" or "build"
    if (spec === 'next') {
        spec = isFinal ? 'patch' : 'build';
    }
    // For patch, defer to `patch:release` command
    if (spec === 'patch') {
        let cmd = 'jlpm run release:patch';
        if (opts.force) {
            cmd += ' --force';
        }
        if (!commit) {
            cmd += ' --skip-commit';
        }
        utils.run(cmd);
        process.exit(0);
    }
    // Make sure we have a valid version spec.
    const options = ['major', 'minor', 'release', 'build'];
    if (options.indexOf(spec) === -1) {
        throw new Error(`Version spec must be one of: ${options}`);
    }
    if (isFinal && spec === 'build') {
        throw new Error('Cannot increment a build on a final release');
    }
    // Run pre-bump script.
    utils.prebump();
    // Handle dry runs.
    if (opts.dryRun) {
        return;
    }
    // If this is a major release during the alpha cycle, bump
    // just the Python version.
    if (prev.indexOf('a') !== -1 && spec === 'major') {
        // Bump the version.
        utils.run(`hatch version ${spec}`);
        // Run the post-bump script.
        (0, utils_1.postbump)(commit);
        return;
    }
    // Determine the version spec to use for lerna.
    let lernaVersion = 'preminor';
    if (spec === 'build') {
        lernaVersion = 'prerelease';
        // a -> b
    }
    else if (spec === 'release' && prev.indexOf('a') !== -1) {
        lernaVersion = 'prerelease --preid=beta';
        // b -> rc
    }
    else if (spec === 'release' && prev.indexOf('b') !== -1) {
        lernaVersion = 'prerelease --preid=rc';
        // rc -> final
    }
    else if (spec === 'release' && prev.indexOf('rc') !== -1) {
        lernaVersion = 'patch';
    }
    if (lernaVersion === 'preminor') {
        lernaVersion += ' --preid=alpha';
    }
    let cmd = `jlpm run lerna version --force-publish --no-push --no-git-tag-version ${lernaVersion}`;
    if (opts.force) {
        cmd += ' --yes';
    }
    // For a preminor release, we bump 10 minor versions so that we do
    // not conflict with versions during minor releases of the top
    // level package.
    if (lernaVersion === 'preminor') {
        for (let i = 0; i < 10; i++) {
            utils.run(cmd);
        }
    }
    else {
        utils.run(cmd);
    }
    // Bump the version.
    let pySpec = spec;
    if (spec === 'release') {
        if (prev.indexOf('a') !== -1) {
            pySpec = 'beta';
        }
        else if (prev.indexOf('b') !== -1) {
            pySpec = 'rc';
        }
        else if (prev.indexOf('rc') !== -1) {
            pySpec = 'release';
        }
        else {
            pySpec = 'alpha';
        }
    }
    else if (spec === 'build') {
        if (prev.indexOf('a') !== -1) {
            pySpec = 'a';
        }
        else if (prev.indexOf('b') !== -1) {
            pySpec = 'b';
        }
        else if (prev.indexOf('rc') !== -1) {
            pySpec = 'rc';
        }
    }
    else if (spec === 'major' || spec === 'minor') {
        if (prev.indexOf('a') !== -1) {
            pySpec = `${spec},beta`;
        }
        else if (prev.indexOf('b') !== -1) {
            pySpec = `${spec},rc`;
        }
        else if (prev.indexOf('rc') !== -1) {
            pySpec = `${spec},release`;
        }
        else {
            pySpec = `${spec},alpha`;
        }
    }
    utils.run(`hatch version ${pySpec}`);
    // Run the post-bump script.
    (0, utils_1.postbump)(commit);
});
commander_1.default.parse(process.argv);
