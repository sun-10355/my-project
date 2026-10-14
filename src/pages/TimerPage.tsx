import TimerCircle from '@/components/timer/TimerCircle'
import TimerControls from '@/components/timer/TimerControls'
import TimerPresets from '@/components/timer/TimerPresets'
import SessionInfo from '@/components/timer/SessionInfo'
import { useTimer } from '@/hooks/useTimer'

export default function TimerPage() {
  const {
    state,
    remainingSeconds,
    totalSeconds,
    sessionType,
    pomodoroCount,
    start,
    pause,
    reset,
    skip,
    setDuration,
  } = useTimer()

  const currentMinutes = Math.floor(totalSeconds / 60)

  return (
    <div className="flex flex-col items-center justify-center h-full gap-8">
      {/* Session 信息 */}
      <SessionInfo />

      {/* 圆形计时器 */}
      <TimerCircle />

      {/* 控制按钮 */}
      <TimerControls
        state={state}
        onStart={start}
        onPause={pause}
        onReset={reset}
        onSkip={skip}
      />

      {/* 预设时长 (仅在闲置时可切换) */}
      {state === 'idle' && (
        <TimerPresets currentMinutes={currentMinutes} onSelect={setDuration} />
      )}

      {/* 番茄进度指示器 */}
      <div className="flex gap-2">
        {Array.from({ length: 4 }, (_, i) => (
          <div
            key={i}
            className="w-2 h-2 rounded-full transition-all duration-300"
            style={{
              background:
                i < pomodoroCount % 4
                  ? 'var(--color-terracotta)'
                  : 'var(--color-caramel)',
              transform: i < pomodoroCount % 4 ? 'scale(1)' : 'scale(0.75)',
            }}
          />
        ))}
      </div>
    </div>
  )
}
