"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postbump = exports.getPythonVersion = void 0;
const buildutils_1 = require("@jupyterlab/buildutils");
/**
 * Get the current version of notebook
 */
function getPythonVersion() {
    const cmd = 'hatch version';
    const lines = (0, buildutils_1.run)(cmd, { stdio: 'pipe' }, true).split('\n');
    return lines[lines.length - 1];
}
exports.getPythonVersion = getPythonVersion;
function postbump(commit = true) {
    // run the integrity
    (0, buildutils_1.run)('jlpm integrity');
    const newPyVersion = getPythonVersion();
    // Commit changes.
    if (commit) {
        (0, buildutils_1.run)(`git commit -am "Release ${newPyVersion}"`);
        (0, buildutils_1.run)(`git tag ${newPyVersion}`);
    }
}
exports.postbump = postbump;
