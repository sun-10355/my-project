// 番茄钟会话类型
export type SessionType = 'work' | 'short_break' | 'long_break'

// 任务状态
export type TaskStatus = 'todo' | 'in_progress' | 'done'

// 计时器运行状态
export type TimerState = 'idle' | 'running' | 'paused' | 'finished'

// 番茄钟会话
export interface PomodoroSession {
  id?: number
  task_id?: number | null
  type: SessionType
  duration_minutes: number
  started_at: string
  ended_at?: string
  completed: number // 0 或 1
  interrupted: number // 0 或 1
}

// 任务
export interface Task {
  id?: number
  title: string
  description: string
  tag: string
  status: TaskStatus
  estimated_pomodoros: number
  completed_pomodoros: number
  created_at: string
  completed_at?: string
}

// 应用设置
export interface AppSettings {
  work_duration: number          // 工作时长 (分钟), 默认 25
  short_break_duration: number   // 短休息时长, 默认 5
  long_break_duration: number    // 长休息时长, 默认 15
  long_break_interval: number    // 多少个番茄后长休息, 默认 4
  auto_start_breaks: boolean     // 自动开始休息
  auto_start_work: boolean       // 自动开始工作
  notification_enabled: boolean  // 启用桌面通知
  sound_enabled: boolean         // 启用音效
  sound_volume: number           // 音量 0-100
  minimize_to_tray: boolean      // 关闭时最小化到托盘
  always_on_top: boolean         // 窗口置顶
}

// 统计概览
export interface StatsOverview {
  today_pomodoros: number
  week_pomodoros: number
  month_pomodoros: number
  total_hours: number
  today_work_minutes: number
  week_work_minutes: number
}

// 每日统计
export interface DailyStats {
  date: string
  pomodoros: number
  work_minutes: number
}
