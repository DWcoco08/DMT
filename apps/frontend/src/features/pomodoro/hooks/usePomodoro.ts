import { useEffect } from 'react'
import { usePomodoroStore } from '@/stores/pomodoroStore'
import { useNotification } from '@/hooks/useNotification'

export function usePomodoro() {
  const store = usePomodoroStore()
  const { requestPermission, send } = useNotification()

  useEffect(() => {
    if (!store.isRunning) return

    const interval = setInterval(() => {
      const finished = usePomodoroStore.getState().tick()
      if (finished) {
        const { mode } = usePomodoroStore.getState()
        if (mode === 'work') {
          send('Break time!', 'Great work! Take a short break.')
        } else {
          send('Back to work!', 'Break is over. Let\'s focus!')
        }
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [store.isRunning])

  function start() {
    requestPermission()
    store.start()
  }

  return {
    ...store,
    start,
  }
}
