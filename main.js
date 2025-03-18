/**
 * @Author: wujl
 * @Date: 2025-03-17 08:43:24
 * @Description: 主进程连接数据库
 */

const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { initDatabase } = require('./src/db');

let mainWindow;

// 初始化数据库
const db = initDatabase();

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true
    }
  });

  mainWindow.loadFile('index.html');
}

// IPC通信处理
ipcMain.handle('db-query', async (_, { sql, params }) => {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err.message);
      else resolve(rows);
    });
  });
});

ipcMain.handle('db-run', async (_, { sql, params }) => {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function(err) {
      if (err) reject(err.message)
      else resolve({ lastID: this.lastID, changes: this.changes })
    })
  })
})

//事务控制
ipcMain.handle('db-run-transactional', async (_, operations) => {
  return new Promise((resolve, reject) => {
    if (!Array.isArray(operations) || operations.length === 0) {
      console.error('arrays of operations is empty');
      return reject('arrays of operations is empty');
    }

    db.run("BEGIN", (beginErr) => {
      if (beginErr) {
        console.error('transaction begin faill:', beginErr.message);
        return reject(beginErr.message);
      }
      console.log("transaction begin");

      const executeNext = (index) => {
        if (index >= operations.length) {
          // 所有操作执行完毕，提交事务
          db.run("COMMIT", (commitErr) => {
            if (commitErr) {
              console.error('transaction commit faill:', commitErr.message);
              return reject(commitErr.message);
            }
            console.log("transaction commit");
            resolve({ success: true });
          });
          return;
        }

        const { sql, params } = operations[index];
        console.log(sql, params);
        db.run(sql, params, function (err) {
          if (err) {
            // 出现错误时回滚事务
            db.run("ROLLBACK", (rollbackErr) => {
              if (rollbackErr) {
                console.error('transaction rollback faill:', rollbackErr.message);
              }
            });
            console.error('The SQL execution failed:', err.message);
            return reject(err.message);
          }
          // 执行下一个操作
          executeNext(index + 1);
        });
      };

      // 开始执行第一个操作
      executeNext(0);
    });
  });
});

app.whenReady().then(createWindow);

// 关闭数据库连接
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    db.close();
    app.quit();
  }
});

// 在主进程添加全局错误监听
process.on('uncaughtException', (err) => {
  console.error('Exception:', err);
  mainWindow.webContents.send('global-error', err.message);
});