import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type Theme = 'light' | 'dark' | 'system' | 'ocean' | 'forest' | 'purple'

interface ThemeState {
  theme: Theme
  setTheme: (theme: Theme) => void
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      theme: 'system',
      setTheme: (theme) => set({ theme }),
    }),
    { name: 'dmt-theme' }
  )
)

const DARK_THEMES: Theme[] = ['dark', 'ocean', 'forest', 'purple']

export function applyTheme(theme: Theme) {
  const root = document.documentElement

  // Remove all theme classes
  root.classList.remove('dark', 'theme-ocean', 'theme-forest', 'theme-purple')

  if (theme === 'system') {
    const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    root.classList.toggle('dark', isDark)
    return
  }

  if (DARK_THEMES.includes(theme)) {
    root.classList.add('dark')
  }

  if (theme === 'ocean') root.classList.add('theme-ocean')
  if (theme === 'forest') root.classList.add('theme-forest')
  if (theme === 'purple') root.classList.add('theme-purple')
}
