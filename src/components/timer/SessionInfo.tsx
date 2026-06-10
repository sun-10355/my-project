import { useTimerStore } from '@/stores/timerStore'

export default function SessionInfo() {
  const { pomodoroCount, sessionType, activeTaskId } = useTimerStore()

  const isWork = sessionType === 'work'
  const isLongBreak = sessionType === 'long_break'

  return (
    <div className="flex items-center gap-4 text-sm text-zinc-500">
      {/* 番茄计数 */}
      <div className="flex items-center gap-2">
        <span>🍅</span>
        <span>
          第 <strong className="text-white">{pomodoroCount + 1}</strong> 个番茄
        </span>
      </div>

      {/* 分隔 */}
      <span className="text-zinc-700">|</span>

      {/* 当前阶段 */}
      <span>
        {isWork ? '🔴 工作中' : isLongBreak ? '🔵 长休息' : '🟢 短休息'}
      </span>

      {/* 关联任务 */}
      {activeTaskId && (
        <>
          <span className="text-zinc-700">|</span>
          <span>📋 已关联任务</span>
        </>
      )}
    </div>
  )
}
