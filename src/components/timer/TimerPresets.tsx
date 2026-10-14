interface Props {
  currentMinutes: number
  onSelect: (minutes: number) => void
}

const presets = [
  { label: '15 分钟', minutes: 15 },
  { label: '25 分钟', minutes: 25 },
  { label: '45 分钟', minutes: 45 },
  { label: '60 分钟', minutes: 60 },
]

export default function TimerPresets({ currentMinutes, onSelect }: Props) {
  return (
    <div className="flex gap-2">
      {presets.map((preset) => {
        const isActive = currentMinutes === preset.minutes
        return (
          <button
            key={preset.minutes}
            onClick={() => onSelect(preset.minutes)}
            className="text-xs px-3 py-1.5 rounded-full transition-all duration-200 select-none"
            style={
              isActive
                ? {
                    background: 'var(--color-terracotta)',
                    color: 'var(--color-crema)',
                  }
                : {
                    background: 'transparent',
                    color: 'var(--color-latte)',
                    border: '1px solid rgba(168, 152, 132, 0.2)',
                  }
            }
          >
            {preset.label}
          </button>
        )
      })}
    </div>
  )
}
