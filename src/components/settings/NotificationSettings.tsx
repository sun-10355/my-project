import { useSettingsStore } from '@/stores/settingsStore'

export default function NotificationSettings() {
  const { settings, setSettings } = useSettingsStore()

  return (
    <div className="space-y-5">
      <h3 className="text-sm font-semibold text-zinc-300">🔔 通知与音效</h3>
      <div className="space-y-4">
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={settings.notification_enabled}
            onChange={(e) => setSettings({ notification_enabled: e.target.checked })}
            className="w-4 h-4 rounded accent-primary-600"
          />
          <span className="text-sm text-zinc-400">启用桌面通知</span>
        </label>
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={settings.sound_enabled}
            onChange={(e) => setSettings({ sound_enabled: e.target.checked })}
            className="w-4 h-4 rounded accent-primary-600"
          />
          <span className="text-sm text-zinc-400">启用提示音效</span>
        </label>
        {settings.sound_enabled && (
          <div>
            <label className="block text-sm text-zinc-500 mb-2">
              音量: {settings.sound_volume}%
            </label>
            <input
              type="range"
              min={0}
              max={100}
              value={settings.sound_volume}
              onChange={(e) => setSettings({ sound_volume: parseInt(e.target.value) })}
              className="w-full accent-primary-600"
            />
          </div>
        )}
      </div>
    </div>
  )
}
