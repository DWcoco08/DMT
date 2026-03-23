import { Monitor, Moon, Sun, Waves, TreePine, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useThemeStore, type Theme } from '@/stores/themeStore'

const themes: { key: Theme; label: string; icon: typeof Sun; preview: string; desc: string }[] = [
  { key: 'light', label: 'Light', icon: Sun, preview: 'bg-white border-zinc-200', desc: 'Clean and bright' },
  { key: 'dark', label: 'Dark', icon: Moon, preview: 'bg-[#0d0508] border-red-900/30', desc: 'Red-black tone' },
  { key: 'system', label: 'System', icon: Monitor, preview: 'bg-gradient-to-r from-white to-zinc-900 border-zinc-300', desc: 'Follow OS setting' },
  { key: 'ocean', label: 'Ocean', icon: Waves, preview: 'bg-[#0d1117] border-blue-800/30', desc: 'Deep blue' },
  { key: 'forest', label: 'Forest', icon: TreePine, preview: 'bg-[#0a0f0a] border-green-800/30', desc: 'Dark green' },
  { key: 'purple', label: 'Purple', icon: Sparkles, preview: 'bg-[#0f0a14] border-purple-800/30', desc: 'Deep violet' },
]

export function ThemeToggle() {
  const { theme, setTheme } = useThemeStore()

  return (
    <div className="space-y-3">
      <label className="text-sm font-medium text-foreground">Theme</label>
      <div className="grid grid-cols-3 gap-2">
        {themes.map((t) => (
          <button
            key={t.key}
            onClick={() => setTheme(t.key)}
            className={cn(
              'flex flex-col items-center gap-2 rounded-xl border p-3 transition-all',
              theme === t.key
                ? 'border-primary bg-primary/10 ring-1 ring-primary/30'
                : 'border-border hover:bg-accent/50'
            )}
          >
            {/* Preview swatch */}
            <div className={cn('h-8 w-full rounded-lg border', t.preview)} />
            <div className="flex items-center gap-1.5">
              <t.icon className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-xs font-medium text-foreground">{t.label}</span>
            </div>
            <span className="text-[10px] text-muted-foreground">{t.desc}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
