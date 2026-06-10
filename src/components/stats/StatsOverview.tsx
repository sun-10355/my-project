import { useStatsStore } from '@/stores/statsStore'
import { formatMinutes } from '@/utils/format'
import { Timer, Clock, Calendar, Target } from 'lucide-react'

export default function StatsOverview() {
  const { overview } = useStatsStore()

  if (!overview) {
    return (
      <div className="grid grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="card animate-pulse">
            <div className="h-16 bg-white/5 rounded-lg" />
          </div>
        ))}
      </div>
    )
  }

  const cards = [
    {
      label: '今日番茄',
      value: `${overview.today_pomodoros}`,
      sub: formatMinutes(overview.today_work_minutes),
      icon: Timer,
      color: 'text-tomato-400',
      bg: 'bg-tomato-500/10',
    },
    {
      label: '本周番茄',
      value: `${overview.week_pomodoros}`,
      sub: formatMinutes(overview.week_work_minutes),
      icon: Calendar,
      color: 'text-blue-400',
      bg: 'bg-blue-500/10',
    },
    {
      label: '本月番茄',
      value: `${overview.month_pomodoros}`,
      sub: '',
      icon: Target,
      color: 'text-green-400',
      bg: 'bg-green-500/10',
    },
    {
      label: '总专注时长',
      value: formatMinutes(Math.floor(overview.total_hours * 60)),
      sub: '',
      icon: Clock,
      color: 'text-purple-400',
      bg: 'bg-purple-500/10',
    },
  ]

  return (
    <div className="grid grid-cols-4 gap-4">
      {cards.map((card) => {
        const Icon = card.icon
        return (
          <div key={card.label} className="card">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-zinc-500">{card.label}</span>
              <div className={`w-8 h-8 rounded-lg ${card.bg} flex items-center justify-center`}>
                <Icon size={16} className={card.color} />
              </div>
            </div>
            <div className={`text-2xl font-bold ${card.color}`}>{card.value}</div>
            {card.sub && <div className="text-xs text-zinc-600 mt-1">{card.sub}</div>}
          </div>
        )
      })}
    </div>
  )
}
