import { app, BrowserWindow, ipcMain, Menu, MenuItem } from 'electron';
import path from 'node:path';

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 1000,
    minHeight: 650,
    frame: false,
    icon: path.join(process.cwd(), 'public/zero-music-favicon-lg.png'),
    webPreferences: {
      // nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(process.cwd(), 'preload.js')
    }
  });

  win.loadURL('http://localhost:5173');

  ipcMain.on('window-minimize', () => {
    win.minimize();
  });

  ipcMain.on('window-maximize', () => {
    if (win.isMaximized()) {
      win.unmaximize();
    } else {
      win.maximize();
    }
  });

  ipcMain.on('window-close', () => {
    win.close();
  });

  ipcMain.handle('show-context-menu', async (event, menuItems) => {
    const menu = new Menu();
    const submenu = new Menu();
    menuItems.forEach(item => {
      submenu.append(new MenuItem({
        label: item.label,
        click: () => {
          // Send result back to renderer
          win.webContents.send('menu-action-response', {
            playlistId: item.playlistId,
            trackId: item.trackId
          });
        }
      }));
    });
    menu.append(new MenuItem({
      label: 'Add to Playlist',
      submenu: submenu
    }));
    menu.popup({ window: BrowserWindow.fromWebContents(event.sender) });
  });

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
