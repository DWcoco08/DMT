import { supabase } from '@/lib/supabase'
import type { TimeSession } from '@/types/database'

export const timeSessionService = {
  async startSession(projectId: string): Promise<TimeSession> {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    const { data, error } = await supabase
      .from('time_sessions')
      .insert({
        user_id: user.id,
        project_id: projectId,
        start_time: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) throw error
    return data as TimeSession
  },

  async stopSession(id: string, duration: number): Promise<TimeSession> {
    const { data, error } = await supabase
      .from('time_sessions')
      .update({
        end_time: new Date().toISOString(),
        duration,
      })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data as TimeSession
  },

  async getRecentSessions(limit = 10): Promise<TimeSession[]> {
    const { data, error } = await supabase
      .from('time_sessions')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) throw error
    return data as TimeSession[]
  },

  async getSessionsForRange(startDate: string, endDate: string): Promise<TimeSession[]> {
    const { data, error } = await supabase
      .from('time_sessions')
      .select('*')
      .gte('start_time', startDate)
      .lte('start_time', endDate)
      .not('end_time', 'is', null)
      .order('start_time', { ascending: true })

    if (error) throw error
    return data as TimeSession[]
  },

  async getSessionsByProject(): Promise<{ project_id: string; total_duration: number }[]> {
    const { data, error } = await supabase
      .from('time_sessions')
      .select('project_id, duration')
      .not('end_time', 'is', null)

    if (error) throw error

    const grouped = new Map<string, number>()
    for (const row of data) {
      if (!row.project_id) continue
      const current = grouped.get(row.project_id) ?? 0
      grouped.set(row.project_id, current + (row.duration ?? 0))
    }

    return Array.from(grouped.entries()).map(([project_id, total_duration]) => ({
      project_id,
      total_duration,
    }))
  },
}
