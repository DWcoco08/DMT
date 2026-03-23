import { supabase } from '@/lib/supabase'
import type { Task, TaskStatus } from '@/types/database'

export interface TaskFilters {
  status?: TaskStatus
  completed?: boolean
  project_id?: string
}

export const taskService = {
  async getTasks(filters?: TaskFilters): Promise<Task[]> {
    let query = supabase
      .from('tasks')
      .select('*')
      .order('created_at', { ascending: false })

    if (filters?.project_id) {
      query = query.eq('project_id', filters.project_id)
    }

    const { data, error } = await query
    if (error) throw error

    let tasks = data as Task[]

    // Client-side status filter (handles DB without status column)
    if (filters?.status) {
      tasks = tasks.filter((t) => {
        const s = t.status || (t.completed ? 'completed' : 'todo')
        return s === filters.status
      })
    }

    return tasks
  },

  async createTask(title: string, description?: string, projectId?: string): Promise<Task> {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    const insert: Record<string, unknown> = {
      user_id: user.id,
      title,
      project_id: projectId || null,
    }

    insert.description = description || null
    insert.status = 'todo'

    const { data, error } = await supabase
      .from('tasks')
      .insert(insert)
      .select()
      .single()

    if (error) {
      // Retry without new columns if they don't exist
      if (error.message?.includes('status') || error.message?.includes('description')) {
        const { data: retryData, error: retryError } = await supabase
          .from('tasks')
          .insert({ user_id: user.id, title, project_id: projectId || null })
          .select()
          .single()
        if (retryError) throw retryError
        return retryData as Task
      }
      throw error
    }
    return data as Task
  },

  async updateTaskStatus(id: string, status: TaskStatus): Promise<Task> {
    const completed = status === 'completed'

    // Try with status column first
    const { data, error } = await supabase
      .from('tasks')
      .update({ status, completed })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      // Fallback: only update completed if status column doesn't exist
      const { data: fallback, error: fbError } = await supabase
        .from('tasks')
        .update({ completed })
        .eq('id', id)
        .select()
        .single()
      if (fbError) throw fbError
      return { ...fallback, status } as Task
    }
    return data as Task
  },

  async updateTask(id: string, updates: Partial<Pick<Task, 'title' | 'description' | 'project_id'>>): Promise<Task> {
    const { data, error } = await supabase
      .from('tasks')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data as Task
  },

  async deleteTask(id: string): Promise<void> {
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', id)

    if (error) throw error
  },
}
