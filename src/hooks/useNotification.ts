import { useCallback } from 'react'
import { db } from '@/db/database'

export function useNotification() {
  const notify = useCallback((title: string, body: string) => {
    try {
      db.app.notify(title, body)
    } catch {
      // 非 Electron 环境回退
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification(title, { body })
      }
    }
  }, [])

  const requestPermission = useCallback(async () => {
    if ('Notification' in window && Notification.permission === 'default') {
      await Notification.requestPermission()
    }
  }, [])

  return { notify, requestPermission }
}
