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
    height: 950,
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
    { name: 'id', type: 'INTEGER PRIMARY KEY AUTOINCREMENT' },
    { name: 'calender_id', type: 'NUMBER' },
    { name: 'name', type: 'TEXT' },
    { name: 'rep_set', type: 'TEXT' },
    { name: 'rep_time', type: 'NUMBER' }, //ms
    { name: 'set_rest', type: 'NUMBER' },
    { name: 'total_time', type: 'NUMBER' },
    { name: 'frequency', type: 'NUMBER' },
    { name: 'item_order', type: 'NUMBER' },
    { name: 'start', type: 'DATETIME' },
    { name: 'end', type: 'DATETIME' },
    { name: 'note', type: 'TEXT' },
    { name: 'flags', type: 'TEXT' }
  ]
});

createTable({
  tableName: 'userGeneratedCalenders', columns: [
    { name: 'id', type: 'INTEGER PRIMARY KEY AUTOINCREMENT' },
    { name: 'name', type: 'TEXT' },
    { name: 'availablity', type: 'TEXT' },
    { name: 'rest_length', type: 'NUMBER' },
    { name: 'item_order', type: 'NUMBER' },
    { name: 'flags', type: 'TEXT' }
  ]
});


// const stmt = `INSERT INTO userGeneratedCalenders (id, name, availablity) VALUES (1,'dummyCal','[1,0,0,0,0,1,0]')`;
// db.prepare(stmt).run();

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
ipcMain.handle('select-all', (event, tableName, order) => {
  const hasOrder = typeof order === 'string' && order.trim() !== '';
  const stmt = `SELECT * FROM ${tableName}${hasOrder ? ` ORDER BY ${order}` : ''}`;

  const result = db.prepare(stmt).all();
  return result;
});

//
// 📄 Select 
//
ipcMain.handle('select', (event, tableName, params) => {
  const cols = params.cols || '';
  const order = params.order || '';
  const where = params.where || '';
  const query = params.query || '';
  const hasCols = typeof cols === 'string' && cols.trim() !== '';
  const hasOrder = typeof order === 'string' && order.trim() !== '';
  const hasWhere = typeof where === 'string' && where.trim() !== '';
  const hasQuery = typeof query === 'string' && query.trim() !== '';
  const stmt = `SELECT ${hasCols ? `${cols}` : '*'} FROM ${tableName}${hasWhere ? ` WHERE ${where}` : ``}${hasOrder ? ` ORDER BY ${order}` : ``}${hasQuery ? ` ${query}` : ``}`;
  // console.log(stmt);
  const result = db.prepare(stmt).all();
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
  console.log(values);
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
  try {
    console.log(Date.now());
    console.log(`Where: ${JSON.stringify(where)}`);
    console.log(data);
    return db.prepare(stmt).run(...values);
  } catch (e) {
    console.log(data);
    console.log(stmt);
    console.log(e);
  }
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
