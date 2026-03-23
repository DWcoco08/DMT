import { supabase } from '@/lib/supabase'
import type { Project } from '@/types/database'

export const projectService = {
  async getProjects(): Promise<Project[]> {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    return data as Project[]
  },

  async createProject(name: string, color = '#6366f1'): Promise<Project> {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    const { data, error } = await supabase
      .from('projects')
      .insert({ user_id: user.id, name, color })
      .select()
      .single()

    if (error) throw error
    return data as Project
  },

  async updateProject(id: string, updates: Partial<Pick<Project, 'name' | 'color'>>): Promise<Project> {
    const { data, error } = await supabase
      .from('projects')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data as Project
  },

  async deleteProject(id: string): Promise<void> {
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id)

    if (error) throw error
  },
}
