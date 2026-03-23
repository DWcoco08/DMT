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

    if (filters?.status) {
      query = query.eq('status', filters.status)
    }
    if (filters?.completed !== undefined) {
      query = query.eq('completed', filters.completed)
    }
    if (filters?.project_id) {
      query = query.eq('project_id', filters.project_id)
    }

    const { data, error } = await query
    if (error) throw error
    return data as Task[]
  },

  async createTask(title: string, description?: string, projectId?: string): Promise<Task> {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    const { data, error } = await supabase
      .from('tasks')
      .insert({
        user_id: user.id,
        title,
        description: description || null,
        project_id: projectId || null,
        status: 'pending',
      })
      .select()
      .single()

    if (error) throw error
    return data as Task
  },

  async updateTaskStatus(id: string, status: TaskStatus): Promise<Task> {
    const { data, error } = await supabase
      .from('tasks')
      .update({ status, completed: status === 'completed' })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
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
