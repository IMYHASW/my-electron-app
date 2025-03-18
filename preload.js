/**
 * @Author: wujl
 * @Date: 2025-03-17 08:43:24
 * @Description: 预加载脚本
 * 
 * 预加载脚本包含在浏览器窗口加载网页之前运行的代码。 其可访问 DOM 接口和 Node.js 环境，并且经常在其中使用 contextBridge 接口将特权接口暴露给渲染器。
 * 由于主进程和渲染进程有着完全不同的分工，Electron 应用通常使用预加载脚本来设置进程间通信 (IPC) 接口以在两种进程之间传输任意信息。
 */

const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
  dbQuery: (sql, params) => ipcRenderer.invoke('db-query', { sql, params }),
  dbRun: (sql, params) => ipcRenderer.invoke('db-run', { sql, params }),
  dbRunTransactional: (operations) => ipcRenderer.invoke('db-run-transactional', operations)
})
