import { create } from 'zustand'
import type { TimerState, SessionType } from '@/types'

interface TimerStore {
  // 计时状态
  state: TimerState
  // 剩余秒数
  remainingSeconds: number
  // 总秒数
  totalSeconds: number
  // 当前 session 类型
  sessionType: SessionType
  // 当前第几个番茄 (用于长休息计数)
  pomodoroCount: number
  // 关联的任务 ID
  activeTaskId: number | null
  // 当前 session 开始时间 (ISO)
  sessionStartTime: string | null

  // Actions
  setState: (state: TimerState) => void
  setRemainingSeconds: (seconds: number) => void
  setTotalSeconds: (seconds: number) => void
  setSessionType: (type: SessionType) => void
  setPomodoroCount: (count: number) => void
  setActiveTaskId: (id: number | null) => void
  setSessionStartTime: (time: string | null) => void
  tick: () => void
  reset: () => void
}

export const useTimerStore = create<TimerStore>((set) => ({
  state: 'idle',
  remainingSeconds: 25 * 60,
  totalSeconds: 25 * 60,
  sessionType: 'work',
  pomodoroCount: 0,
  activeTaskId: null,
  sessionStartTime: null,

  setState: (state) => set({ state }),
  setRemainingSeconds: (seconds) => set({ remainingSeconds: seconds }),
  setTotalSeconds: (seconds) => set({ totalSeconds: seconds }),
  setSessionType: (type) => set({ sessionType: type }),
  setPomodoroCount: (count) => set({ pomodoroCount: count }),
  setActiveTaskId: (id) => set({ activeTaskId: id }),
  setSessionStartTime: (time) => set({ sessionStartTime: time }),

  tick: () =>
    set((s) => {
      if (s.state !== 'running') return s
      const next = s.remainingSeconds - 1
      if (next <= 0) {
        return { remainingSeconds: 0, state: 'finished' as TimerState }
      }
      return { remainingSeconds: next }
    }),

  reset: () =>
    set((s) => ({
      state: 'idle',
      remainingSeconds: s.totalSeconds,
      sessionStartTime: null,
    })),
}))
