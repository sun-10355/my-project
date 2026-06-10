// 浏览器端 localStorage 数据库替代
// 当不在 Electron 环境中时使用

import type { Task, PomodoroSession, StatsOverview } from '@/types'

const STORAGE_KEY = 'pomodoro_data'

interface BrowserDB {
  sessions: PomodoroSession[]
  tasks: Task[]
  settings: Record<string, string>
}

function load(): BrowserDB {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw)
  } catch {}
  return { sessions: [], tasks: [], settings: {} }
}

function save(data: BrowserDB) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch {}
}

let nextId = Date.now()
function genId(): number {
  return nextId++
}

export const browserDB = {
  sessions: {
    insert: async (session: any) => {
      const data = load()
      const s: PomodoroSession = { ...session, id: genId() }
      data.sessions.push(s)
      save(data)
      return s.id!
    },
    getById: async (id: number) => {
      return load().sessions.find((s) => s.id === id) || null
    },
    getByDate: async (date: string) => {
      return load().sessions.filter((s) => s.started_at?.startsWith(date))
    },
    getRange: async (_start: string, _end: string) => {
      return load().sessions
    },
    getDailyStats: async (days: number) => {
      const data = load()
      const map = new Map<string, { pomodoros: number; work_minutes: number }>()
      const now = new Date()
      for (let i = days - 1; i >= 0; i--) {
        const d = new Date(now)
        d.setDate(d.getDate() - i)
        const key = d.toISOString().slice(0, 10)
        map.set(key, { pomodoros: 0, work_minutes: 0 })
      }
      for (const s of data.sessions) {
        if (s.type === 'work' && s.completed) {
          const key = s.started_at.slice(0, 10)
          const entry = map.get(key)
          if (entry) {
            entry.pomodoros++
            entry.work_minutes += s.duration_minutes
          }
        }
      }
      return Array.from(map.entries()).map(([date, stats]) => ({
        date,
        ...stats,
      }))
    },
    getOverview: async () => {
      const data = load()
      const now = new Date()
      const today = now.toISOString().slice(0, 10)
      const weekAgo = new Date(now.getTime() - 7 * 86400000).toISOString()
      const monthAgo = new Date(now.getTime() - 30 * 86400000).toISOString()

      let todayPoms = 0, todayMins = 0
      let weekPoms = 0, weekMins = 0
      let monthPoms = 0
      let totalMins = 0

      for (const s of data.sessions) {
        if (s.type !== 'work' || !s.completed) continue
        totalMins += s.duration_minutes
        if (s.started_at >= monthAgo) monthPoms++
        if (s.started_at >= weekAgo) { weekPoms++; weekMins += s.duration_minutes }
        if (s.started_at.slice(0, 10) === today) { todayPoms++; todayMins += s.duration_minutes }
      }

      return {
        today_pomodoros: todayPoms,
        today_work_minutes: todayMins,
        week_pomodoros: weekPoms,
        week_work_minutes: weekMins,
        month_pomodoros: monthPoms,
        total_hours: totalMins / 60,
      } as StatsOverview
    },
  },

  tasks: {
    getAll: async () => [...load().tasks],
    insert: async (task: any) => {
      const data = load()
      const t: Task = { ...task, id: genId() }
      data.tasks.push(t)
      save(data)
      return t.id!
    },
    update: async (id: number, updates: any) => {
      const data = load()
      const idx = data.tasks.findIndex((t) => t.id === id)
      if (idx >= 0) {
        data.tasks[idx] = { ...data.tasks[idx], ...updates }
        save(data)
      }
    },
    delete: async (id: number) => {
      const data = load()
      data.tasks = data.tasks.filter((t) => t.id !== id)
      save(data)
    },
  },

  settings: {
    get: async (key: string) => load().settings[key] || null,
    set: async (key: string, value: string) => {
      const data = load()
      data.settings[key] = value
      save(data)
    },
    getAll: async () => ({ ...load().settings }),
  },
}
