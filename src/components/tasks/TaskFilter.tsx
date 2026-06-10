import { useTaskStore } from '@/stores/taskStore'
import type { TaskStatus } from '@/types'

const statusOptions: { value: TaskStatus | 'all'; label: string }[] = [
  { value: 'all', label: '全部' },
  { value: 'todo', label: '待办' },
  { value: 'in_progress', label: '进行中' },
  { value: 'done', label: '已完成' },
]

export default function TaskFilter() {
  const { filterStatus, filterTag, setFilterStatus, setFilterTag, tasks } = useTaskStore()

  // 提取所有唯一标签
  const allTags = [...new Set(tasks.map((t) => t.tag).filter(Boolean))]

  return (
    <div className="flex items-center gap-4">
      {/* 状态筛选 */}
      <div className="flex gap-1">
        {statusOptions.map((opt) => (
          <button
            key={opt.value}
            onClick={() => setFilterStatus(opt.value)}
            className={`text-xs px-3 py-1.5 rounded-lg transition-all duration-200 ${
              filterStatus === opt.value
                ? 'bg-white/10 text-white'
                : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* 标签筛选 */}
      {allTags.length > 0 && (
        <div className="flex gap-1">
          <button
            onClick={() => setFilterTag('')}
            className={`text-xs px-3 py-1.5 rounded-lg transition-all duration-200 ${
              !filterTag ? 'bg-white/10 text-white' : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            全部标签
          </button>
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setFilterTag(tag === filterTag ? '' : tag)}
              className={`text-xs px-3 py-1.5 rounded-lg transition-all duration-200 ${
                filterTag === tag
                  ? 'bg-primary-600/20 text-primary-400'
                  : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
