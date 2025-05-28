const { app, BrowserWindow, ipcMain, ipcRenderer } = require('electron');
const path = require('path');
const isDev = require('electron-is-dev');

const remoteMain = require('@electron/remote/main');
const { execFile } = require("child_process");

const Database = require('better-sqlite3');
const db = new Database(path.join(__dirname, "data/data.db"));


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

  win.loadURL(
    isDev
      ? 'http://localhost:3000'
      : `file://${path.join(__dirname, '../build/index.html')}`
  );

  if (isDev) {
    win.webContents.openDevTools();
  }


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



const createTable = ({ tableName, columns }) => {
  const cols = columns.map(col => `${col.name} ${col.type}`).join(', ');
  const stmt = `CREATE TABLE IF NOT EXISTS ${tableName} (${cols})`;
  try {
    db.prepare(stmt).run();
    console.log(`Table ${tableName} created successfully.`);
  } catch (error) {
    console.error(`Error creating table: ${error.message}`);
  }

  const stmt11 = `DELETE FROM ${tableName}`;
  // db.prepare(stmt11).run();
}

createTable({
  tableName: 'events', columns: [
    { name: 'id', type: 'NUMBER PRIMARY KEY' },
    { name: 'name', type: 'TEXT' },
    { name: 'start', type: 'DATETIME' },
    { name: 'end', type: 'DATETIME' },
    { name: 'rep_set', type: 'TEXT' },
    { name: 'notes', type: 'TEXT' },
    { name: 'flags', type: 'TEXT' }
  ]
});

//
// 🧱 Create a table with specified columns
// columns: [{ name: 'id', type: 'TEXT PRIMARY KEY' }, { name: 'name', type: 'TEXT' }]
//
ipcMain.handle('create-table', (event, { tableName, columns }) => {
  return createTable(event, { tableName, columns })
});

//
// 📄 Select all rows from a given table
//
ipcMain.handle('select-all', (event, tableName) => {
  const stmt = `SELECT * FROM ${tableName} ORDER BY id`;
  const result = db.prepare(stmt).all();
  // console.log(result);
  return result;
});

//
// ➕ Insert a new row into a specified table
// data: { id: 'e1', name: 'Event Name', datetime: '2025-05-28T10:00:00' }
//
ipcMain.handle('insert-into', (event, { tableName, data }) => {
  console.log('ADDING data to ' + tableName);
  const columns = Object.keys(data).join(', ');
  const placeholders = Object.keys(data).map(() => '?').join(', ');
  const values = Object.values(data);


  console.log(placeholders);

  const stmt = `INSERT INTO ${tableName} (${columns}) VALUES (${placeholders})`;
  console.log(stmt);
  return db.prepare(stmt).run(values);
});

//
// 🔄 Update a row in a specified table using a where condition
// data: { name: 'New Name' }, where: { id: 'e1' }
//
ipcMain.handle('update-row', (event, { tableName, data, where }) => {
  const sets = Object.keys(data).map(k => `${k} = ?`).join(', ');
  const whereClause = Object.keys(where).map(k => `${k} = ?`).join(' AND ');

  const values = [...Object.values(data), ...Object.values(where)];
  const stmt = `UPDATE ${tableName} SET ${sets} WHERE ${whereClause}`;
  return db.prepare(stmt).run(...values);
});

//
// ❌ Delete a row from a specified table using a where condition
// where: { id: 'e1' }
//
ipcMain.handle('delete-row', (event, { tableName, where }) => {
  const whereClause = Object.keys(where).map(k => `${k} = ?`).join(' AND ');
  const stmt = `DELETE FROM ${tableName} WHERE ${whereClause}`;
  return db.prepare(stmt).run(...Object.values(where));
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
