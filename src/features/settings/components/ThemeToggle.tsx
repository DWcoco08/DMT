import { Monitor, Moon, Sun } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useThemeStore } from '@/stores/themeStore'

const themes = [
  { key: 'light' as const, label: 'Light', icon: Sun },
  { key: 'dark' as const, label: 'Dark', icon: Moon },
  { key: 'system' as const, label: 'System', icon: Monitor },
]

export function ThemeToggle() {
  const { theme, setTheme } = useThemeStore()

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-foreground">Theme</label>
      <div className="flex gap-2">
        {themes.map((t) => (
          <button
            key={t.key}
            onClick={() => setTheme(t.key)}
            className={cn(
              'flex flex-1 items-center justify-center gap-2 rounded-lg border p-3 text-sm font-medium transition-colors',
              theme === t.key
                ? 'border-primary bg-primary/10 text-primary'
                : 'border-border text-muted-foreground hover:bg-accent/50'
            )}
          >
            <t.icon className="h-4 w-4" />
            {t.label}
          </button>
        ))}
      </div>
    </div>
  )
}
