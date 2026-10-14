import { useTimerStore } from '@/stores/timerStore'

export default function SessionInfo() {
  const { pomodoroCount, sessionType, activeTaskId } = useTimerStore()

  const isWork = sessionType === 'work'
  const isLongBreak = sessionType === 'long_break'

  const phaseColor = isWork
    ? 'var(--color-terracotta)'
    : isLongBreak
      ? 'var(--color-oliva-dark)'
      : 'var(--color-oliva)'

  return (
    <div className="flex items-center gap-6 text-sm select-none" style={{ color: 'var(--color-latte)' }}>
      {/* 番茄计数 */}
      <div className="flex items-center gap-2">
        <span
          className="inline-block w-2 h-2 rounded-full"
          style={{ background: 'var(--color-terracotta)' }}
        />
        <span>
          第 <strong style={{ color: 'var(--color-crema)' }}>{pomodoroCount + 1}</strong> 个番茄
        </span>
      </div>

      {/* 当前阶段 */}
      <div className="flex items-center gap-2">
        <span
          className="inline-block w-2 h-2 rounded-full"
          style={{ background: phaseColor }}
        />
        <span>{isWork ? '工作中' : isLongBreak ? '长休息' : '短休息'}</span>
      </div>

      {/* 关联任务 */}
      {activeTaskId && (
        <div className="flex items-center gap-2">
          <span style={{ color: 'var(--color-latte)', opacity: 0.3 }}>|</span>
          <span>已关联任务</span>
        </div>
      )}
    </div>
  )
}
