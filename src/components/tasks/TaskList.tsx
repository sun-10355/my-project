import { useTaskStore } from '@/stores/taskStore'
import TaskItem from './TaskItem'

export default function TaskList() {
  const { tasks, filterStatus, filterTag, showForm, setShowForm } = useTaskStore()

  // 筛选
  const filtered = tasks.filter((t) => {
    if (filterStatus !== 'all' && t.status !== filterStatus) return false
    if (filterTag && t.tag !== filterTag) return false
    return true
  })

  // 排序: 未完成在前，按创建时间
  const sorted = [...filtered].sort((a, b) => {
    if (a.status === 'done' && b.status !== 'done') return 1
    if (a.status !== 'done' && b.status === 'done') return -1
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  })

  return (
    <div className="flex-1 overflow-y-auto">
      {sorted.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full text-zinc-600">
          <span className="text-4xl mb-3">📝</span>
          <p className="text-sm">还没有任务</p>
          <button onClick={() => setShowForm(true)} className="btn-ghost mt-4 text-sm">
            创建第一个任务
          </button>
        </div>
      ) : (
        <div className="space-y-1 p-1">
          {sorted.map((task) => (
            <TaskItem key={task.id} task={task} />
          ))}
        </div>
      )}
    </div>
  )
}
