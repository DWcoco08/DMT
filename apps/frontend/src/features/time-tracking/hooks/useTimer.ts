import { useEffect, useRef } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { useTimerStore } from '@/stores/timerStore'
import { timeSessionService } from '../services/timeSessionService'
import { activityService } from '@/features/activity/services/activityService'
import { useNotification } from '@/hooks/useNotification'

const THRESHOLDS = [
  { seconds: 3600, label: "You've been working for 1 hour", level: 'info' as const },
  { seconds: 7200, label: "2 hours! Consider a short break", level: 'warning' as const },
  { seconds: 14400, label: "4 hours — time for a real break!", level: 'danger' as const },
]

export function useTimer() {
  const store = useTimerStore()
  const queryClient = useQueryClient()
  const { requestPermission, send } = useNotification()
  const notifiedThresholds = useRef(new Set<number>())

  // Tick interval + threshold checks
  useEffect(() => {
    if (!store.isRunning) {
      notifiedThresholds.current.clear()
      return
    }
    store.tick()
    const interval = setInterval(() => {
      store.tick()
      const elapsed = useTimerStore.getState().elapsed
      for (const t of THRESHOLDS) {
        if (elapsed >= t.seconds && !notifiedThresholds.current.has(t.seconds)) {
          notifiedThresholds.current.add(t.seconds)
          if (t.level === 'info') toast.info(t.label)
          else if (t.level === 'warning') toast.warning(t.label)
          else toast.error(t.label)
          send('DevPulse Timer', t.label)
        }
      }
    }, 1000)
    return () => clearInterval(interval)
  }, [store.isRunning])

  const startMutation = useMutation({
    mutationFn: (projectId: string) => timeSessionService.startSession(projectId),
    onSuccess: (session, projectId) => {
      store.start(projectId, session.id)
      activityService.logActivity('timer_started', { project_id: projectId })
      requestPermission()
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

  // Determine visual warning level
  const elapsed = store.elapsed
  const warningLevel =
    elapsed >= 14400 ? 'danger' :
    elapsed >= 7200 ? 'warning' :
    null

  return {
    isRunning: store.isRunning,
    elapsed,
    activeProjectId: store.projectId,
    warningLevel,
    start: (projectId: string) => startMutation.mutate(projectId),
    stop: () => stopMutation.mutate(),
    isStarting: startMutation.isPending,
    isStopping: stopMutation.isPending,
  }
}
