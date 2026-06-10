// 数据库操作 — Electron IPC 优先，浏览器 localStorage 回退

import { browserDB } from './browserDB'

const electronAPI = (window as any).api

export interface DbAPI {
  sessions: {
    insert: (session: any) => Promise<number>
    getById: (id: number) => Promise<any>
    getByDate: (date: string) => Promise<any[]>
    getRange: (start: string, end: string) => Promise<any[]>
    getDailyStats: (days: number) => Promise<any[]>
    getOverview: () => Promise<any>
  }
  tasks: {
    getAll: () => Promise<any[]>
    insert: (task: any) => Promise<number>
    update: (id: number, updates: Record<string, any>) => Promise<void>
    delete: (id: number) => Promise<void>
  }
  settings: {
    get: (key: string) => Promise<string | null>
    set: (key: string, value: string) => Promise<void>
    getAll: () => Promise<Record<string, string>>
  }
  app: {
    notify: (title: string, body: string) => void
    setTray: (text: string) => void
    minimizeToTray: () => void
    minimize: () => void
    maximize: () => void
    close: () => void
    getVersion: () => Promise<string>
  }
  dialog: {
    exportFile: (data: string, defaultName: string, ext: string) => Promise<boolean>
  }
}

// 浏览器环境下的 app 操作 (无实际效果)
const browserApp = {
  notify: (title: string, body: string) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(title, { body })
    }
  },
  setTray: () => {},
  minimizeToTray: () => {},
  minimize: () => {},
  maximize: () => {},
  close: () => {},
  getVersion: async () => '1.0.0-browser',
}

// 浏览器环境下的 dialog 操作 (下载文件)
const browserDialog = {
  exportFile: async (data: string, defaultName: string, ext: string) => {
    try {
      const blob = new Blob([data], { type: ext === 'csv' ? 'text/csv' : 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${defaultName}.${ext}`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      return true
    } catch {
      return false
    }
  },
}

// 选择数据库后端
const backend = electronAPI
  ? electronAPI
  : {
      sessions: browserDB.sessions,
      tasks: browserDB.tasks,
      settings: browserDB.settings,
      app: browserApp,
      dialog: browserDialog,
    }

export const db: DbAPI = backend
export const isElectron = !!electronAPI
