const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("calendarAPI", {
  getEvents: () => ipcRenderer.invoke("get-calendar-events"),
});


const { getCurrentWindow } = require("@electron/remote");

contextBridge.exposeInMainWorld('electronAPI', {
  getCurrentWindow: () => {
    const win = getCurrentWindow();

    // Return a proxy with only the safe functions you want to expose
    return {
      close: () => win.close(),
      minimize: () => win.minimize(),
      maximize: () => win.maximize(),
      isMaximized: () => win.isMaximized(),
    };
  },
});


contextBridge.exposeInMainWorld('db', {
  // 🧱 Create a table
  createTable: (params) => ipcRenderer.invoke('create-table', params),

  // 📄 Select all rows from a table
  selectAll: (tableName) => ipcRenderer.invoke('select-all', tableName),

  // ➕ Insert a row
  insertInto: (params) => ipcRenderer.invoke('insert-into', params),

  // 🔄 Update a row
  updateRow: (params) => ipcRenderer.invoke('update-row', params),

  // ❌ Delete a row
  deleteRow: (params) => ipcRenderer.invoke('delete-row', params)
});
