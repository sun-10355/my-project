import { contextBridge, ipcRenderer } from 'electron'

const api = {
  sessions: {
    insert: (session: any) => ipcRenderer.invoke('db:sessions:insert', session),
    getById: (id: number) => ipcRenderer.invoke('db:sessions:getById', id),
    getByDate: (date: string) => ipcRenderer.invoke('db:sessions:getByDate', date),
    getRange: (start: string, end: string) => ipcRenderer.invoke('db:sessions:getRange', start, end),
    getDailyStats: (days: number) => ipcRenderer.invoke('db:sessions:getDailyStats', days),
    getOverview: () => ipcRenderer.invoke('db:sessions:getOverview'),
  },
  tasks: {
    getAll: () => ipcRenderer.invoke('db:tasks:getAll'),
    insert: (task: any) => ipcRenderer.invoke('db:tasks:insert', task),
    update: (id: number, updates: any) => ipcRenderer.invoke('db:tasks:update', id, updates),
    delete: (id: number) => ipcRenderer.invoke('db:tasks:delete', id),
  },
  settings: {
    get: (key: string) => ipcRenderer.invoke('db:settings:get', key),
    set: (key: string, value: string) => ipcRenderer.invoke('db:settings:set', key, value),
    getAll: () => ipcRenderer.invoke('db:settings:getAll'),
  },
  app: {
    notify: (title: string, body: string) => ipcRenderer.send('app:notify', title, body),
    setTray: (text: string) => ipcRenderer.send('app:setTray', text),
    minimizeToTray: () => ipcRenderer.send('app:minimizeToTray'),
    minimize: () => ipcRenderer.send('app:minimize'),
    maximize: () => ipcRenderer.send('app:maximize'),
    close: () => ipcRenderer.send('app:close'),
    getVersion: () => ipcRenderer.invoke('app:getVersion'),
  },
  dialog: {
    exportFile: (data: string, defaultName: string, ext: string) =>
      ipcRenderer.invoke('dialog:exportFile', data, defaultName, ext),
  },
}

contextBridge.exposeInMainWorld('api', api)
