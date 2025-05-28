const { contextBridge, ipcRenderer } = require("electron");
const { getCurrentWindow } = require("@electron/remote");

contextBridge.exposeInMainWorld("calendarAPI", {
  getEvents: () => ipcRenderer.invoke("get-calendar-events"),
});

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