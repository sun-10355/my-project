import { useEffect } from 'react'
import StatsOverview from '@/components/stats/StatsOverview'
import StatsChart from '@/components/stats/StatsChart'
import StatsExport from '@/components/stats/StatsExport'
import { useStatsStore } from '@/stores/statsStore'
import { db } from '@/db/database'

export default function StatsPage() {
  const { setOverview } = useStatsStore()

  useEffect(() => {
    async function loadOverview() {
      try {
        const overview = await db.sessions.getOverview()
        if (overview) {
          setOverview(overview)
        }
      } catch (e) {
        console.error('加载统计数据失败:', e)
      }
    }
    loadOverview()
  }, [setOverview])

  return (
    <div className="flex flex-col h-full">
      {/* 顶部栏 */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-white">📈 统计报告</h2>
          <p className="text-sm text-zinc-500 mt-1">追踪你的专注时间，回顾工作模式</p>
        </div>
        <StatsExport />
      </div>

      <div className="space-y-6 overflow-y-auto flex-1">
        {/* 概览卡片 */}
        <StatsOverview />

        {/* 图表 */}
        <StatsChart />
      </div>
    </div>
  )
}
