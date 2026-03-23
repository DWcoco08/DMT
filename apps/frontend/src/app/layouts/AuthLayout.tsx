import { Outlet } from 'react-router-dom'
import { Toaster } from '@/components/ui/sonner'
import { Timer, BarChart3, CheckSquare, FolderOpen, Cpu, StickyNote, Github, Sparkles } from 'lucide-react'

const features = [
  { icon: CheckSquare, text: 'Task management with search, filters & sorting' },
  { icon: Timer, text: 'Time tracking with session history & analytics' },
  { icon: FolderOpen, text: 'Organize work into color-coded projects' },
  { icon: Cpu, text: 'Cyberpunk Pomodoro timer for deep focus' },
  { icon: BarChart3, text: 'Productivity reports & daily/weekly charts' },
  { icon: StickyNote, text: 'Dev journal with auto-save notes' },
  { icon: Github, text: 'GitHub commits integration' },
  { icon: Sparkles, text: 'Drag-and-drop customizable dashboard' },
]

export function AuthLayout() {
  return (
    <div className="flex min-h-screen">
      {/* Left panel — background image */}
      <div
        className="hidden w-1/2 flex-col justify-between p-12 lg:flex relative"
        style={{
          backgroundImage: 'url(/Arcade_decay_red.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/60" />

        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <img src="/logo-icon.png" alt="CodeCraft" className="h-10 w-10 object-contain" />
            <span className="text-2xl font-bold text-white">CodeCraft</span>
          </div>
        </div>

        <div className="relative z-10 space-y-8">
          <div>
            <h2 className="text-5xl font-bold leading-[1.15] tracking-tight text-white">
              Your dev workflow.<br />One platform.<br />Zero friction.
            </h2>
            <p className="mt-6 max-w-md text-lg leading-relaxed text-zinc-300">
              CodeCraft brings together time tracking, task management, focus timers, analytics, and notes — everything a developer needs to stay productive and ship faster.
            </p>
          </div>

          <div className="space-y-3">
            {features.map((f) => (
              <div key={f.text} className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 backdrop-blur-sm">
                  <f.icon className="h-4 w-4 text-white" />
                </div>
                <span className="text-[15px] text-zinc-200">{f.text}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="relative z-10 text-xs text-zinc-500">
          &copy; 2026 CodeCraft. Built for developers, by developers.
        </p>
      </div>

      {/* Right panel — warmer red-black, distinct from sidebar */}
      <div className="relative flex w-full flex-col items-center justify-center overflow-hidden p-6 lg:w-1/2">
        {/* Gradient background — brighter red undertone than sidebar */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0f0608] via-[#1c0c0e] to-[#120509]" />

        {/* Red glow accents — more vivid */}
        <div className="absolute -top-32 -right-32 h-72 w-72 rounded-full bg-red-800/25 blur-[100px]" />
        <div className="absolute -bottom-32 -left-32 h-72 w-72 rounded-full bg-red-700/20 blur-[100px]" />
        <div className="absolute top-1/3 right-1/4 h-60 w-60 rounded-full bg-red-900/15 blur-[80px]" />

        {/* Mobile logo */}
        <div className="relative z-10 mb-8 flex items-center gap-2 lg:hidden">
          <img src="/logo-icon.png" alt="CodeCraft" className="h-9 w-9 object-contain" />
          <span className="text-xl font-bold text-white">CodeCraft</span>
        </div>

        {/* Glassmorphism form card */}
        <div className="auth-form-panel relative z-10 w-full max-w-sm rounded-2xl border border-white/10 bg-white/[0.05] p-8 shadow-2xl backdrop-blur-xl">
          <Outlet />
        </div>

        {/* CSS variable overrides for dark form */}
        <style>{`
          .auth-form-panel, .auth-form-panel * {
            --color-background: transparent;
            --color-foreground: hsl(0 0% 95%);
            --color-card: transparent;
            --color-card-foreground: hsl(0 0% 95%);
            --color-primary: hsl(0 72% 51%);
            --color-primary-foreground: hsl(0 0% 100%);
            --color-muted: hsl(0 0% 15%);
            --color-muted-foreground: hsl(0 0% 60%);
            --color-border: hsl(0 0% 20%);
            --color-input: hsl(0 0% 15%);
            --color-ring: hsl(0 72% 51%);
            --color-destructive: hsl(0 84% 60%);
            --color-accent: hsl(0 0% 15%);
            --color-accent-foreground: hsl(0 0% 90%);
          }
        `}</style>
      </div>

      <Toaster />
    </div>
  )
}
