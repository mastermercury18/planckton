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
const path = __importStar(require("path"));
const fs = __importStar(require("fs-extra"));
const buildutils_1 = require("@jupyterlab/buildutils");
/**
 * Ensure the application package resolutions.
 */
function ensureResolutions() {
    const basePath = path.resolve('.');
    const corePath = path.join(basePath, 'app', 'package.json');
    const corePackage = fs.readJSONSync(corePath);
    corePackage.resolutions = {};
    const packages = Object.keys(corePackage.dependencies).concat(corePackage.jupyterlab.singletonPackages);
    packages.forEach(async (name) => {
        let version = '';
        try {
            const data = require(`${name}/package.json`);
            version = data.version;
        }
        catch (_a) {
            const modulePath = require.resolve(name);
            const parentDir = path.dirname(path.dirname(modulePath));
            const data = require(path.join(parentDir, 'package.json'));
            version = data.version;
        }
        // Insist on a restricted version in the yarn resolution.
        corePackage.resolutions[name] = `~${version}`;
    });
    // Write the package.json back to disk.
    if ((0, buildutils_1.writePackageData)(corePath, corePackage)) {
        return ['Updated dev mode'];
    }
    return [];
}
if (require.main === module) {
    void ensureResolutions();
}
