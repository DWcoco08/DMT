import { supabase } from '@/lib/supabase'
import { startOfDay, subDays, format, startOfWeek, endOfWeek, subWeeks } from 'date-fns'

export interface DailyHoursData {
  date: string
  hours: number
}

export interface WeeklyHoursData {
  week: string
  hours: number
}

export const analyticsService = {
  async getDailyHours(days = 7): Promise<DailyHoursData[]> {
    const startDate = startOfDay(subDays(new Date(), days - 1)).toISOString()

    const { data, error } = await supabase
      .from('time_sessions')
      .select('start_time, duration')
      .gte('start_time', startDate)
      .not('end_time', 'is', null)

    if (error) throw error

    const grouped = new Map<string, number>()

    // Initialize all days
    for (let i = days - 1; i >= 0; i--) {
      const date = format(subDays(new Date(), i), 'yyyy-MM-dd')
      grouped.set(date, 0)
    }

    for (const row of data) {
      const date = format(new Date(row.start_time), 'yyyy-MM-dd')
      const current = grouped.get(date) ?? 0
      grouped.set(date, current + (row.duration ?? 0))
    }

    return Array.from(grouped.entries()).map(([date, seconds]) => ({
      date: format(new Date(date), 'EEE'),
      hours: Math.round((seconds / 3600) * 10) / 10,
    }))
  },

  async getWeeklyHours(weeks = 4): Promise<WeeklyHoursData[]> {
    const startDate = startOfWeek(subWeeks(new Date(), weeks - 1)).toISOString()

    const { data, error } = await supabase
      .from('time_sessions')
      .select('start_time, duration')
      .gte('start_time', startDate)
      .not('end_time', 'is', null)

    if (error) throw error

    const grouped = new Map<string, number>()

    // Initialize all weeks
    for (let i = weeks - 1; i >= 0; i--) {
      const weekStart = startOfWeek(subWeeks(new Date(), i))
      const weekEnd = endOfWeek(subWeeks(new Date(), i))
      const label = `${format(weekStart, 'MMM d')}-${format(weekEnd, 'd')}`
      grouped.set(label, 0)
    }

    for (const row of data) {
      const weekStart = startOfWeek(new Date(row.start_time))
      const weekEnd = endOfWeek(new Date(row.start_time))
      const label = `${format(weekStart, 'MMM d')}-${format(weekEnd, 'd')}`
      const current = grouped.get(label) ?? 0
      grouped.set(label, current + (row.duration ?? 0))
    }

    return Array.from(grouped.entries()).map(([week, seconds]) => ({
      week,
      hours: Math.round((seconds / 3600) * 10) / 10,
    }))
  },

  async getProductivityStats(): Promise<{
    secondsToday: number
    secondsThisWeek: number
    tasksCompletedToday: number
  }> {
    const todayStart = startOfDay(new Date()).toISOString()
    const weekStart = startOfWeek(new Date()).toISOString()

    const [sessionsToday, sessionsWeek, tasksToday] = await Promise.all([
      supabase
        .from('time_sessions')
        .select('duration')
        .gte('start_time', todayStart)
        .not('end_time', 'is', null),
      supabase
        .from('time_sessions')
        .select('duration')
        .gte('start_time', weekStart)
        .not('end_time', 'is', null),
      supabase
        .from('tasks')
        .select('id')
        .eq('completed', true)
        .gte('created_at', todayStart),
    ])

    if (sessionsToday.error) throw sessionsToday.error
    if (sessionsWeek.error) throw sessionsWeek.error
    if (tasksToday.error) throw tasksToday.error

    const sumDuration = (rows: { duration: number }[]) =>
      rows.reduce((sum, r) => sum + (r.duration ?? 0), 0)

    return {
      secondsToday: sumDuration(sessionsToday.data),
      secondsThisWeek: sumDuration(sessionsWeek.data),
      tasksCompletedToday: tasksToday.data.length,
    }
  },

  async getAllTimeStats(): Promise<{
    totalSeconds: number
    totalSessions: number
    avgSecondsPerDay: number
    longestSession: number
  }> {
    const { data, error } = await supabase
      .from('time_sessions')
      .select('duration, start_time')
      .not('end_time', 'is', null)

    if (error) throw error

    const totalSeconds = data.reduce((sum, r) => sum + (r.duration ?? 0), 0)
    const longestSession = data.reduce((max, r) => Math.max(max, r.duration ?? 0), 0)
    const days = new Set(data.map((r) => format(new Date(r.start_time), 'yyyy-MM-dd'))).size

    return {
      totalSeconds,
      totalSessions: data.length,
      avgSecondsPerDay: days > 0 ? Math.round(totalSeconds / days) : 0,
      longestSession,
    }
  },
}
