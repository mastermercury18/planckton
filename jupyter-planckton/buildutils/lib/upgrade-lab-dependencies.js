"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const PACKAGE_JSON_PATHS = [
    'app/package.json',
    'buildutils/package.json',
    'package.json',
    'packages/application-extension/package.json',
    'packages/application/package.json',
    'packages/console-extension/package.json',
    'packages/docmanager-extension/package.json',
    'packages/documentsearch-extension/package.json',
    'packages/help-extension/package.json',
    'packages/lab-extension/package.json',
    'packages/notebook-extension/package.json',
    'packages/terminal-extension/package.json',
    'packages/tree-extension/package.json',
    'packages/tree/package.json',
    'packages/ui-components/package.json',
    'ui-tests/package.json',
];
const DEPENDENCY_GROUP = '@jupyterlab';
function parseVersion(version) {
    const match = version.match(/^(\d+)\.(\d+)\.(\d+)(?:(a|b|rc)(\d+))?$/);
    if (!match) {
        throw new Error(`Invalid version format: ${version}`);
    }
    const [, major, minor, patch, type, preVersion] = match;
    const baseVersion = {
        major: parseInt(major, 10),
        minor: parseInt(minor, 10),
        patch: parseInt(patch, 10),
    };
    if (type && preVersion) {
        return {
            ...baseVersion,
            preRelease: `${type}${preVersion}`,
        };
    }
    return baseVersion;
}
function getVersionRange(version) {
    var _a;
    const baseVersion = `${version.major}.${version.minor}.${version.patch}${(_a = version.preRelease) !== null && _a !== void 0 ? _a : ''}`;
    return `>=${baseVersion},<${version.major}.${version.minor + 1}`;
}
function updateVersionInFile(filePath, pattern, version) {
    const content = fs_1.default.readFileSync(filePath, 'utf-8');
    const versionRange = getVersionRange(version);
    const updatedContent = content.replace(pattern, `$1${versionRange}`);
    fs_1.default.writeFileSync(filePath, updatedContent);
}
async function updatePackageJson(newVersion) {
    const url = `https://raw.githubusercontent.com/jupyterlab/jupyterlab/v${newVersion}/jupyterlab/staging/package.json`;
    const response = await fetch(url);
    if (!response.ok) {
        const errorMessage = `Failed to fetch package.json from ${url}. HTTP status code: ${response.status}`;
        throw new Error(errorMessage);
    }
    // fetch the new galata version
    const galataUrl = `https://raw.githubusercontent.com/jupyterlab/jupyterlab/v${newVersion}/galata/package.json`;
    const galataResponse = await fetch(galataUrl);
    if (!galataResponse.ok) {
        const errorMessage = `Failed to fetch galata/package.json from ${galataUrl}. HTTP status code: ${galataResponse.status}`;
        throw new Error(errorMessage);
    }
    const newPackageJson = await response.json();
    const galataPackageJson = await galataResponse.json();
    for (const packageJsonPath of PACKAGE_JSON_PATHS) {
        const filePath = path_1.default.resolve(packageJsonPath);
        const existingPackageJson = JSON.parse(fs_1.default.readFileSync(filePath, 'utf-8'));
        const newDependencies = {
            ...newPackageJson.devDependencies,
            ...newPackageJson.resolutions,
            [galataPackageJson.name]: galataPackageJson.version,
        };
        updateDependencyVersion(existingPackageJson, newDependencies);
        fs_1.default.writeFileSync(filePath, JSON.stringify(existingPackageJson, null, 2) + '\n');
    }
}
function updateDependencyVersion(existingJson, newJson) {
    if (!existingJson) {
        return;
    }
    const sectionPaths = [
        'resolutions',
        'dependencies',
        'devDependencies',
    ];
    for (const section of sectionPaths) {
        if (!existingJson[section]) {
            continue;
        }
        const updated = existingJson[section];
        for (const [pkg, version] of Object.entries(existingJson[section])) {
            if (pkg.startsWith(DEPENDENCY_GROUP) && pkg in newJson) {
                if (version[0] === '^' || version[0] === '~') {
                    updated[pkg] = version[0] + absoluteVersion(newJson[pkg]);
                }
                else {
                    updated[pkg] = absoluteVersion(newJson[pkg]);
                }
            }
        }
    }
}
function absoluteVersion(version) {
    if (version.length > 0 && (version[0] === '^' || version[0] === '~')) {
        return version.substring(1);
    }
    return version;
}
const versionPattern = /(jupyterlab)(>=[\d.]+(?:[a|b|rc]\d+)?,<[\d.]+)/g;
const FILES_TO_UPDATE = ['pyproject.toml', '.pre-commit-config.yaml'];
async function upgradeLabDependencies() {
    const args = process.argv.slice(2);
    if (args.length < 2) {
        throw new Error('Please provide the set-version flag and version');
    }
    const version = parseVersion(args[1]);
    await updatePackageJson(args[1]); // Keep original string version for package.json
    for (const file of FILES_TO_UPDATE) {
        updateVersionInFile(path_1.default.resolve(file), versionPattern, version);
    }
}
upgradeLabDependencies();
