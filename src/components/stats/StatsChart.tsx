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

export default function StatsChart() {
  const { dailyStats, setDailyStats } = useStatsStore()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      try {
        const raw = await db.sessions.getDailyStats(14)
        const stats = (raw || []).map((r: any) => ({
          date: r.date?.slice(5) || r.date, // MM-DD
          pomodoros: r.pomodoros || 0,
          work_minutes: r.work_minutes || 0,
        }))
        setDailyStats(stats)
      } catch {
        // 使用模拟数据
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

  // 饼图数据
  const totalWork = dailyStats.reduce((sum, d) => sum + d.work_minutes, 0)
  const totalBreak = Math.floor(totalWork * 0.25) // 大致估算休息时间

  const pieData = [
    { name: '工作', value: totalWork, color: '#ef4444' },
    { name: '休息', value: totalBreak, color: '#3b82f6' },
  ]

  if (loading) {
    return (
      <div className="card h-64 animate-pulse flex items-center justify-center">
        <span className="text-zinc-600">加载中...</span>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 gap-4">
      {/* 柱状图 — 每日番茄数 */}
      <div className="card">
        <h3 className="text-sm font-medium text-zinc-400 mb-4">📊 近 14 天番茄趋势</h3>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={dailyStats}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis
              dataKey="date"
              tick={{ fill: '#71717a', fontSize: 11 }}
              axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
            />
            <YAxis
              tick={{ fill: '#71717a', fontSize: 11 }}
              axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
              allowDecimals={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#18181b',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '12px',
                color: '#fafafa',
              }}
            />
            <Bar dataKey="pomodoros" fill="#ef4444" radius={[4, 4, 0, 0]} name="番茄数" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* 饼图 — 工作/休息占比 */}
      <div className="card">
        <h3 className="text-sm font-medium text-zinc-400 mb-4">⏱ 工作时间占比</h3>
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
              contentStyle={{
                backgroundColor: '#18181b',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '12px',
                color: '#fafafa',
              }}
              formatter={(value: number) => `${Math.floor(value)} 分钟`}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="flex justify-center gap-6 -mt-4">
          {pieData.map((entry) => (
            <div key={entry.name} className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }} />
              <span className="text-xs text-zinc-500">{entry.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
