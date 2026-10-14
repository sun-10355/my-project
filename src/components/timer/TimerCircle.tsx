import { useTimerStore } from '@/stores/timerStore'
import { formatTime } from '@/utils/format'

export default function TimerCircle() {
  const { remainingSeconds, totalSeconds, sessionType, state } = useTimerStore()

  const progress = totalSeconds > 0 ? remainingSeconds / totalSeconds : 0
  const circumference = 2 * Math.PI * 130
  const dashOffset = circumference * (1 - progress)

  const isWork = sessionType === 'work'

  const bgStrokeColor = isWork
    ? 'rgba(224, 123, 90, 0.12)'
    : 'rgba(107, 127, 74, 0.12)'

  return (
    <div
      className="relative flex items-center justify-center"
      style={
        state === 'running'
          ? { animation: 'ringBreathe 2s ease-in-out infinite' }
          : state === 'finished'
            ? { animation: 'ringFlash 1.6s ease-out forwards' }
            : {}
      }
    >
      {/* SVG 圆环 */}
      <svg width="300" height="300" className="-rotate-90">
        {/* 渐变定义 */}
        <defs>
          <linearGradient id="ringGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={isWork ? '#E07B5A' : '#8A9E6A'} />
            <stop offset="100%" stopColor={isWork ? '#D4744F' : '#556636'} />
          </linearGradient>
        </defs>

        {/* 背景圆环 */}
        <circle
          cx="150"
          cy="150"
          r="130"
          fill="none"
          stroke={bgStrokeColor}
          strokeWidth="10"
        />
        {/* 进度圆环 - 渐变色 */}
        <circle
          cx="150"
          cy="150"
          r="130"
          fill="none"
          stroke="url(#ringGradient)"
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          className="transition-all duration-1000 ease-linear"
        />
      </svg>

      {/* 中心文字 */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span
          className="text-6xl font-bold tracking-tight tabular-nums select-none"
          style={{
            fontFamily: "'DM Serif Display', 'Noto Serif SC', serif",
            color: 'var(--color-crema)',
          }}
        >
          {formatTime(remainingSeconds)}
        </span>

        {/* 状态标签 */}
        <div className="flex items-center gap-1.5 mt-3">
          <span
            className="inline-block w-1.5 h-1.5 rounded-full"
            style={{ background: isWork ? 'var(--color-terracotta)' : 'var(--color-oliva)' }}
          />
          <span
            className="text-xs font-medium tracking-widest uppercase select-none"
            style={{ color: 'var(--color-latte)' }}
          >
            {isWork ? 'FOCUS' : 'REST'}
          </span>
        </div>

        {state === 'running' && (
          <span
            className="text-xs mt-1 select-none"
            style={{ color: 'var(--color-latte)', opacity: 0.6 }}
          >
            {isWork ? '保持专注...' : '放松一下...'}
          </span>
        )}
        {state === 'paused' && (
          <span
            className="text-xs mt-1 select-none"
            style={{ color: 'var(--color-latte)', opacity: 0.5 }}
          >
            已暂停
          </span>
        )}
        {state === 'finished' && (
          <span
            className="text-sm font-medium mt-1 select-none"
            style={{ color: 'var(--color-terracotta)' }}
          >
            {isWork ? '太棒了！' : '休息好了！'}
          </span>
        )}
      </div>
    </div>
  )
}
