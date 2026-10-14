import { Minus, Square, X } from 'lucide-react'

// 自定义标题栏 - 暖色系
export default function TitleBar() {
  const isElectron = !!(window as any).api

  return (
    <div
      className="fixed top-0 left-0 right-0 h-9 flex items-center justify-between z-50"
      style={{
        background: 'var(--color-espresso)',
        WebkitAppRegion: 'drag',
      } as React.CSSProperties}
    >
      {/* 标题 */}
      <div className="flex items-center gap-2 pl-4">
        <span
          className="text-xs font-medium select-none"
          style={{ color: 'var(--color-latte)' }}
        >
          番茄钟
        </span>
      </div>

      {/* 窗口控制按钮 */}
      {isElectron && (
        <div
          className="flex h-full"
          style={{ WebkitAppRegion: 'no-drag' } as React.CSSProperties}
        >
          <button
            onClick={() => (window as any).api?.app?.minimize?.()}
            className="w-11 h-full flex items-center justify-center hover:bg-white/5 transition-colors"
            style={{ color: 'var(--color-latte)' }}
          >
            <Minus size={14} />
          </button>
          <button
            onClick={() => (window as any).api?.app?.maximize?.()}
            className="w-11 h-full flex items-center justify-center hover:bg-white/5 transition-colors"
            style={{ color: 'var(--color-latte)' }}
          >
            <Square size={12} />
          </button>
          <button
            onClick={() => (window as any).api?.app?.close?.()}
            className="w-11 h-full flex items-center justify-center transition-colors close-btn"
            style={{ color: 'var(--color-latte)' }}
          >
            <X size={14} />
          </button>
        </div>
      )}
    </div>
  )
}
