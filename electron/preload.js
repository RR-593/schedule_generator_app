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
      selectAll: (tableName, order) => {
        if (typeof tableName === 'undefined') return;
        const result = ipcRenderer.invoke('select-all', tableName, order);
        // console.log(result);
        return result
      },

      // 📄 Select query rows from a table
      /**
       * Select query rows from a table
       *
       * @param {string} tableName - Name of the table to query
       * @param {Object} params - Optional query options
       * @param {string} [params.cols='*'] - Comma-separated list of columns to select
       * @param {string} [params.order] - SQL ORDER BY clause (e.g. 'created_at DESC')
       * @param {string} [params.where] - SQL WHERE condition (e.g. 'status = "active"')
       * @param {Object} [params.query] - Named parameters for WHERE clause (e.g. { status: 'active' })
       * @returns {Array<Object>} - Query result rows
       */
      select: (tableName, params) => {
        if (typeof tableName === 'undefined') return;
        const result = ipcRenderer.invoke('select', tableName, params);
        // console.log(result);
        return result
      },

      /**
       * Insert a row
       * @param {*} { tableName: 'events', data: { id: '123', name: 'golf' } }  
       * @returns 
       */
      insertInto: (params) => {
        if (typeof params === 'undefined') return;
        ipcRenderer.invoke('insert-into', params)
      },

      /**
       * Update row
       * @param {*} { tableName: 'events', data: { id: '123', name: 'golf' }, where: { id: '1' } }  
       * @returns 
       */
      updateRow: (params) => {
        if (typeof params === 'undefined') return;
        ipcRenderer.invoke('update-row', params)
      },

      /**
       * Delete from table
       * @param {*} { tableName: 'events', where: { id: '1' } }  
       * @returns 
       */
      deleteRow: (params) => {
        if (typeof params === 'undefined') return;
        ipcRenderer.invoke('delete-row', params)
      }
    }
  }
});
