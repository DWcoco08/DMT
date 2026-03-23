export interface Project {
  id: string
  user_id: string
  name: string
  color: string
  created_at: string
}

export type TaskStatus = 'pending' | 'in_progress' | 'completed'

export interface Task {
  id: string
  user_id: string
  project_id: string | null
  title: string
  description: string | null
  status: TaskStatus
  completed: boolean
  created_at: string
}

export interface TimeSession {
  id: string
  user_id: string
  project_id: string | null
  start_time: string
  end_time: string | null
  duration: number
  created_at: string
}

export interface Note {
  id: string
  user_id: string
  title: string
  content: string
  created_at: string
}

export type ActivityType =
  | 'task_created'
  | 'task_completed'
  | 'timer_started'
  | 'timer_stopped'
  | 'project_created'

export interface Activity {
  id: string
  user_id: string
  type: ActivityType
  metadata: Record<string, unknown>
  created_at: string
}
