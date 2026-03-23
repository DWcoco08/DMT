import { supabase } from '@/lib/supabase'
import type { Activity, ActivityType } from '@/types/database'

export const activityService = {
  async logActivity(type: ActivityType, metadata: Record<string, unknown> = {}) {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { error } = await supabase.from('activities').insert({
      user_id: user.id,
      type,
      metadata,
    })
    if (error) throw error
  },

  async getActivities(limit = 20): Promise<Activity[]> {
    const { data, error } = await supabase
      .from('activities')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) throw error
    return data as Activity[]
  },
}
