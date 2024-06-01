const { app, BrowserWindow } = require('electron');

function createWindow() {
    // Create the browser window.
    const win = new BrowserWindow({
        width: 1200,
        height: 800
    });

    // Load the index.html of the app.
    // Adjust the URL to where your Next.js app is hosted, localhost for development.
    win.loadURL('http://localhost:3000');

    // Open the DevTools.
    // win.webContents.openDevTools();
}

app.whenReady().then(() => {
    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});
