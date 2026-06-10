import { create } from 'zustand'
import type { AppSettings } from '@/types'

const defaultSettings: AppSettings = {
  work_duration: 25,
  short_break_duration: 5,
  long_break_duration: 15,
  long_break_interval: 4,
  auto_start_breaks: true,
  auto_start_work: false,
  notification_enabled: true,
  sound_enabled: true,
  sound_volume: 70,
  minimize_to_tray: true,
  always_on_top: false,
}

// 持久化到数据库的辅助函数
async function persist(key: string, value: any) {
  try {
    // 延迟导入避免循环依赖
    const { db } = await import('@/db/database')
    await db.settings.set(key, JSON.stringify(value))
  } catch {
    // 数据库不可用时静默失败
  }
}

interface SettingsStore {
  settings: AppSettings
  loaded: boolean
  setSettings: (settings: Partial<AppSettings>) => void
  loadSettings: (settings: Partial<AppSettings>) => void
  resetSettings: () => void
}

export const useSettingsStore = create<SettingsStore>((set) => ({
  settings: { ...defaultSettings },
  loaded: false,

  setSettings: (partial) => {
    // 持久化每个变更的 key
    for (const [key, value] of Object.entries(partial)) {
      persist(key, value)
    }
    set((s) => ({
      settings: { ...s.settings, ...partial },
    }))
  },

  loadSettings: (saved) =>
    set({
      settings: { ...defaultSettings, ...saved },
      loaded: true,
    }),

  resetSettings: () => {
    for (const [key, value] of Object.entries(defaultSettings)) {
      persist(key, value)
    }
    set({ settings: { ...defaultSettings } })
  },
}))

export { defaultSettings }
