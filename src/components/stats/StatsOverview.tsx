import { useStatsStore } from '@/stores/statsStore'
import { formatMinutes } from '@/utils/format'
import { Timer, Clock, Calendar, Target } from 'lucide-react'

export default function StatsOverview() {
  const { overview } = useStatsStore()

  if (!overview) {
    return (
      <div className="grid grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="card">
            <div className="h-16 rounded-lg" style={{ background: 'var(--color-caramel)' }} />
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
    },
    {
      label: '本周番茄',
      value: `${overview.week_pomodoros}`,
      sub: formatMinutes(overview.week_work_minutes),
      icon: Calendar,
    },
    {
      label: '本月番茄',
      value: `${overview.month_pomodoros}`,
      sub: '',
      icon: Target,
    },
    {
      label: '总专注时长',
      value: formatMinutes(Math.floor(overview.total_hours * 60)),
      sub: '',
      icon: Clock,
    },
  ]

  return (
    <div className="grid grid-cols-4 gap-4">
      {cards.map((card) => {
        const Icon = card.icon
        return (
          <div key={card.label} className="card" style={{ borderLeft: '2px solid var(--color-terracotta)' }}>
            <div className="flex items-center justify-between mb-3">
              <span style={{ color: 'var(--color-latte)', fontSize: '12px' }}>{card.label}</span>
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ background: 'rgba(224, 123, 90, 0.1)' }}
              >
                <Icon size={16} style={{ color: 'var(--color-terracotta)' }} />
              </div>
            </div>
            <div
              className="text-2xl font-bold"
              style={{
                fontFamily: "'DM Serif Display', 'Noto Serif SC', serif",
                color: 'var(--color-crema)',
              }}
            >
              {card.value}
            </div>
            {card.sub && (
              <div className="text-xs mt-1" style={{ color: 'var(--color-latte)', opacity: 0.7 }}>
                {card.sub}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
