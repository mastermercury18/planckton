// Copyright (c) Jupyter Development Team.
// Distributed under the terms of the Modified BSD License.

// Inspired by: https://github.com/jupyterlab/jupyterlab/blob/master/dev_mode/index.js

import { PageConfig, URLExt } from '@jupyterlab/coreutils';

import { PluginRegistry } from '@lumino/coreutils';

require('./style.js');
require('./extraStyle.js');

function loadScript(url) {
  return new Promise((resolve, reject) => {
    const newScript = document.createElement('script');
    newScript.onerror = reject;
    newScript.onload = resolve;
    newScript.async = true;
    document.head.appendChild(newScript);
    newScript.src = url;
  });
}
async function loadComponent(url, scope) {
  await loadScript(url);

  // From MIT-licensed https://github.com/module-federation/module-federation-examples/blob/af043acd6be1718ee195b2511adf6011fba4233c/advanced-api/dynamic-remotes/app1/src/App.js#L6-L12
  // eslint-disable-next-line no-undef
  await __webpack_init_sharing__('default');
  const container = window._JUPYTERLAB[scope];
  // Initialize the container, it may provide shared modules and may need ours
  // eslint-disable-next-line no-undef
  await container.init(__webpack_share_scopes__.default);
}

async function createModule(scope, module) {
  try {
    const factory = await window._JUPYTERLAB[scope].get(module);
    const instance = factory();
    instance.__scope__ = scope;
    return instance;
  } catch (e) {
    console.warn(
      `Failed to create module: package: ${scope}; module: ${module}`
    );
    throw e;
  }
}

/**
 * The main function
 */
