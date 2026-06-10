import { Routes, Route } from 'react-router-dom'
import Sidebar from '@/components/layout/Sidebar'
import TitleBar from '@/components/layout/TitleBar'
import TimerPage from '@/pages/TimerPage'
import TasksPage from '@/pages/TasksPage'
import StatsPage from '@/pages/StatsPage'
import SettingsPage from '@/pages/SettingsPage'

export default function App() {
  return (
    <div className="flex flex-col h-screen w-screen">
      {/* 自定义标题栏 */}
      <TitleBar />

      {/* 主体区域 */}
      <div className="flex flex-1 pt-9">
        {/* 侧边栏 */}
        <Sidebar />

        {/* 页面内容 */}
        <main className="flex-1 p-8 overflow-hidden">
          <Routes>
            <Route path="/" element={<TimerPage />} />
            <Route path="/tasks" element={<TasksPage />} />
            <Route path="/stats" element={<StatsPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Routes>
        </main>
      </div>
    </div>
  )
}
