const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')
const { initDatabase } = require('./src/db')

let mainWindow

// 初始化数据库
const db = initDatabase()

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true
    }
  })

  mainWindow.loadFile('index.html')
}

// IPC通信处理
ipcMain.handle('db-query', async (_, { sql, params }) => {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err.message)
      else resolve(rows)
    })
  })
})

ipcMain.handle('db-run', async (_, { sql, params }) => {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function(err) {
      if (err) reject(err.message)
      else resolve({ lastID: this.lastID, changes: this.changes })
    })
  })
})

app.whenReady().then(createWindow)

// 关闭数据库连接
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    db.close()
    app.quit()
  }
})
