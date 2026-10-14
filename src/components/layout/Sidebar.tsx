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
    <aside
      className="w-48 h-full flex flex-col pt-9"
      style={{
        background: 'var(--color-caramel)',
        boxShadow: 'inset -4px 0 8px rgba(26, 22, 20, 0.3)',
      }}
    >
      <nav className="flex-1 p-3 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = location.pathname === item.path
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`nav-item ${isActive ? 'active' : ''}`}
              style={isActive ? { borderRadius: '0 12px 12px 0', marginLeft: '-12px', paddingLeft: '28px' } : {}}
            >
              <Icon size={20} />
              <span className="text-sm">{item.label}</span>
            </button>
          )
        })}
      </nav>

      {/* 底部版本信息 */}
      <div className="p-3" style={{ borderTop: '1px solid rgba(168, 152, 132, 0.12)' }}>
        <span style={{ color: 'var(--color-latte)', fontSize: '12px' }}>v1.0.0</span>
      </div>
    </aside>
  )
}
