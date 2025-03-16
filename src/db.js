/*
 * @Author: wuxiaopang 2540729242@qq.com
 * @Date: 2025-03-16 19:43:24
 * @LastEditors: wuxiaopang 2540729242@qq.com
 * @LastEditTime: 2025-03-16 20:31:41
 * @FilePath: \my-electron-app\src\db.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
const { app } = require('electron')
const path = require('path')
const sqlite3 = require('sqlite3').verbose()
const fs = require('fs')

const getDbPath = () => {
  const basePath = app.isPackaged 
    ? path.join(app.getAppPath(), '../db') 
    : path.join(__dirname, '../db')
  
  const dbDir = path.join(basePath)
  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true })
  }
  
  return path.join(basePath, 'appdata.db')
}

const initDatabase = () => {
// C:\Users\<用户名>\AppData\Roaming\<应用名>\data.db
//   const dbPath = path.join(app.getPath('userData'), 'appdata.db') 



const db = new sqlite3.Database(getDbPath())

module.exports = db



//   const db = new sqlite3.Database(dbPath)
  // 初始化表结构
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
    
    CREATE TABLE IF NOT EXISTS posts (
      id INTEGER PRIMARY KEY,
      user_id INTEGER,
      content TEXT,
      FOREIGN KEY(user_id) REFERENCES users(id)
    );
  `)

  return db
}

module.exports = { initDatabase }
