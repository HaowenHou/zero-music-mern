const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
    close: () => ipcRenderer.send('window-close'),
    minimize: () => ipcRenderer.send('window-minimize'),
    maximize: () => ipcRenderer.send('window-maximize'),
    invokeContextMenu: (menuItems) => ipcRenderer.invoke('show-context-menu', menuItems),
    onMenuActionResponse: (callback) => ipcRenderer.on('menu-action-response', (event, args) => callback(args)),
    offMenuActionResponse: (callback) => ipcRenderer.removeAllListeners('menu-action-response')
});