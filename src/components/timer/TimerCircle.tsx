import { useTimerStore } from '@/stores/timerStore'
import { formatTime } from '@/utils/format'

export default function TimerCircle() {
  const { remainingSeconds, totalSeconds, sessionType, state } = useTimerStore()

  const progress = totalSeconds > 0 ? remainingSeconds / totalSeconds : 0
  const circumference = 2 * Math.PI * 120
  const dashOffset = circumference * (1 - progress)

  const isWork = sessionType === 'work'
  const isBreak = sessionType === 'short_break' || sessionType === 'long_break'
  const isLongBreak = sessionType === 'long_break'

  const strokeColor = isWork
    ? '#ef4444'
    : isLongBreak
      ? '#3b82f6'
      : '#22c55e'

  const bgStrokeColor = isWork
    ? 'rgba(239, 68, 68, 0.15)'
    : isLongBreak
      ? 'rgba(59, 130, 246, 0.15)'
      : 'rgba(34, 197, 94, 0.15)'

  return (
    <div className="relative flex items-center justify-center">
      {/* SVG 圆环 */}
      <svg width="280" height="280" className="-rotate-90">
        {/* 背景圆环 */}
        <circle
          cx="140"
          cy="140"
          r="120"
          fill="none"
          stroke={bgStrokeColor}
          strokeWidth="8"
        />
        {/* 进度圆环 */}
        <circle
          cx="140"
          cy="140"
          r="120"
          fill="none"
          stroke={strokeColor}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          className="transition-all duration-1000 ease-linear"
        />
      </svg>

      {/* 中心文字 */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span
          className={`text-6xl font-bold tracking-tight tabular-nums ${
            state === 'finished' ? 'animate-pulse-slow' : ''
          }`}
          style={{ color: strokeColor }}
        >
          {formatTime(remainingSeconds)}
        </span>
        <span className="text-sm text-zinc-500 mt-2">
          {isWork ? '专注工作' : isLongBreak ? '长休息' : '短休息'}
        </span>
        {state === 'running' && (
          <span className="text-xs text-zinc-600 mt-1 animate-pulse">
            {isWork ? '保持专注...' : '放松一下...'}
          </span>
        )}
        {state === 'paused' && (
          <span className="text-xs text-zinc-500 mt-1">已暂停</span>
        )}
        {state === 'finished' && (
          <span className="text-xs text-zinc-400 mt-1">
            {isWork ? '太棒了！' : '休息好了！'}
          </span>
        )}
      </div>
    </div>
  )
}
