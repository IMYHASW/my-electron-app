/**
 * @Author: wujl
 * @Date: 2025-03-17 08:43:24
 * @Description: 数据库操作模块 使用sqlite3模块
 */

const { app } = require('electron')
const path = require('path')
const sqlite3 = require('sqlite3').verbose()
const fs = require('fs')

// 获取数据库文件路径
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

// 初始化数据库
const initDatabase = () => {
const db = new sqlite3.Database(getDbPath())

module.exports = db

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