async function main() {
  const mimeExtensionsMods = [
    require('@jupyterlab/javascript-extension'),
    require('@jupyterlab/json-extension'),
    require('@jupyterlab/pdf-extension'),
    require('@jupyterlab/vega5-extension'),
  ];
  const mimeExtensions = await Promise.all(mimeExtensionsMods);

  // Load the base plugins available on all pages
  let baseMods = [
      require('@jupyter-notebook/application-extension'),
  require('@jupyter-notebook/console-extension'),
  require('@jupyter-notebook/docmanager-extension'),
  require('@jupyter-notebook/documentsearch-extension'),
  require('@jupyter-notebook/help-extension'),
  require('@jupyter-notebook/notebook-extension'),
  require('@jupyter-notebook/terminal-extension'),
  
      require('@jupyterlab/application-extension').default.filter(({id}) => [
       '@jupyterlab/application-extension:commands',
'@jupyterlab/application-extension:context-menu',
'@jupyterlab/application-extension:faviconbusy',
'@jupyterlab/application-extension:router',
'@jupyterlab/application-extension:top-bar',
'@jupyterlab/application-extension:top-spacer',
      ].includes(id)),
      
      require('@jupyterlab/apputils-extension').default.filter(({id}) => [
       '@jupyterlab/apputils-extension:kernels-settings',
'@jupyterlab/apputils-extension:palette',
'@jupyterlab/apputils-extension:notification',
'@jupyterlab/apputils-extension:sanitizer',
'@jupyterlab/apputils-extension:sessionDialogs',
'@jupyterlab/apputils-extension:settings',
'@jupyterlab/apputils-extension:state',
'@jupyterlab/apputils-extension:themes',
'@jupyterlab/apputils-extension:themes-palette-menu',
'@jupyterlab/apputils-extension:toolbar-registry',
'@jupyterlab/apputils-extension:utilityCommands',
      ].includes(id)),
      require('@jupyterlab/codemirror-extension'),
  
      require('@jupyterlab/completer-extension').default.filter(({id}) => [
       '@jupyterlab/completer-extension:base-service',
'@jupyterlab/completer-extension:inline-completer',
'@jupyterlab/completer-extension:inline-completer-factory',
'@jupyterlab/completer-extension:inline-history',
'@jupyterlab/completer-extension:manager',
      ].includes(id)),
      
      require('@jupyterlab/console-extension').default.filter(({id}) => [
       '@jupyterlab/console-extension:cell-executor',
'@jupyterlab/console-extension:completer',
'@jupyterlab/console-extension:factory',
'@jupyterlab/console-extension:foreign',
'@jupyterlab/console-extension:tracker',
      ].includes(id)),
      require('@jupyterlab/csvviewer-extension'),
  
      require('@jupyterlab/docmanager-extension').default.filter(({id}) => [
       '@jupyterlab/docmanager-extension:plugin',
'@jupyterlab/docmanager-extension:download',
'@jupyterlab/docmanager-extension:contexts',
'@jupyterlab/docmanager-extension:manager',
      ].includes(id)),
      
      require('@jupyterlab/documentsearch-extension').default.filter(({id}) => [
       '@jupyterlab/documentsearch-extension:plugin',
      ].includes(id)),
      
      require('@jupyterlab/filebrowser-extension').default.filter(({id}) => [
       '@jupyterlab/filebrowser-extension:factory',
'@jupyterlab/filebrowser-extension:default-file-browser',
      ].includes(id)),
      
      require('@jupyterlab/fileeditor-extension').default.filter(({id}) => [
       '@jupyterlab/fileeditor-extension:plugin',
'@jupyterlab/fileeditor-extension:widget-factory',
      ].includes(id)),
      
      require('@jupyterlab/help-extension').default.filter(({id}) => [
       '@jupyterlab/help-extension:resources',
      ].includes(id)),
      require('@jupyterlab/htmlviewer-extension'),
  require('@jupyterlab/imageviewer-extension'),
  require('@jupyterlab/lsp-extension'),
  
      require('@jupyterlab/mainmenu-extension').default.filter(({id}) => [
       '@jupyterlab/mainmenu-extension:plugin',
      ].includes(id)),
      require('@jupyterlab/markedparser-extension'),
  require('@jupyterlab/mathjax-extension'),
  require('@jupyterlab/mermaid-extension'),
  
      require('@jupyterlab/notebook-extension').default.filter(({id}) => [
       '@jupyterlab/notebook-extension:cell-executor',
'@jupyterlab/notebook-extension:code-console',
'@jupyterlab/notebook-extension:export',
'@jupyterlab/notebook-extension:factory',
'@jupyterlab/notebook-extension:tracker',
'@jupyterlab/notebook-extension:widget-factory',
      ].includes(id)),
      require('@jupyterlab/pluginmanager-extension'),
  require('@jupyterlab/services-extension'),
  require('@jupyterlab/shortcuts-extension'),
  require('@jupyterlab/terminal-extension'),
  require('@jupyterlab/theme-light-extension'),
  require('@jupyterlab/theme-dark-extension'),
  require('@jupyterlab/theme-dark-high-contrast-extension'),
  require('@jupyterlab/translation-extension'),
  require('@jupyterlab/ui-components-extension'),
  require('@jupyterlab/hub-extension'),
  
  ];

  const page = `/${PageConfig.getOption('notebookPage')}`;
  switch (page) {
    // list all the other plugins grouped by page
    case '/tree': {
      baseMods = baseMods.concat([
        require('@jupyterlab/extensionmanager-extension'),
  
      require('@jupyterlab/filebrowser-extension').default.filter(({id}) => [
       '@jupyterlab/filebrowser-extension:browser',
'@jupyterlab/filebrowser-extension:download',
'@jupyterlab/filebrowser-extension:file-upload-status',
'@jupyterlab/filebrowser-extension:open-with',
'@jupyterlab/filebrowser-extension:search',
'@jupyterlab/filebrowser-extension:share-file',
      ].includes(id)),
      require('@jupyter-notebook/tree-extension'),
  
      require('@jupyterlab/running-extension').default.filter(({id}) => [
       '@jupyterlab/running-extension:plugin',
      ].includes(id)),
      require('@jupyterlab/settingeditor-extension'),
  
      ]);
      break;
    }
    // list all the other plugins grouped by page
    case '/notebooks': {
      baseMods = baseMods.concat([
        require('@jupyterlab/celltags-extension'),
  require('@jupyterlab/cell-toolbar-extension'),
  
      require('@jupyterlab/debugger-extension').default.filter(({id}) => [
       '@jupyterlab/debugger-extension:config',
'@jupyterlab/debugger-extension:main',
'@jupyterlab/debugger-extension:notebooks',
'@jupyterlab/debugger-extension:service',
'@jupyterlab/debugger-extension:sidebar',
'@jupyterlab/debugger-extension:sources',
      ].includes(id)),
      require('@jupyterlab/logconsole-extension'),
  require('@jupyterlab/metadataform-extension'),
  
      require('@jupyterlab/notebook-extension').default.filter(({id}) => [
       '@jupyterlab/notebook-extension:active-cell-tool',
'@jupyterlab/notebook-extension:completer',
'@jupyterlab/notebook-extension:copy-output',
'@jupyterlab/notebook-extension:metadata-editor',
'@jupyterlab/notebook-extension:search',
'@jupyterlab/notebook-extension:toc',
'@jupyterlab/notebook-extension:tools',
'@jupyterlab/notebook-extension:update-raw-mimetype',
      ].includes(id)),
      
      require('@jupyterlab/toc-extension').default.filter(({id}) => [
       '@jupyterlab/toc-extension:registry',
'@jupyterlab/toc-extension:tracker',
      ].includes(id)),
      
      require('@jupyterlab/tooltip-extension').default.filter(({id}) => [
       '@jupyterlab/tooltip-extension:manager',
'@jupyterlab/tooltip-extension:notebooks',
      ].includes(id)),
      
      ]);
      break;
    }
    // list all the other plugins grouped by page
    case '/consoles': {
      baseMods = baseMods.concat([
        
      require('@jupyterlab/tooltip-extension').default.filter(({id}) => [
       '@jupyterlab/tooltip-extension:manager',
'@jupyterlab/tooltip-extension:consoles',
      ].includes(id)),
      
      ]);
      break;
    }
    // list all the other plugins grouped by page
    case '/edit': {
      baseMods = baseMods.concat([
        
      require('@jupyterlab/fileeditor-extension').default.filter(({id}) => [
       '@jupyterlab/fileeditor-extension:completer',
'@jupyterlab/fileeditor-extension:search',
      ].includes(id)),
      require('@jupyterlab/markdownviewer-extension'),
  
      ]);
      break;
    }
  }

  // populate the list of disabled extensions
  const disabled = [];
  const availablePlugins = [];

  /**
   * Iterate over active plugins in an extension.
   *
   * #### Notes
   * This also populates the disabled
   */
  function* activePlugins(extension) {
    // Handle commonjs or es2015 modules
    let exports;
    if (Object.prototype.hasOwnProperty.call(extension, '__esModule')) {
      exports = extension.default;
    } else {
      // CommonJS exports.
      exports = extension;
    }

    let plugins = Array.isArray(exports) ? exports : [exports];
    for (let plugin of plugins) {
      const isDisabled = PageConfig.Extension.isDisabled(plugin.id);
      availablePlugins.push({
        id: plugin.id,
        description: plugin.description,
        requires: plugin.requires ?? [],
        optional: plugin.optional ?? [],
        provides: plugin.provides ?? null,
        autoStart: plugin.autoStart,
        enabled: !isDisabled,
        extension: extension.__scope__
      });
      if (isDisabled) {
        disabled.push(plugin.id);
        continue;
      }
      yield plugin;
    }
  }

  const extension_data = JSON.parse(
    PageConfig.getOption('federated_extensions')
  );

  const mods = [];
  const federatedExtensionPromises = [];
  const federatedMimeExtensionPromises = [];
  const federatedStylePromises = [];

  const extensions = await Promise.allSettled(
    extension_data.map(async data => {
      await loadComponent(
        `${URLExt.join(
          PageConfig.getOption('fullLabextensionsUrl'),
          data.name,
          data.load
        )}`,
        data.name
      );
      return data;
    })
  );

  extensions.forEach(p => {
    if (p.status === 'rejected') {
      // There was an error loading the component
      console.error(p.reason);
      return;
    }

    const data = p.value;
    if (data.extension) {
      federatedExtensionPromises.push(createModule(data.name, data.extension));
    }
    if (data.mimeExtension) {
      federatedMimeExtensionPromises.push(
        createModule(data.name, data.mimeExtension)
      );
    }
    if (data.style && !PageConfig.Extension.isDisabled(data.name)) {
      federatedStylePromises.push(createModule(data.name, data.style));
    }
  });

  // Add the base frontend extensions
  const baseFrontendMods = await Promise.all(baseMods);
  baseFrontendMods.forEach(p => {
    for (let plugin of activePlugins(p)) {
      mods.push(plugin);
    }
  });

  // Add the federated extensions.
  const federatedExtensions = await Promise.allSettled(
    federatedExtensionPromises
  );
  federatedExtensions.forEach(p => {
    if (p.status === 'fulfilled') {
      for (let plugin of activePlugins(p.value)) {
        mods.push(plugin);
      }
    } else {
      console.error(p.reason);
    }
  });

  // Add the federated mime extensions.
  const federatedMimeExtensions = await Promise.allSettled(
    federatedMimeExtensionPromises
  );
  federatedMimeExtensions.forEach(p => {
    if (p.status === 'fulfilled') {
      for (let plugin of activePlugins(p.value)) {
        mimeExtensions.push(plugin);
      }
    } else {
      console.error(p.reason);
    }
  });

  // Load all federated component styles and log errors for any that do not
  (await Promise.allSettled(federatedStylePromises))
    .filter(({ status }) => status === 'rejected')
    .forEach(({ reason }) => {
      console.error(reason);
    });

  // Set the list of base notebook multi-page plugins so the app is aware of all
  // its built-in plugins even if they are not loaded on the current page.
  // For example this is useful so the Settings Editor can list the debugger
  // plugin even if the debugger is only loaded on the notebook page.
  PageConfig.setOption('allPlugins', '{"/":{"@jupyter-notebook/application-extension":true,"@jupyter-notebook/console-extension":true,"@jupyter-notebook/docmanager-extension":true,"@jupyter-notebook/documentsearch-extension":true,"@jupyter-notebook/help-extension":true,"@jupyter-notebook/notebook-extension":true,"@jupyter-notebook/terminal-extension":true,"@jupyterlab/application-extension":["@jupyterlab/application-extension:commands","@jupyterlab/application-extension:context-menu","@jupyterlab/application-extension:faviconbusy","@jupyterlab/application-extension:router","@jupyterlab/application-extension:top-bar","@jupyterlab/application-extension:top-spacer"],"@jupyterlab/apputils-extension":["@jupyterlab/apputils-extension:kernels-settings","@jupyterlab/apputils-extension:palette","@jupyterlab/apputils-extension:notification","@jupyterlab/apputils-extension:sanitizer","@jupyterlab/apputils-extension:sessionDialogs","@jupyterlab/apputils-extension:settings","@jupyterlab/apputils-extension:state","@jupyterlab/apputils-extension:themes","@jupyterlab/apputils-extension:themes-palette-menu","@jupyterlab/apputils-extension:toolbar-registry","@jupyterlab/apputils-extension:utilityCommands"],"@jupyterlab/codemirror-extension":true,"@jupyterlab/completer-extension":["@jupyterlab/completer-extension:base-service","@jupyterlab/completer-extension:inline-completer","@jupyterlab/completer-extension:inline-completer-factory","@jupyterlab/completer-extension:inline-history","@jupyterlab/completer-extension:manager"],"@jupyterlab/console-extension":["@jupyterlab/console-extension:cell-executor","@jupyterlab/console-extension:completer","@jupyterlab/console-extension:factory","@jupyterlab/console-extension:foreign","@jupyterlab/console-extension:tracker"],"@jupyterlab/csvviewer-extension":true,"@jupyterlab/docmanager-extension":["@jupyterlab/docmanager-extension:plugin","@jupyterlab/docmanager-extension:download","@jupyterlab/docmanager-extension:contexts","@jupyterlab/docmanager-extension:manager"],"@jupyterlab/documentsearch-extension":["@jupyterlab/documentsearch-extension:plugin"],"@jupyterlab/filebrowser-extension":["@jupyterlab/filebrowser-extension:factory","@jupyterlab/filebrowser-extension:default-file-browser"],"@jupyterlab/fileeditor-extension":["@jupyterlab/fileeditor-extension:plugin","@jupyterlab/fileeditor-extension:widget-factory"],"@jupyterlab/help-extension":["@jupyterlab/help-extension:resources"],"@jupyterlab/htmlviewer-extension":true,"@jupyterlab/imageviewer-extension":true,"@jupyterlab/lsp-extension":true,"@jupyterlab/mainmenu-extension":["@jupyterlab/mainmenu-extension:plugin"],"@jupyterlab/markedparser-extension":true,"@jupyterlab/mathjax-extension":true,"@jupyterlab/mermaid-extension":true,"@jupyterlab/notebook-extension":["@jupyterlab/notebook-extension:cell-executor","@jupyterlab/notebook-extension:code-console","@jupyterlab/notebook-extension:export","@jupyterlab/notebook-extension:factory","@jupyterlab/notebook-extension:tracker","@jupyterlab/notebook-extension:widget-factory"],"@jupyterlab/pluginmanager-extension":true,"@jupyterlab/services-extension":true,"@jupyterlab/shortcuts-extension":true,"@jupyterlab/terminal-extension":true,"@jupyterlab/theme-light-extension":true,"@jupyterlab/theme-dark-extension":true,"@jupyterlab/theme-dark-high-contrast-extension":true,"@jupyterlab/translation-extension":true,"@jupyterlab/ui-components-extension":true,"@jupyterlab/hub-extension":true},"/tree":{"@jupyterlab/extensionmanager-extension":true,"@jupyterlab/filebrowser-extension":["@jupyterlab/filebrowser-extension:browser","@jupyterlab/filebrowser-extension:download","@jupyterlab/filebrowser-extension:file-upload-status","@jupyterlab/filebrowser-extension:open-with","@jupyterlab/filebrowser-extension:search","@jupyterlab/filebrowser-extension:share-file"],"@jupyter-notebook/tree-extension":true,"@jupyterlab/running-extension":["@jupyterlab/running-extension:plugin"],"@jupyterlab/settingeditor-extension":true},"/notebooks":{"@jupyterlab/celltags-extension":true,"@jupyterlab/cell-toolbar-extension":true,"@jupyterlab/debugger-extension":["@jupyterlab/debugger-extension:config","@jupyterlab/debugger-extension:main","@jupyterlab/debugger-extension:notebooks","@jupyterlab/debugger-extension:service","@jupyterlab/debugger-extension:sidebar","@jupyterlab/debugger-extension:sources"],"@jupyterlab/logconsole-extension":true,"@jupyterlab/metadataform-extension":true,"@jupyterlab/notebook-extension":["@jupyterlab/notebook-extension:active-cell-tool","@jupyterlab/notebook-extension:completer","@jupyterlab/notebook-extension:copy-output","@jupyterlab/notebook-extension:metadata-editor","@jupyterlab/notebook-extension:search","@jupyterlab/notebook-extension:toc","@jupyterlab/notebook-extension:tools","@jupyterlab/notebook-extension:update-raw-mimetype"],"@jupyterlab/toc-extension":["@jupyterlab/toc-extension:registry","@jupyterlab/toc-extension:tracker"],"@jupyterlab/tooltip-extension":["@jupyterlab/tooltip-extension:manager","@jupyterlab/tooltip-extension:notebooks"]},"/consoles":{"@jupyterlab/tooltip-extension":["@jupyterlab/tooltip-extension:manager","@jupyterlab/tooltip-extension:consoles"]},"/edit":{"@jupyterlab/fileeditor-extension":["@jupyterlab/fileeditor-extension:completer","@jupyterlab/fileeditor-extension:search"],"@jupyterlab/markdownviewer-extension":true}}');


  const pluginRegistry = new PluginRegistry();
  const NotebookApp = require('@jupyter-notebook/application').NotebookApp;

  pluginRegistry.registerPlugins(mods);
  const IServiceManager = require('@jupyterlab/services').IServiceManager;
  const serviceManager = await pluginRegistry.resolveRequiredService(IServiceManager);

  const app = new NotebookApp({
    pluginRegistry,
    serviceManager,
    mimeExtensions,
    availablePlugins
  });

  // Expose global app instance when in dev mode or when toggled explicitly.
  const exposeAppInBrowser =
    (PageConfig.getOption('exposeAppInBrowser') || '').toLowerCase() === 'true';

  if (exposeAppInBrowser) {
    window.jupyterapp = app;
  }

  await app.start();
}

window.addEventListener('load', main);
