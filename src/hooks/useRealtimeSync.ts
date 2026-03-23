import { useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'

const TABLES_TO_WATCH = ['tasks', 'projects', 'time_sessions', 'activities'] as const

export function useRealtimeSync() {
  const queryClient = useQueryClient()

  useEffect(() => {
    const channel = supabase
      .channel('db-changes')

    for (const table of TABLES_TO_WATCH) {
      channel.on(
        'postgres_changes',
        { event: '*', schema: 'public', table },
        () => {
          // Invalidate relevant queries when data changes
          switch (table) {
            case 'tasks':
              queryClient.invalidateQueries({ queryKey: ['tasks'] })
              break
            case 'projects':
              queryClient.invalidateQueries({ queryKey: ['projects'] })
              break
            case 'time_sessions':
              queryClient.invalidateQueries({ queryKey: ['time-sessions'] })
              queryClient.invalidateQueries({ queryKey: ['analytics'] })
              break
            case 'activities':
              queryClient.invalidateQueries({ queryKey: ['activities'] })
              break
          }
        }
      )
    }

    channel.subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [queryClient])
}
