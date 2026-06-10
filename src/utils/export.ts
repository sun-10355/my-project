import { db } from '@/db/database'

export async function exportSessionsCSV(): Promise<string> {
  const stats = await db.sessions.getRange('2000-01-01', '2099-12-31')
  if (!stats || stats.length === 0) return ''

  const headers = ['ID', '类型', '时长(分钟)', '开始时间', '结束时间', '完成', '中断']
  const rows = stats.map((s: any) => [
    s.id,
    s.type === 'work' ? '工作' : s.type === 'short_break' ? '短休息' : '长休息',
    s.duration_minutes,
    s.started_at,
    s.ended_at || '',
    s.completed ? '是' : '否',
    s.interrupted ? '是' : '否',
  ])

  return [headers.join(','), ...rows.map((r: any[]) => r.join(','))].join('\n')
}

export async function exportSessionsJSON(): Promise<string> {
  const stats = await db.sessions.getRange('2000-01-01', '2099-12-31')
  return JSON.stringify(stats, null, 2)
}

export async function handleExport(format: 'csv' | 'json') {
  try {
    const data = format === 'csv' ? await exportSessionsCSV() : await exportSessionsJSON()
    if (!data) return false
    const ext = format === 'csv' ? 'csv' : 'json'
    const name = `pomodoro-sessions-${new Date().toISOString().slice(0, 10)}`
    return await db.dialog.exportFile(data, name, ext)
  } catch {
    return false
  }
}
