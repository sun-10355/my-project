import { useState } from 'react'
import { Download, FileJson, FileSpreadsheet } from 'lucide-react'
import { handleExport } from '@/utils/export'

export default function StatsExport() {
  const [exporting, setExporting] = useState(false)
  const [done, setDone] = useState(false)

  const doExport = async (format: 'csv' | 'json') => {
    setExporting(true)
    const result = await handleExport(format)
    setExporting(false)
    if (result) {
      setDone(true)
      setTimeout(() => setDone(false), 2000)
    }
  }

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={() => doExport('csv')}
        disabled={exporting}
        className="btn-ghost flex items-center gap-2 text-sm"
      >
        <FileSpreadsheet size={16} />
        导出 CSV
      </button>
      <button
        onClick={() => doExport('json')}
        disabled={exporting}
        className="btn-ghost flex items-center gap-2 text-sm"
      >
        <FileJson size={16} />
        导出 JSON
      </button>
      {exporting && <Download size={16} className="text-zinc-500 animate-bounce" />}
      {done && <span className="text-xs text-green-400">导出完成 ✓</span>}
    </div>
  )
}
