import { create } from 'zustand'
import type { Task, TaskStatus } from '@/types'

interface TaskStore {
  tasks: Task[]
  filterStatus: TaskStatus | 'all'
  filterTag: string
  editingTask: Task | null
  showForm: boolean

  setTasks: (tasks: Task[]) => void
  addTask: (task: Task) => void
  updateTask: (id: number, updates: Partial<Task>) => void
  deleteTask: (id: number) => void
  setFilterStatus: (status: TaskStatus | 'all') => void
  setFilterTag: (tag: string) => void
  setEditingTask: (task: Task | null) => void
  setShowForm: (show: boolean) => void
}

export const useTaskStore = create<TaskStore>((set) => ({
  tasks: [],
  filterStatus: 'all',
  filterTag: '',
  editingTask: null,
  showForm: false,

  setTasks: (tasks) => set({ tasks }),
  addTask: (task) => set((s) => ({ tasks: [...s.tasks, task] })),
  updateTask: (id, updates) =>
    set((s) => ({
      tasks: s.tasks.map((t) => (t.id === id ? { ...t, ...updates } : t)),
    })),
  deleteTask: (id) =>
    set((s) => ({
      tasks: s.tasks.filter((t) => t.id !== id),
    })),
  setFilterStatus: (status) => set({ filterStatus: status }),
  setFilterTag: (tag) => set({ filterTag: tag }),
  setEditingTask: (task) => set({ editingTask: task }),
  setShowForm: (show) => set({ showForm: show }),
}))
