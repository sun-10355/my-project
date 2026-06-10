import { app, BrowserWindow, ipcMain, Notification, Tray, Menu, dialog, nativeImage } from 'electron'
import * as path from 'path'

let mainWindow: BrowserWindow | null = null
let tray: Tray | null = null
let isQuitting = false

// 数据库引用 (在 preload 中初始化)
let db: any = null
let dbPath = ''

function getDbPath(): string {
  const userDataPath = app.getPath('userData')
  return path.join(userDataPath, 'pomodoro.db')
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 900,
    height: 640,
    minWidth: 700,
    minHeight: 500,
    frame: false,
    backgroundColor: '#09090b',
    titleBarStyle: 'hidden',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
    icon: path.join(__dirname, '..', 'assets', 'icon.png'),
  })

  // 开发模式加载 Vite dev server
  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadURL('http://localhost:5173')
    mainWindow.webContents.openDevTools({ mode: 'detach' })
  } else {
    // 生产模式加载打包后的文件
    mainWindow.loadFile(path.join(__dirname, '..', 'dist', 'index.html'))
  }

  mainWindow.on('close', (e) => {
    if (!isQuitting) {
      e.preventDefault()
      mainWindow?.hide()
    }
  })
}

function createTray() {
  // 创建一个 16x16 的图标作为托盘图标
  const icon = nativeImage.createEmpty()
  tray = new Tray(icon.resize({ width: 16, height: 16 }))

  const contextMenu = Menu.buildFromTemplate([
    {
      label: '显示主窗口',
      click: () => {
        mainWindow?.show()
        mainWindow?.focus()
      },
    },
    { type: 'separator' },
    {
      label: '退出',
      click: () => {
        isQuitting = true
        app.quit()
      },
    },
  ])

  tray.setToolTip('番茄钟')
  tray.setContextMenu(contextMenu)

  tray.on('double-click', () => {
    mainWindow?.show()
    mainWindow?.focus()
  })
}

// ====== IPC Handlers ======

