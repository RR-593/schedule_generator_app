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

contextBridge.exposeInMainWorld('globalVars', {
});


contextBridge.exposeInMainWorld('db', {
  dataBaseFns: () => {

    return {
      // 🧱 Create a table
      /**
       * 
       * @param {*} { tableName: String, columns: [{ name: 'name', type: 'TEXT' }] } 
       * @returns 
       */
      createTable: (params) => {
        if (typeof params === 'undefined') return;
        return ipcRenderer.invoke('create-table', params)
      },

      // 📄 Select all rows from a table
      selectAll: (tableName) => {
        if (typeof tableName === 'undefined') return;
        const result = ipcRenderer.invoke('select-all', tableName);
        // console.log(result);
        return result
      },

      /**
       * Insert a row
       * @param {*} { tableName: String, data: { id: '123', name: 'golf' } }  
       * @returns 
       */
      insertInto: (params) => {
        if (typeof params === 'undefined') return;
        ipcRenderer.invoke('insert-into', params)
      },

      // 🔄 Update a row
      updateRow: (params) => {
        if (typeof params === 'undefined') return;
        ipcRenderer.invoke('update-row', params)
      },

      // ❌ Delete a row
      deleteRow: (params) => {
        if (typeof params === 'undefined') return;
        ipcRenderer.invoke('delete-row', params)
      }
    }
  }
});
