import { useEffect } from 'react'
import { db } from '@/db/database'

export function useTray() {
  useEffect(() => {
    // 托盘初始化由主进程处理
  }, [])

  const setTrayText = (text: string) => {
    db.app.setTray(text)
  }

  const minimizeToTray = () => {
    db.app.minimizeToTray()
  }

  return { setTrayText, minimizeToTray }
}
