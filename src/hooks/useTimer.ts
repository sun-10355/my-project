import { useEffect, useRef, useCallback } from 'react'
import { useTimerStore } from '@/stores/timerStore'
import { useSettingsStore } from '@/stores/settingsStore'
import { db } from '@/db/database'
import { useNotification } from './useNotification'
import { playAlarm } from '@/utils/sound'

export function useTimer() {
  const {
    state,
    remainingSeconds,
    totalSeconds,
    sessionType,
    pomodoroCount,
    activeTaskId,
    sessionStartTime,
    setState,
    setRemainingSeconds,
    setTotalSeconds,
    setSessionType,
    setPomodoroCount,
    setSessionStartTime,
    tick,
    reset,
  } = useTimerStore()

  const settings = useSettingsStore((s) => s.settings)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const { notify } = useNotification()

  // 记录完成的 session
  const recordSession = useCallback(
    async (completed: boolean) => {
      if (!sessionStartTime) return
      const now = new Date().toISOString()

      try {
        await db.sessions.insert({
          task_id: activeTaskId,
          type: sessionType,
          duration_minutes: Math.floor(totalSeconds / 60),
          started_at: sessionStartTime,
          ended_at: now,
          completed: completed ? 1 : 0,
          interrupted: completed ? 0 : 1,
        })

        // 如果是 work 类型且关联了任务，更新任务番茄数
        if (sessionType === 'work' && activeTaskId && completed) {
          // 更新任务完成番茄数 (通过 IPC)
          // 这个操作会在 db.tasks.update 中完成
        }
      } catch (e) {
        console.error('记录 session 失败:', e)
      }
    },
    [sessionType, totalSeconds, sessionStartTime, activeTaskId]
  )

  // 处理计时完成
  const handleFinish = useCallback(() => {
    const wasWork = sessionType === 'work'
    const newCount = wasWork ? pomodoroCount + 1 : pomodoroCount

    // 记录 session
    recordSession(true)

    // 通知
    if (settings.notification_enabled) {
      if (wasWork) {
        notify('番茄钟完成！', `已完成 ${newCount} 个番茄，该休息了 🎉`)
      } else {
        notify('休息结束', '准备开始下一个番茄钟吧！')
      }
    }

    // 音效
    if (settings.sound_enabled) {
      playAlarm(settings.sound_volume)
    }

    // 更新托盘
    db.app.setTray('已完成')

    if (wasWork) {
      setPomodoroCount(newCount)
      // 判断是否该长休息
      if (newCount % settings.long_break_interval === 0) {
        setSessionType('long_break')
        setRemainingSeconds(settings.long_break_duration * 60)
        setTotalSeconds(settings.long_break_duration * 60)
      } else {
        setSessionType('short_break')
        setRemainingSeconds(settings.short_break_duration * 60)
        setTotalSeconds(settings.short_break_duration * 60)
      }
      // 自动开始休息
      if (settings.auto_start_breaks) {
        setState('running')
        setSessionStartTime(new Date().toISOString())
      } else {
        setState('finished')
      }
    } else {
      // 休息结束
      setSessionType('work')
      setRemainingSeconds(settings.work_duration * 60)
      setTotalSeconds(settings.work_duration * 60)
      if (settings.auto_start_work) {
        setState('running')
        setSessionStartTime(new Date().toISOString())
      } else {
        setState('finished')
      }
    }
  }, [
    sessionType,
    pomodoroCount,
    settings,
    recordSession,
    notify,
    setPomodoroCount,
    setSessionType,
    setRemainingSeconds,
    setTotalSeconds,
    setState,
    setSessionStartTime,
  ])

  // 每秒 tick
  useEffect(() => {
    if (state === 'running') {
      intervalRef.current = setInterval(() => {
        tick()
      }, 1000)
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
  }, [state, tick])

  // 监听 remainingSeconds 变为 0
  useEffect(() => {
    if (state === 'finished') {
      handleFinish()
    }
  }, [state, handleFinish])

  // 更新托盘
  useEffect(() => {
    if (state === 'running') {
      const mins = Math.floor(remainingSeconds / 60)
      const secs = remainingSeconds % 60
      const label = sessionType === 'work' ? '🍅' : '☕'
      db.app.setTray(`${label} ${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`)
    }
  }, [remainingSeconds, state, sessionType])

  // 开始计时
  const start = useCallback(() => {
    if (state === 'idle' || state === 'paused') {
      setState('running')
      if (!sessionStartTime) {
        setSessionStartTime(new Date().toISOString())
      }
    }
  }, [state, sessionStartTime, setState, setSessionStartTime])

  // 暂停
  const pause = useCallback(() => {
    if (state === 'running') {
      setState('paused')
    }
  }, [state, setState])

  // 重置
  const resetTimer = useCallback(() => {
    recordSession(false)
    reset()
    db.app.setTray('')
  }, [reset, recordSession])

  // 跳过当前阶段
  const skip = useCallback(() => {
    recordSession(false)
    const wasWork = sessionType === 'work'
    if (wasWork) {
      const newCount = pomodoroCount + 1
      setPomodoroCount(newCount)
      if (newCount % settings.long_break_interval === 0) {
        setSessionType('long_break')
        setRemainingSeconds(settings.long_break_duration * 60)
        setTotalSeconds(settings.long_break_duration * 60)
      } else {
        setSessionType('short_break')
        setRemainingSeconds(settings.short_break_duration * 60)
        setTotalSeconds(settings.short_break_duration * 60)
      }
    } else {
      setSessionType('work')
      setRemainingSeconds(settings.work_duration * 60)
      setTotalSeconds(settings.work_duration * 60)
    }
    setState('idle')
    setSessionStartTime(null)
    db.app.setTray('')
  }, [
    sessionType,
    pomodoroCount,
    settings,
    recordSession,
    setSessionType,
    setRemainingSeconds,
    setTotalSeconds,
    setState,
    setSessionStartTime,
    setPomodoroCount,
  ])

  // 切换预设时长
  const setDuration = useCallback(
    (minutes: number) => {
      setTotalSeconds(minutes * 60)
      setRemainingSeconds(minutes * 60)
      setState('idle')
      setSessionStartTime(null)
    },
    [setTotalSeconds, setRemainingSeconds, setState, setSessionStartTime]
  )

  return {
    state,
    remainingSeconds,
    totalSeconds,
    sessionType,
    pomodoroCount,
    activeTaskId,
    start,
    pause,
    reset: resetTimer,
    skip,
    setDuration,
    setActiveTaskId: useTimerStore.getState().setActiveTaskId,
  }
}
