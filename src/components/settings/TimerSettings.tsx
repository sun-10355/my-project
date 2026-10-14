import { useSettingsStore } from '@/stores/settingsStore'

export default function TimerSettings() {
  const { settings, setSettings } = useSettingsStore()

  const durations = [
    { key: 'work_duration' as const, label: '工作时长', unit: '分钟', min: 1, max: 120 },
    { key: 'short_break_duration' as const, label: '短休息时长', unit: '分钟', min: 1, max: 60 },
    { key: 'long_break_duration' as const, label: '长休息时长', unit: '分钟', min: 1, max: 120 },
    { key: 'long_break_interval' as const, label: '长休息间隔', unit: '个番茄后', min: 1, max: 10 },
  ]

  return (
    <div className="space-y-5">
      <h3 className="text-sm font-semibold" style={{ color: 'var(--color-crema)' }}>
        计时设置
      </h3>
      <div className="grid grid-cols-2 gap-4">
        {durations.map((d) => (
          <div key={d.key}>
            <label className="block text-sm mb-2" style={{ color: 'var(--color-latte)' }}>
              {d.label} ({d.unit})
            </label>
            <input
              type="number"
              value={settings[d.key]}
              onChange={(e) => {
                const val = Math.max(d.min, Math.min(d.max, parseInt(e.target.value) || d.min))
                setSettings({ [d.key]: val })
              }}
              className="input-field w-full"
              min={d.min}
              max={d.max}
            />
          </div>
        ))}
      </div>

      {/* 自动开始选项 */}
      <div className="space-y-3">
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={settings.auto_start_breaks}
            onChange={(e) => setSettings({ auto_start_breaks: e.target.checked })}
            className="w-4 h-4 rounded"
          />
          <span className="text-sm" style={{ color: 'var(--color-latte)' }}>
            工作结束后自动开始休息
          </span>
        </label>
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={settings.auto_start_work}
            onChange={(e) => setSettings({ auto_start_work: e.target.checked })}
            className="w-4 h-4 rounded"
          />
          <span className="text-sm" style={{ color: 'var(--color-latte)' }}>
            休息结束后自动开始工作
          </span>
        </label>
      </div>
    </div>
  )
}
