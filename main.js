const { app, BrowserWindow } = require('electron');
const path = require('path');
const remoteMain = require('@electron/remote/main');

remoteMain.initialize();

function createWindow() {
  const win = new BrowserWindow({
    width: 1000,
    height: 650,
    frame: false,
    webPreferences: {
      nodeIntegration: true, // Enable Node.js integration if needed
      contextIsolation: false, // Disable context isolation if needed
      enableRemoteModule: true,
    },
  });

  remoteMain.enable(win.webContents);

  win.loadURL('http://localhost:3000'); // Load your React app


  // Open the DevTools
  win.webContents.openDevTools();
}

app.whenReady().then(createWindow);


app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
