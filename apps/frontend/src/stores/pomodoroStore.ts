import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type PomodoroMode = 'work' | 'break' | 'longBreak'

const DURATIONS: Record<PomodoroMode, number> = {
  work: 25 * 60,
  break: 5 * 60,
  longBreak: 15 * 60,
}

interface PomodoroState {
  mode: PomodoroMode
  timeLeft: number
  isRunning: boolean
  completedPomodoros: number
  projectId: string | null

  setProjectId: (id: string | null) => void
  start: () => void
  pause: () => void
  reset: () => void
  tick: () => boolean // returns true if timer finished
  skip: () => void
  switchMode: (mode: PomodoroMode) => void
}

function getNextMode(current: PomodoroMode, completed: number): PomodoroMode {
  if (current === 'work') {
    return (completed + 1) % 4 === 0 ? 'longBreak' : 'break'
  }
  return 'work'
}

export const usePomodoroStore = create<PomodoroState>()(
  persist(
    (set, get) => ({
      mode: 'work',
      timeLeft: DURATIONS.work,
      isRunning: false,
      completedPomodoros: 0,
      projectId: null,

      setProjectId: (id) => set({ projectId: id }),

      start: () => set({ isRunning: true }),

      pause: () => set({ isRunning: false }),

      reset: () => {
        const { mode } = get()
        set({ timeLeft: DURATIONS[mode], isRunning: false })
      },

      tick: () => {
        const { timeLeft, mode, completedPomodoros } = get()
        if (timeLeft <= 1) {
          const newCompleted = mode === 'work' ? completedPomodoros + 1 : completedPomodoros
          const nextMode = getNextMode(mode, completedPomodoros)
          set({
            mode: nextMode,
            timeLeft: DURATIONS[nextMode],
            isRunning: false,
            completedPomodoros: newCompleted,
          })
          return true // finished
        }
        set({ timeLeft: timeLeft - 1 })
        return false
      },

      skip: () => {
        const { mode, completedPomodoros } = get()
        const nextMode = getNextMode(mode, completedPomodoros)
        set({
          mode: nextMode,
          timeLeft: DURATIONS[nextMode],
          isRunning: false,
        })
      },

      switchMode: (mode) => set({ mode, timeLeft: DURATIONS[mode], isRunning: false }),
    }),
    { name: 'dmt-pomodoro' }
  )
)
