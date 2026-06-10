import { useLocation, useNavigate } from 'react-router-dom'
import { Timer, ListTodo, BarChart3, Settings } from 'lucide-react'

const navItems = [
  { path: '/', label: '番茄钟', icon: Timer },
  { path: '/tasks', label: '任务', icon: ListTodo },
  { path: '/stats', label: '统计', icon: BarChart3 },
  { path: '/settings', label: '设置', icon: Settings },
]

export default function Sidebar() {
  const location = useLocation()
  const navigate = useNavigate()

  return (
    <aside className="w-52 h-full bg-zinc-900/50 border-r border-white/5 flex flex-col pt-9">
      <nav className="flex-1 p-3 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = location.pathname === item.path
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`nav-item ${isActive ? 'active' : ''}`}
            >
              <Icon size={20} />
              <span className="text-sm">{item.label}</span>
            </button>
          )
        })}
      </nav>

      {/* 底部版本信息 */}
      <div className="p-3 border-t border-white/5">
        <span className="text-xs text-zinc-600">v1.0.0</span>
      </div>
    </aside>
  )
}
