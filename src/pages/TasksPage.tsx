import { useEffect } from 'react'
import { Plus } from 'lucide-react'
import TaskList from '@/components/tasks/TaskList'
import TaskFilter from '@/components/tasks/TaskFilter'
import TaskForm from '@/components/tasks/TaskForm'
import { useTaskStore } from '@/stores/taskStore'
import { db } from '@/db/database'

export default function TasksPage() {
  const { showForm, setShowForm, setTasks } = useTaskStore()

  useEffect(() => {
    // 从数据库加载任务
    async function loadTasks() {
      try {
        const tasks = await db.tasks.getAll()
        if (tasks && tasks.length > 0) {
          setTasks(tasks)
        }
      } catch (e) {
        console.error('加载任务失败:', e)
      }
    }
    loadTasks()
  }, [setTasks])

  return (
    <div className="flex flex-col h-full">
      {/* 顶部栏 */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold" style={{ color: 'var(--color-crema)' }}>任务列表</h2>
          <p className="text-sm mt-1" style={{ color: 'var(--color-latte)' }}>管理你的待办任务，关联番茄钟专注</p>
        </div>
        <button onClick={() => setShowForm(true)} className="btn-primary flex items-center gap-2">
          <Plus size={18} />
          新建任务
        </button>
      </div>

      {/* 筛选 */}
      <div className="mb-4">
        <TaskFilter />
      </div>

      {/* 任务列表 */}
      <TaskList />

      {/* 新建/编辑表单弹窗 */}
      {showForm && <TaskForm />}
    </div>
  )
}
