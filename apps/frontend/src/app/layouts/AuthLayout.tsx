import { Outlet } from 'react-router-dom'
import { Toaster } from '@/components/ui/sonner'
import { Timer, BarChart3, CheckSquare, FolderOpen, Cpu, StickyNote, Github, Sparkles } from 'lucide-react'

const features = [
  { icon: CheckSquare, text: 'Tasks & Filters' },
  { icon: Timer, text: 'Time Tracking' },
  { icon: FolderOpen, text: 'Projects' },
  { icon: Cpu, text: 'Pomodoro Timer' },
  { icon: BarChart3, text: 'Reports' },
  { icon: StickyNote, text: 'Dev Notes' },
  { icon: Github, text: 'GitHub Sync' },
  { icon: Sparkles, text: 'Custom Dashboard' },
]

export function AuthLayout() {
  return (
    <div
      className="relative flex min-h-screen"
      style={{
        backgroundImage: 'url(/Arcade_decay_red.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}
    >
      {/* Left panel */}
      <div className="hidden w-1/2 flex-col justify-center items-center p-12 lg:flex relative">
        <div className="absolute inset-0 bg-black/50" />

        <div className="relative z-10 space-y-8 max-w-lg">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <img src="/logo-icon.png" alt="DevPulse" className="h-12 w-12 object-contain" />
            <span className="text-3xl font-extrabold text-white tracking-tight drop-shadow-lg">DevPulse</span>
          </div>

          {/* Tagline */}
          <div>
            <h2 className="text-4xl font-bold leading-[1.2] tracking-tight text-white drop-shadow-lg">
              Your dev workflow.<br />One platform.<br />Zero friction.
            </h2>
            <p className="mt-4 text-base leading-relaxed text-zinc-300 drop-shadow-sm">
              Time tracking, task management, focus timers, analytics, and notes — everything to stay productive.
            </p>
          </div>

          {/* Features grid — 2 columns */}
          <div className="grid grid-cols-2 gap-3">
            {features.map((f) => (
              <div key={f.text} className="flex items-center gap-2.5">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-white/10 backdrop-blur-sm">
                  <f.icon className="h-3.5 w-3.5 text-white" />
                </div>
                <span className="text-sm text-zinc-100 drop-shadow-sm">{f.text}</span>
              </div>
            ))}
          </div>

          {/* Footer */}
          <p className="text-xs text-zinc-500">
            &copy; 2026 DevPulse. Built for developers, by developers.
          </p>
        </div>
      </div>

      {/* Right panel */}
      <div className="relative flex w-full flex-col items-center justify-center p-6 lg:w-1/2">
        <div className="absolute inset-0 bg-black/70" />

        {/* Mobile logo */}
        <div className="relative z-10 mb-8 flex items-center gap-2 lg:hidden">
          <img src="/logo-icon.png" alt="DevPulse" className="h-11 w-11 object-contain" />
          <span className="text-2xl font-bold text-white">DevPulse</span>
        </div>

        {/* Form card */}
        <div className="auth-form-panel relative z-10 w-full max-w-sm rounded-2xl border border-white/10 bg-white/[0.05] p-8 shadow-2xl backdrop-blur-md">
          <Outlet />
        </div>

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
