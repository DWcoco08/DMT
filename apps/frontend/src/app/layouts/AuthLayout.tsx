import { Outlet } from 'react-router-dom'
import { Toaster } from '@/components/ui/sonner'
import { Timer, BarChart3, CheckCircle2, Zap } from 'lucide-react'

const features = [
  { icon: Timer, text: 'Track time across projects' },
  { icon: BarChart3, text: 'Visualize your productivity' },
  { icon: CheckCircle2, text: 'Manage tasks effortlessly' },
  { icon: Zap, text: 'GitHub integration built-in' },
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
              Build better.<br />Ship faster.<br />Track everything.
            </h2>
            <p className="mt-6 max-w-md text-lg leading-relaxed text-zinc-300">
              The all-in-one developer productivity platform. Track your time, manage tasks, visualize your coding habits, and ship projects faster than ever before.
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

      {/* Right panel — dark gradient consistent with left */}
      <div className="relative flex w-full flex-col items-center justify-center overflow-hidden p-6 lg:w-1/2">
        {/* Gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a0a] via-[#1a0a0a] to-[#0d0508]" />

        {/* Subtle red glow accents */}
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-red-900/20 blur-[120px]" />
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-red-800/15 blur-[120px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-96 w-96 rounded-full bg-red-950/10 blur-[100px]" />

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
