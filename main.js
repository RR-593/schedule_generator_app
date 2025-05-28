const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const remoteMain = require('@electron/remote/main');
const { execFile } = require("child_process");


remoteMain.initialize();


function createWindow() {
  const win = new BrowserWindow({
    width: 1000,
    height: 650,
    frame: false,
    webPreferences: {
      nodeIntegration: true, // Enable Node.js integration if needed
      contextIsolation: true, // Disable context isolation if needed
      enableRemoteModule: true,
      preload: path.join(__dirname, "electron/preload.js"),
    },
  });

  remoteMain.enable(win.webContents);

  console.log("Main Window webContents ID:", win.webContents.id);

  win.loadURL('http://localhost:3000'); // Load your React app


  // Open the DevTools
  win.webContents.openDevTools();
}

app.whenReady().then(createWindow);

// IPC handler
ipcMain.handle("get-calendar-events", async () => {
  const scriptPath = path.join(__dirname, "scripts/getEvents.scpt");

  return new Promise((resolve, reject) => {
    execFile("osascript", [scriptPath], (error, stdout) => {
      if (error) return reject(error);
      const events = stdout
        .trim()
        .split(", ")
        .filter((e) => e.length > 0);
      resolve(events);
    });
  });
});


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
