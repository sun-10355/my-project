import { Minus, Square, X } from 'lucide-react'

// 自定义 Windows 11 风格标题栏
export default function TitleBar() {
  const isElectron = !!(window as any).api

  return (
    <div
      className="fixed top-0 left-0 right-0 h-9 bg-zinc-950/90 backdrop-blur flex items-center justify-between z-50"
      style={{ WebkitAppRegion: 'drag' } as React.CSSProperties}
    >
      {/* 标题 */}
      <div className="flex items-center gap-2 pl-4">
        <span className="text-sm text-zinc-400 font-medium">🍅 番茄钟</span>
      </div>

      {/* 窗口控制按钮 */}
      {isElectron && (
        <div
          className="flex h-full"
          style={{ WebkitAppRegion: 'no-drag' } as React.CSSProperties}
        >
          <button
            onClick={() => (window as any).api?.app?.minimize?.()}
            className="w-11 h-full flex items-center justify-center hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
          >
            <Minus size={14} />
          </button>
          <button
            onClick={() => (window as any).api?.app?.maximize?.()}
            className="w-11 h-full flex items-center justify-center hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
          >
            <Square size={12} />
          </button>
          <button
            onClick={() => (window as any).api?.app?.close?.()}
            className="w-11 h-full flex items-center justify-center hover:bg-red-500/80 text-zinc-400 hover:text-white transition-colors"
          >
            <X size={14} />
          </button>
        </div>
      )}
    </div>
  )
}
