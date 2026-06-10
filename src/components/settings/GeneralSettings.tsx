import { useSettingsStore } from '@/stores/settingsStore'

export default function GeneralSettings() {
  const { settings, setSettings } = useSettingsStore()

  return (
    <div className="space-y-5">
      <h3 className="text-sm font-semibold text-zinc-300">⚙ 通用设置</h3>
      <div className="space-y-4">
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={settings.minimize_to_tray}
            onChange={(e) => setSettings({ minimize_to_tray: e.target.checked })}
            className="w-4 h-4 rounded accent-primary-600"
          />
          <span className="text-sm text-zinc-400">关闭窗口时最小化到系统托盘</span>
        </label>
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={settings.always_on_top}
            onChange={(e) => setSettings({ always_on_top: e.target.checked })}
            className="w-4 h-4 rounded accent-primary-600"
          />
          <span className="text-sm text-zinc-400">窗口置顶显示</span>
        </label>
      </div>
    </div>
  )
}
