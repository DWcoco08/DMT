import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface TimerState {
  isRunning: boolean
  startTime: number | null // timestamp ms
  projectId: string | null
  sessionId: string | null
  elapsed: number // seconds

  start: (projectId: string, sessionId: string) => void
  stop: () => void
  tick: () => void
  reset: () => void
}

export const useTimerStore = create<TimerState>()(
  persist(
    (set, get) => ({
      isRunning: false,
      startTime: null,
      projectId: null,
      sessionId: null,
      elapsed: 0,

      start: (projectId, sessionId) =>
        set({
          isRunning: true,
          startTime: Date.now(),
          projectId,
          sessionId,
          elapsed: 0,
        }),

      stop: () =>
        set({
          isRunning: false,
          startTime: null,
          projectId: null,
          sessionId: null,
          elapsed: 0,
        }),

      tick: () => {
        const { startTime, isRunning } = get()
        if (!isRunning || !startTime) return
        set({ elapsed: Math.floor((Date.now() - startTime) / 1000) })
      },

      reset: () =>
        set({
          isRunning: false,
          startTime: null,
          projectId: null,
          sessionId: null,
          elapsed: 0,
        }),
    }),
    { name: 'dmt-timer' }
  )
)