function setupIPC() {
  // --- 数据库操作 ---

  // Sessions
  ipcMain.handle('db:sessions:insert', async (_event, session) => {
    try {
      db.run(
        `INSERT INTO sessions (task_id, type, duration_minutes, started_at, ended_at, completed, interrupted)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          session.task_id || null,
          session.type,
          session.duration_minutes,
          session.started_at,
          session.ended_at || null,
          session.completed,
          session.interrupted,
        ]
      )
      const result = db.exec('SELECT last_insert_rowid() as id')
      const id = result[0]?.values[0]?.[0] as number
      saveDb()
      return id
    } catch (e) {
      console.error('insert session error:', e)
      return null
    }
  })

  ipcMain.handle('db:sessions:getById', (_event, id) => {
    const result = db.exec('SELECT * FROM sessions WHERE id = ?', [id])
    return result[0]?.values?.[0] ? rowToObject(result[0].columns, result[0].values[0]) : null
  })

  ipcMain.handle('db:sessions:getByDate', (_event, date) => {
    const result = db.exec(
      "SELECT * FROM sessions WHERE date(started_at) = date(?) ORDER BY started_at DESC",
      [date]
    )
    return resultToArray(result)
  })

  ipcMain.handle('db:sessions:getRange', (_event, start, end) => {
    const result = db.exec(
      'SELECT * FROM sessions WHERE started_at >= ? AND started_at <= ? ORDER BY started_at DESC',
      [start, end]
    )
    return resultToArray(result)
  })

  ipcMain.handle('db:sessions:getDailyStats', (_event, days) => {
    const result = db.exec(
      `SELECT
        date(started_at) as date,
        COUNT(CASE WHEN type = 'work' AND completed = 1 THEN 1 END) as pomodoros,
        COALESCE(SUM(CASE WHEN type = 'work' AND completed = 1 THEN duration_minutes ELSE 0 END), 0) as work_minutes
      FROM sessions
      WHERE started_at >= date('now', ?)
      GROUP BY date(started_at)
      ORDER BY date ASC`,
      [`-${days} days`]
    )
    return resultToArray(result)
  })

  ipcMain.handle('db:sessions:getOverview', () => {
    const today = db.exec(
      `SELECT
        COUNT(CASE WHEN type = 'work' AND completed = 1 THEN 1 END) as pomodoros,
        COALESCE(SUM(CASE WHEN type = 'work' AND completed = 1 THEN duration_minutes ELSE 0 END), 0) as work_minutes
      FROM sessions WHERE date(started_at) = date('now')`
    )
    const week = db.exec(
      `SELECT
        COUNT(CASE WHEN type = 'work' AND completed = 1 THEN 1 END) as pomodoros,
        COALESCE(SUM(CASE WHEN type = 'work' AND completed = 1 THEN duration_minutes ELSE 0 END), 0) as work_minutes
      FROM sessions WHERE started_at >= date('now', '-7 days')`
    )
    const month = db.exec(
      `SELECT
        COUNT(CASE WHEN type = 'work' AND completed = 1 THEN 1 END) as pomodoros
      FROM sessions WHERE started_at >= date('now', '-30 days')`
    )
    const total = db.exec(
      `SELECT COALESCE(SUM(CASE WHEN type = 'work' AND completed = 1 THEN duration_minutes ELSE 0 END), 0) as total_minutes
      FROM sessions`
    )

    const tRow = today[0]?.values?.[0]
    const wRow = week[0]?.values?.[0]
    const mRow = month[0]?.values?.[0]
    const totalRow = total[0]?.values?.[0]

    return {
      today_pomodoros: tRow?.[0] || 0,
      today_work_minutes: tRow?.[1] || 0,
      week_pomodoros: wRow?.[0] || 0,
      week_work_minutes: wRow?.[1] || 0,
      month_pomodoros: mRow?.[0] || 0,
      total_hours: ((totalRow?.[0] as number) || 0) / 60,
    }
  })

  // Tasks
  ipcMain.handle('db:tasks:getAll', () => {
    const result = db.exec('SELECT * FROM tasks ORDER BY created_at DESC')
    return resultToArray(result)
  })

  ipcMain.handle('db:tasks:insert', (_event, task) => {
    db.run(
      `INSERT INTO tasks (title, description, tag, status, estimated_pomodoros, completed_pomodoros, created_at, completed_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        task.title,
        task.description || '',
        task.tag || '',
        task.status || 'todo',
        task.estimated_pomodoros || 0,
        task.completed_pomodoros || 0,
        task.created_at,
        task.completed_at || null,
      ]
    )
    const result = db.exec('SELECT last_insert_rowid() as id')
    saveDb()
    return result[0]?.values[0]?.[0] as number
  })

  ipcMain.handle('db:tasks:update', (_event, id, updates) => {
    const setClauses: string[] = []
    const values: any[] = []
    for (const [key, value] of Object.entries(updates)) {
      setClauses.push(`${key} = ?`)
      values.push(value)
    }
    values.push(id)
    db.run(`UPDATE tasks SET ${setClauses.join(', ')} WHERE id = ?`, values)
    saveDb()
  })

  ipcMain.handle('db:tasks:delete', (_event, id) => {
    db.run('DELETE FROM tasks WHERE id = ?', [id])
    saveDb()
  })

  // Settings
  ipcMain.handle('db:settings:get', (_event, key) => {
    const result = db.exec('SELECT value FROM settings WHERE key = ?', [key])
    return result[0]?.values?.[0]?.[0] || null
  })

  ipcMain.handle('db:settings:set', (_event, key, value) => {
    db.run('INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)', [key, value])
    saveDb()
  })

  ipcMain.handle('db:settings:getAll', () => {
    const result = db.exec('SELECT key, value FROM settings')
    if (!result[0]) return {}
    const obj: Record<string, string> = {}
    for (const row of result[0].values) {
      obj[row[0] as string] = row[1] as string
    }
    return obj
  })

  // --- 应用功能 ---

  ipcMain.on('app:notify', (_event, title, body) => {
    if (Notification.isSupported()) {
      new Notification({ title, body }).show()
    }
  })

  ipcMain.on('app:setTray', (_event, text) => {
    if (tray) {
      tray.setToolTip(text || '番茄钟')
    }
  })

  ipcMain.on('app:minimizeToTray', () => {
    mainWindow?.hide()
  })

  ipcMain.on('app:minimize', () => {
    mainWindow?.minimize()
  })

  ipcMain.on('app:maximize', () => {
    if (mainWindow?.isMaximized()) {
      mainWindow.unmaximize()
    } else {
      mainWindow?.maximize()
    }
  })

  ipcMain.on('app:close', () => {
    mainWindow?.close()
  })

  ipcMain.handle('app:getVersion', () => {
    return app.getVersion()
  })

  // 对话框 - 导出文件
  ipcMain.handle('dialog:exportFile', async (_event, data, defaultName, ext) => {
    if (!mainWindow) return false
    const filters = ext === 'csv'
      ? [{ name: 'CSV 文件', extensions: ['csv'] }]
      : [{ name: 'JSON 文件', extensions: ['json'] }]

    const result = await dialog.showSaveDialog(mainWindow, {
      defaultPath: defaultName + '.' + ext,
      filters,
    })

    if (!result.canceled && result.filePath) {
      const fs = require('fs')
      fs.writeFileSync(result.filePath, data, 'utf-8')
      return true
    }
    return false
  })
}

// ====== 辅助函数 ======

function rowToObject(columns: string[], values: any[]): Record<string, any> {
  const obj: Record<string, any> = {}
  columns.forEach((col, i) => {
    obj[col] = values[i]
  })
  return obj
}

function resultToArray(result: any[]): any[] {
  if (!result[0]) return []
  return result[0].values.map((row: any[]) => rowToObject(result[0].columns, row))
}

async function initDatabase() {
  const initSql = require('sql.js')
  const fs = require('fs')
  dbPath = getDbPath()

  let dbBuffer: Buffer | null = null
  if (fs.existsSync(dbPath)) {
    dbBuffer = fs.readFileSync(dbPath)
  }

  // sql.js 1.14.x 需要 await 异步初始化
  const SQL = await initSql()
  db = new SQL.Database(dbBuffer)

  // 创建表
  db.run(`
    CREATE TABLE IF NOT EXISTS sessions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      task_id INTEGER,
      type TEXT NOT NULL CHECK(type IN ('work', 'short_break', 'long_break')),
      duration_minutes INTEGER NOT NULL,
      started_at TEXT NOT NULL,
      ended_at TEXT,
      completed INTEGER NOT NULL DEFAULT 0,
      interrupted INTEGER NOT NULL DEFAULT 0
    )
  `)

  db.run(`
    CREATE TABLE IF NOT EXISTS tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT DEFAULT '',
      tag TEXT DEFAULT '',
      status TEXT NOT NULL DEFAULT 'todo' CHECK(status IN ('todo', 'in_progress', 'done')),
      estimated_pomodoros INTEGER DEFAULT 0,
      completed_pomodoros INTEGER DEFAULT 0,
      created_at TEXT NOT NULL,
      completed_at TEXT
    )
  `)

  db.run(`
    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    )
  `)

  saveDb()
}

function saveDb() {
  if (!db) return
  const fs = require('fs')
  const data = db.export()
  const buffer = Buffer.from(data)
  fs.writeFileSync(dbPath, buffer)
}

// ====== 应用生命周期 ======

app.whenReady().then(async () => {
  await initDatabase()
  setupIPC()
  createWindow()
  createTray()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    } else {
      mainWindow?.show()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('before-quit', () => {
  isQuitting = true
  if (db) {
    saveDb()
    db.close()
  }
})
