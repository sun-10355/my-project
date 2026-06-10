import { create } from 'zustand'
import type { StatsOverview, DailyStats } from '@/types'

interface StatsStore {
  overview: StatsOverview | null
  dailyStats: DailyStats[]
  setOverview: (overview: StatsOverview) => void
  setDailyStats: (stats: DailyStats[]) => void
}

export const useStatsStore = create<StatsStore>((set) => ({
  overview: null,
  dailyStats: [],
  setOverview: (overview) => set({ overview }),
  setDailyStats: (dailyStats) => set({ dailyStats }),
}))
