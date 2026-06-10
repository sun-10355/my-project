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
            className={`text-xs px-3 py-1.5 rounded-lg transition-all duration-200 ${
              isActive
                ? 'bg-primary-600/20 text-primary-400 border border-primary-500/30'
                : 'bg-white/5 text-zinc-500 hover:text-zinc-300 border border-transparent'
            }`}
          >
            {preset.label}
          </button>
        )
      })}
    </div>
  )
}
