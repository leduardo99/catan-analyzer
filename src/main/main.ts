import { app, BrowserWindow, ipcMain, screen } from 'electron';
import * as path from 'path';

let mainWindow: BrowserWindow | null = null;

function createWindow() {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;

  mainWindow = new BrowserWindow({
    width: 400,
    height: 600,
    x: width - 420,
    y: 20,
    frame: false,
    transparent: true,
    alwaysOnTop: true,
    resizable: false,
    skipTaskbar: false,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  // Load the app
  const isDev = !app.isPackaged;

  if (isDev) {
    // Try different ports in sequence
    const tryPort = async (port: number): Promise<void> => {
      try {
        await mainWindow!.loadURL(`http://localhost:${port}`);
      } catch (err) {
        if (port < 5180) {
          await tryPort(port + 1);
        } else {
          console.error('Could not connect to Vite dev server');
        }
      }
    };

    tryPort(5173);
    mainWindow.webContents.openDevTools({ mode: 'detach' });
  } else {
    mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'));
  }

  mainWindow.setIgnoreMouseEvents(false);

  mainWindow.on('closed', () => {
    mainWindow = null;
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

// IPC Handlers
ipcMain.handle('capture-screenshot', async () => {
  const screenshot = require('screenshot-desktop');
  try {
    const imgBuffer = await screenshot({ format: 'png' });
    return imgBuffer.toString('base64');
  } catch (error) {
    console.error('Screenshot error:', error);
    throw error;
  }
});

ipcMain.handle('toggle-overlay', (event, isVisible: boolean) => {
  if (mainWindow) {
    mainWindow.setIgnoreMouseEvents(!isVisible);
  }
});

ipcMain.handle('minimize-window', () => {
  if (mainWindow) {
    mainWindow.minimize();
  }
});

ipcMain.handle('close-window', () => {
  if (mainWindow) {
    mainWindow.close();
  }
});
