import { useEffect } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { useTimerStore } from '@/stores/timerStore'
import { timeSessionService } from '../services/timeSessionService'
import { activityService } from '@/features/activity/services/activityService'

export function useTimer() {
  const store = useTimerStore()
  const queryClient = useQueryClient()

  // Tick interval
  useEffect(() => {
    if (!store.isRunning) return
    // Immediately tick to recover elapsed after refresh
    store.tick()
    const interval = setInterval(() => store.tick(), 1000)
    return () => clearInterval(interval)
  }, [store.isRunning])

  const startMutation = useMutation({
    mutationFn: (projectId: string) => timeSessionService.startSession(projectId),
    onSuccess: (session, projectId) => {
      store.start(projectId, session.id)
      activityService.logActivity('timer_started', { project_id: projectId })
    },
    onError: () => toast.error('Failed to start timer'),
  })

  const stopMutation = useMutation({
    mutationFn: () => {
      if (!store.sessionId) throw new Error('No active session')
      return timeSessionService.stopSession(store.sessionId, store.elapsed)
    },
    onSuccess: () => {
      activityService.logActivity('timer_stopped', {
        project_id: store.projectId,
        duration: store.elapsed,
      })
      store.stop()
      queryClient.invalidateQueries({ queryKey: ['time-sessions'] })
      queryClient.invalidateQueries({ queryKey: ['analytics'] })
      queryClient.invalidateQueries({ queryKey: ['activities'] })
    },
    onError: () => toast.error('Failed to stop timer'),
  })

  return {
    isRunning: store.isRunning,
    elapsed: store.elapsed,
    activeProjectId: store.projectId,
    start: (projectId: string) => startMutation.mutate(projectId),
    stop: () => stopMutation.mutate(),
    isStarting: startMutation.isPending,
    isStopping: stopMutation.isPending,
  }
}
