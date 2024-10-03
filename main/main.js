const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'), // Preload ako koristite IPC za sigurnosne razloge
      nodeIntegration: true, // Uključite Node integraciju
      contextIsolation: false, // Isključite izolaciju konteksta
    },
  });

  win.loadURL('http://localhost:3000'); // Pokreće React dev server
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
