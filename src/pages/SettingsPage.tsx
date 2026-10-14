import { useEffect } from 'react'
import TimerSettings from '@/components/settings/TimerSettings'
import NotificationSettings from '@/components/settings/NotificationSettings'
import GeneralSettings from '@/components/settings/GeneralSettings'
import { useSettingsStore } from '@/stores/settingsStore'
import { db } from '@/db/database'

export default function SettingsPage() {
  const loadSettings = useSettingsStore((s) => s.loadSettings)
  const loaded = useSettingsStore((s) => s.loaded)

  useEffect(() => {
    if (loaded) return
    async function init() {
      try {
        const saved = await db.settings.getAll()
        if (saved && Object.keys(saved).length > 0) {
          const parsed: Record<string, any> = {}
          for (const [key, value] of Object.entries(saved)) {
            try { parsed[key] = JSON.parse(value) } catch { parsed[key] = value }
          }
          loadSettings(parsed)
        }
      } catch {
        // 数据库不可用，使用默认设置
      }
    }
    init()
  }, [loaded, loadSettings])

  return (
    <div className="flex flex-col h-full">
      <div className="mb-6">
        <h2 className="text-xl font-semibold" style={{ color: 'var(--color-crema)' }}>设置</h2>
        <p className="text-sm mt-1" style={{ color: 'var(--color-latte)' }}>自定义你的番茄钟体验</p>
      </div>

      <div className="space-y-8 overflow-y-auto flex-1">
        <div className="card">
          <TimerSettings />
        </div>
        <div className="card">
          <NotificationSettings />
        </div>
        <div className="card">
          <GeneralSettings />
        </div>
      </div>
    </div>
  )
}
