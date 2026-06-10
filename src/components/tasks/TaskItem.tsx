import { Edit2, Trash2, Play, CheckCircle2, Circle } from 'lucide-react'
import type { Task, TaskStatus } from '@/types'
import { useTaskStore } from '@/stores/taskStore'
import { useTimerStore } from '@/stores/timerStore'
import { db } from '@/db/database'
import { relativeTime } from '@/utils/format'

interface Props {
  task: Task
}

export default function TaskItem({ task }: Props) {
  const { updateTask, deleteTask, setEditingTask, setShowForm } = useTaskStore()
  const { activeTaskId, setActiveTaskId } = useTimerStore()

  const isActive = activeTaskId === task.id

  const handleStatusChange = async (newStatus: TaskStatus) => {
    const updates: Partial<Task> = {
      status: newStatus,
      completed_at: newStatus === 'done' ? new Date().toISOString() : undefined,
    }
    if (task.id) {
      await db.tasks.update(task.id, updates)
      updateTask(task.id!, updates)
    }
  }

  const handleDelete = async () => {
    if (task.id) {
      await db.tasks.delete(task.id)
      deleteTask(task.id)
    }
  }

  const handleEdit = () => {
    setEditingTask(task)
    setShowForm(true)
  }

  const handleFocus = () => {
    setActiveTaskId(isActive ? null : task.id!)
  }

  const statusIcon =
    task.status === 'done' ? (
      <CheckCircle2 size={18} className="text-green-500" />
    ) : task.status === 'in_progress' ? (
      <Circle size={18} className="text-amber-500" fill="currentColor" />
    ) : (
      <Circle size={18} className="text-zinc-600" />
    )

  return (
    <div
      className={`group flex items-center gap-3 p-3 rounded-xl transition-all duration-200 ${
        isActive
          ? 'bg-tomato-500/10 border border-tomato-500/20'
          : 'hover:bg-white/5 border border-transparent'
      }`}
    >
      {/* 状态切换 */}
      <button
        onClick={() =>
          handleStatusChange(
            task.status === 'todo' ? 'in_progress' : task.status === 'in_progress' ? 'done' : 'todo'
          )
        }
        className="shrink-0"
        title="切换状态"
      >
        {statusIcon}
      </button>

      {/* 任务信息 */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span
            className={`text-sm font-medium truncate ${
              task.status === 'done' ? 'line-through text-zinc-600' : 'text-white'
            }`}
          >
            {task.title}
          </span>
          {task.tag && (
            <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-white/5 text-zinc-500 shrink-0">
              {task.tag}
            </span>
          )}
        </div>
        <div className="flex items-center gap-3 mt-0.5">
          <span className="text-xs text-zinc-600">
            🍅 {task.completed_pomodoros}/{task.estimated_pomodoros}
          </span>
          <span className="text-xs text-zinc-700">{relativeTime(task.created_at)}</span>
        </div>
      </div>

      {/* 操作按钮 */}
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={handleFocus}
          className={`p-1.5 rounded-lg transition-colors ${
            isActive
              ? 'bg-tomato-500/20 text-tomato-400'
              : 'hover:bg-white/10 text-zinc-500 hover:text-white'
          }`}
          title={isActive ? '取消关联' : '开始专注'}
        >
          <Play size={14} fill={isActive ? 'currentColor' : 'none'} />
        </button>
        <button
          onClick={handleEdit}
          className="p-1.5 rounded-lg hover:bg-white/10 text-zinc-500 hover:text-white transition-colors"
          title="编辑"
        >
          <Edit2 size={14} />
        </button>
        <button
          onClick={handleDelete}
          className="p-1.5 rounded-lg hover:bg-red-500/20 text-zinc-500 hover:text-red-400 transition-colors"
          title="删除"
        >
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  )
}
