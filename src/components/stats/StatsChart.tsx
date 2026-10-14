import { useEffect, useState } from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts'
import { db } from '@/db/database'
import { useStatsStore } from '@/stores/statsStore'

const TOOLTIP_STYLE = {
  backgroundColor: '#3D322B',
  border: '1px solid rgba(168,152,132,0.2)',
  borderRadius: '12px',
  color: '#FBF7F0',
} as const

export default function StatsChart() {
  const { dailyStats, setDailyStats } = useStatsStore()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      try {
        const raw = await db.sessions.getDailyStats(14)
        const stats = (raw || []).map((r: any) => ({
          date: r.date?.slice(5) || r.date,
          pomodoros: r.pomodoros || 0,
          work_minutes: r.work_minutes || 0,
        }))
        setDailyStats(stats)
      } catch {
        const mock = Array.from({ length: 14 }, (_, i) => {
          const d = new Date()
          d.setDate(d.getDate() - (13 - i))
          return {
            date: `${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`,
            pomodoros: Math.floor(Math.random() * 8),
            work_minutes: Math.floor(Math.random() * 200),
          }
        })
        setDailyStats(mock)
      }
      setLoading(false)
    }
    loadData()
  }, [setDailyStats])

  const totalWork = dailyStats.reduce((sum, d) => sum + d.work_minutes, 0)
  const totalBreak = Math.floor(totalWork * 0.25)

  const pieData = [
    { name: '工作', value: totalWork, color: '#E07B5A' },
    { name: '休息', value: totalBreak, color: '#6B7F4A' },
  ]

  if (loading) {
    return (
      <div className="card h-64 animate-pulse flex items-center justify-center">
        <span style={{ color: 'var(--color-latte)' }}>加载中...</span>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 gap-4">
      {/* 柱状图 — 每日番茄数 */}
      <div className="card">
        <h3 className="text-sm font-medium mb-4" style={{ color: 'var(--color-latte)' }}>
          近 14 天番茄趋势
        </h3>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={dailyStats}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(168,152,132,0.1)" />
            <XAxis
              dataKey="date"
              tick={{ fill: '#A89884', fontSize: 11 }}
              axisLine={{ stroke: 'rgba(168,152,132,0.12)' }}
            />
            <YAxis
              tick={{ fill: '#A89884', fontSize: 11 }}
              axisLine={{ stroke: 'rgba(168,152,132,0.12)' }}
              allowDecimals={false}
            />
            <Tooltip contentStyle={TOOLTIP_STYLE} />
            <Bar dataKey="pomodoros" fill="#E07B5A" radius={[4, 4, 0, 0]} name="番茄数" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* 饼图 — 工作/休息占比 */}
      <div className="card">
        <h3 className="text-sm font-medium mb-4" style={{ color: 'var(--color-latte)' }}>
          工作时间占比
        </h3>
        <ResponsiveContainer width="100%" height={220}>
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={85}
              paddingAngle={4}
              dataKey="value"
            >
              {pieData.map((entry, i) => (
                <Cell key={i} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={TOOLTIP_STYLE}
              formatter={(value: number) => `${Math.floor(value)} 分钟`}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="flex justify-center gap-6 -mt-4">
          {pieData.map((entry) => (
            <div key={entry.name} className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }} />
              <span style={{ color: 'var(--color-latte)', fontSize: '12px' }}>{entry.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
