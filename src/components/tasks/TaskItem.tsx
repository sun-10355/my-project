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

  const nextStatus: Record<string, TaskStatus> = { todo: 'in_progress', in_progress: 'done', done: 'todo' }

  const handleFocus = () => {
    setActiveTaskId(isActive ? null : task.id!)
  }

  const statusIcon =
    task.status === 'done' ? (
      <CheckCircle2 size={18} style={{ color: 'var(--color-oliva)' }} />
    ) : task.status === 'in_progress' ? (
      <Circle size={18} style={{ color: 'var(--color-terracotta)' }} fill="currentColor" />
    ) : (
      <Circle size={18} style={{ color: 'var(--color-latte)', opacity: 0.5 }} />
    )

  return (
    <div
      className="group flex items-center gap-3 p-3 rounded-xl transition-all duration-200"
      style={
        isActive
          ? {
              background: 'rgba(224, 123, 90, 0.08)',
              borderLeft: '2px solid var(--color-terracotta)',
              border: '1px solid transparent',
            }
          : { border: '1px solid transparent' }
      }
    >
      {/* 状态切换 */}
      <button
        onClick={() => handleStatusChange(nextStatus[task.status])}
        className="shrink-0"
        title="切换状态"
      >
        {statusIcon}
      </button>

      {/* 任务信息 */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span
            className="text-sm font-medium truncate"
            style={
              task.status === 'done'
                ? { textDecoration: 'line-through', color: 'var(--color-latte)', opacity: 0.5 }
                : { color: 'var(--color-crema)' }
            }
          >
            {task.title}
          </span>
          {task.tag && (
            <span
              className="text-[10px] px-1.5 py-0.5 rounded-md shrink-0 select-none"
              style={{
                background: 'var(--color-caramel)',
                color: 'var(--color-latte)',
              }}
            >
              {task.tag}
            </span>
          )}
        </div>
        <div className="flex items-center gap-3 mt-0.5">
          <span style={{ color: 'var(--color-latte)', fontSize: '12px' }}>
            完成 {task.completed_pomodoros}/{task.estimated_pomodoros} 番茄
          </span>
          <span style={{ color: 'var(--color-latte)', opacity: 0.4, fontSize: '12px' }}>
            {relativeTime(task.created_at)}
          </span>
        </div>
      </div>

      {/* 操作按钮 */}
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={handleFocus}
          className="p-1.5 rounded-lg transition-colors"
          style={
            isActive
              ? { background: 'rgba(224, 123, 90, 0.2)', color: 'var(--color-terracotta)' }
              : {}
          }
          title={isActive ? '取消关联' : '开始专注'}
        >
          <Play size={14} fill={isActive ? 'currentColor' : 'none'} />
        </button>
        <button
          onClick={handleEdit}
          className="p-1.5 rounded-lg transition-colors"
          style={{ color: 'var(--color-latte)' }}
          title="编辑"
        >
          <Edit2 size={14} />
        </button>
        <button
          onClick={handleDelete}
          className="p-1.5 rounded-lg transition-colors"
          style={{ color: 'var(--color-latte)' }}
          title="删除"
        >
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  )
}
