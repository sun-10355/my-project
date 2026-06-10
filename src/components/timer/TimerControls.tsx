import { Play, Pause, RotateCcw, SkipForward } from 'lucide-react'

interface Props {
  state: string
  onStart: () => void
  onPause: () => void
  onReset: () => void
  onSkip: () => void
}

export default function TimerControls({ state, onStart, onPause, onReset, onSkip }: Props) {
  const isRunning = state === 'running'
  const isFinished = state === 'finished'
  const isIdle = state === 'idle'
  const isPaused = state === 'paused'

  return (
    <div className="flex items-center gap-4">
      {/* 开始/暂停 */}
      {(isIdle || isPaused || isFinished) && (
        <button onClick={onStart} className="btn-primary flex items-center gap-2 px-6 py-3 text-base">
          <Play size={18} fill="currentColor" />
          {isFinished ? '继续' : '开始'}
        </button>
      )}

      {isRunning && (
        <button onClick={onPause} className="btn-primary flex items-center gap-2 px-6 py-3 text-base bg-amber-500 hover:bg-amber-400">
          <Pause size={18} fill="currentColor" />
          暂停
        </button>
      )}

      {/* 跳过 */}
      {(isRunning || isPaused) && (
        <button onClick={onSkip} className="btn-ghost flex items-center gap-2">
          <SkipForward size={18} />
          跳过
        </button>
      )}

      {/* 重置 */}
      {!isIdle && (
        <button onClick={onReset} className="btn-ghost flex items-center gap-2">
          <RotateCcw size={18} />
          重置
        </button>
      )}
    </div>
  )
}
