import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import { useTaskStore } from '@/stores/taskStore'
import { db } from '@/db/database'
import type { Task } from '@/types'

export default function TaskForm() {
  const { editingTask, setEditingTask, setShowForm, addTask, updateTask } = useTaskStore()

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [tag, setTag] = useState('')
  const [estimatedPomodoros, setEstimatedPomodoros] = useState(1)

  useEffect(() => {
    if (editingTask) {
      setTitle(editingTask.title)
      setDescription(editingTask.description || '')
      setTag(editingTask.tag || '')
      setEstimatedPomodoros(editingTask.estimated_pomodoros || 1)
    }
  }, [editingTask])

  const handleSubmit = async () => {
    if (!title.trim()) return

    const taskData: Partial<Task> = {
      title: title.trim(),
      description: description.trim(),
      tag: tag.trim(),
      estimated_pomodoros: estimatedPomodoros,
    }

    if (editingTask?.id) {
      await db.tasks.update(editingTask.id, taskData)
      updateTask(editingTask.id, taskData)
    } else {
      const id = await db.tasks.insert({
        ...taskData,
        status: 'todo',
        completed_pomodoros: 0,
        created_at: new Date().toISOString(),
      } as any)
      const newTask: Task = {
        id,
        ...taskData,
        status: 'todo',
        completed_pomodoros: 0,
        created_at: new Date().toISOString(),
      } as Task
      addTask(newTask)
    }

    handleClose()
  }

  const handleClose = () => {
    setTitle('')
    setDescription('')
    setTag('')
    setEstimatedPomodoros(1)
    setEditingTask(null)
    setShowForm(false)
  }

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-40"
      style={{ background: 'rgba(26, 22, 20, 0.7)', backdropFilter: 'blur(4px)' }}
    >
      <div className="card w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 style={{ color: 'var(--color-crema)', fontSize: '18px', fontWeight: 600 }}>
            {editingTask ? '编辑任务' : '新建任务'}
          </h3>
          <button
            onClick={handleClose}
            style={{ color: 'var(--color-latte)' }}
            className="hover:opacity-80 transition-opacity"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-4">
          {/* 标题 */}
          <div>
            <label
              className="block text-sm mb-1.5"
              style={{ color: 'var(--color-latte)' }}
            >
              任务名称
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="要做什么？"
              className="input-field w-full"
              autoFocus
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            />
          </div>

          {/* 描述 */}
          <div>
            <label
              className="block text-sm mb-1.5"
              style={{ color: 'var(--color-latte)' }}
            >
              描述 (可选)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="添加备注..."
              className="input-field w-full resize-none h-20"
              rows={3}
            />
          </div>

          {/* 标签 & 预估番茄数 */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label
                className="block text-sm mb-1.5"
                style={{ color: 'var(--color-latte)' }}
              >
                标签
              </label>
              <input
                type="text"
                value={tag}
                onChange={(e) => setTag(e.target.value)}
                placeholder="如: 工作, 学习"
                className="input-field w-full"
              />
            </div>
            <div>
              <label
                className="block text-sm mb-1.5"
                style={{ color: 'var(--color-latte)' }}
              >
                预估番茄数
              </label>
              <input
                type="number"
                value={estimatedPomodoros}
                onChange={(e) => setEstimatedPomodoros(Math.max(1, parseInt(e.target.value) || 1))}
                className="input-field w-full"
                min={1}
                max={20}
              />
            </div>
          </div>

          {/* 按钮 */}
          <div className="flex gap-3 pt-2">
            <button onClick={handleClose} className="btn-ghost flex-1">
              取消
            </button>
            <button
              onClick={handleSubmit}
              disabled={!title.trim()}
              className="btn-primary flex-1"
            >
              {editingTask ? '保存' : '创建'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
