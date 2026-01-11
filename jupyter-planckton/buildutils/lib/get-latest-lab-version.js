"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs-extra"));
const semver = __importStar(require("semver"));
function convertPythonVersion(version) {
    return version
        .replace('a', '-alpha')
        .replace('b', '-beta')
        .replace('rc', '-rc');
}
function extractVersionFromReleases(releases, versionTag, currentVersion) {
    const npmCurrentVersion = convertPythonVersion(currentVersion);
    const isCurrentPreRelease = semver.prerelease(npmCurrentVersion) !== null;
    if (versionTag === 'latest') {
        // Find first version that is newer than current and matches pre-release criteria
        const release = releases.find((r) => {
            const version = r['tag_name'].substring(1); // Remove 'v' prefix for semver
            const npmVersion = convertPythonVersion(version);
            return ((isCurrentPreRelease || !r['prerelease']) &&
                semver.gte(npmVersion, npmCurrentVersion));
        });
        return release ? release['tag_name'] : null;
    }
    else {
        // Find exact version match
        const release = releases.find((r) => r['tag_name'] === versionTag);
        return release ? release['tag_name'] : null;
    }
}
function extractCurrentJupyterLabVersion() {
    const toml = fs.readFileSync('pyproject.toml', 'utf8');
    const match = toml.match(/jupyterlab>=([^,]+)/);
    if (!match) {
        throw new Error('Could not find JupyterLab version in pyproject.toml');
    }
    return match[1];
}
async function findVersion(versionTag) {
    const url = 'https://api.github.com/repos/jupyterlab/jupyterlab/releases';
    const response = await fetch(url);
    if (!response.ok) {
        const error_message = `Failed to fetch package.json from ${url}. HTTP status code: ${response.status}`;
        throw new Error(error_message);
    }
    const currentVersion = extractCurrentJupyterLabVersion();
    const releases = await response.json();
    const version = extractVersionFromReleases(releases, versionTag, currentVersion);
    if (version === null) {
        const error_message = 'Invalid release tag';
        throw new Error(error_message);
    }
    return version.substring(1);
}
async function getLatestLabVersion() {
    const args = process.argv.slice(2);
    if (args.length !== 2 || args[0] !== '--set-version') {
        console.error('Usage: node script.js --set-version <version>');
        process.exit(1);
    }
    const version_tag = args[1];
    try {
        const result = await findVersion(version_tag);
        console.log(result);
    }
    catch (error) {
        console.error('Error:', error.message);
        process.exit(1);
    }
}
getLatestLabVersion();
