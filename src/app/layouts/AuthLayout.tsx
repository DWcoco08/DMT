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
            <h2 className="text-3xl font-bold leading-tight text-white">
              Build better.<br />Ship faster.<br />Track everything.
            </h2>
            <p className="mt-4 max-w-sm text-[15px] leading-relaxed text-zinc-300">
              The developer productivity tool that helps you understand where your time goes and how to make the most of it.
            </p>
          </div>

          <div className="space-y-3">
            {features.map((f) => (
              <div key={f.text} className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 backdrop-blur-sm">
                  <f.icon className="h-4 w-4 text-white" />
                </div>
                <span className="text-sm text-zinc-200">{f.text}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="relative z-10 text-xs text-zinc-500">
          &copy; 2026 CodeCraft. Built for developers, by developers.
        </p>
      </div>

      {/* Right panel — always white */}
      <div
        className="flex w-full flex-col items-center justify-center bg-white p-6 lg:w-1/2"
        style={{ colorScheme: 'light' }}
      >
        <style>{`
          .auth-form-panel, .auth-form-panel * {
            --color-background: hsl(0 0% 100%);
            --color-foreground: hsl(240 10% 3.9%);
            --color-card: hsl(0 0% 100%);
            --color-card-foreground: hsl(240 10% 3.9%);
            --color-primary: hsl(239 84% 67%);
            --color-primary-foreground: hsl(0 0% 98%);
            --color-muted: hsl(240 4.8% 95.9%);
            --color-muted-foreground: hsl(240 3.8% 46.1%);
            --color-border: hsl(240 5.9% 90%);
            --color-input: hsl(240 5.9% 90%);
            --color-ring: hsl(239 84% 67%);
            --color-destructive: hsl(0 84.2% 60.2%);
            --color-accent: hsl(240 4.8% 95.9%);
            --color-accent-foreground: hsl(240 5.9% 10%);
          }
        `}</style>

        {/* Mobile logo */}
        <div className="mb-8 flex items-center gap-2 lg:hidden">
          <img src="/logo-icon.png" alt="CodeCraft" className="h-9 w-9 object-contain" />
          <span className="text-xl font-bold text-zinc-900">CodeCraft</span>
        </div>

        <div className="auth-form-panel w-full max-w-sm">
          <Outlet />
        </div>
      </div>

      <Toaster />
    </div>
  )
}
