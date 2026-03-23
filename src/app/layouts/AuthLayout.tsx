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
    <div className="flex min-h-screen bg-[#09090b]">
      {/* Left panel — branding */}
      <div className="hidden w-1/2 flex-col justify-between border-r border-zinc-800 bg-[#050505] p-12 lg:flex">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-black text-sm font-bold">
              D
            </div>
            <span className="text-2xl font-bold text-white">DMT</span>
          </div>
        </div>

        <div className="space-y-8">
          <div>
            <h2 className="text-3xl font-bold leading-tight text-white">
              Build better.<br />Ship faster.<br />Track everything.
            </h2>
            <p className="mt-4 max-w-sm text-[15px] leading-relaxed text-zinc-400">
              The developer productivity tool that helps you understand where your time goes and how to make the most of it.
            </p>
          </div>

          <div className="space-y-3">
            {features.map((f) => (
              <div key={f.text} className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10">
                  <f.icon className="h-4 w-4 text-white" />
                </div>
                <span className="text-sm text-zinc-300">{f.text}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="text-xs text-zinc-600">
          &copy; 2026 DMT. Built for developers, by developers.
        </p>
      </div>

      {/* Right panel — form (always dark) */}
      <div className="dark flex w-full flex-col items-center justify-center bg-[#09090b] p-6 lg:w-1/2">
        {/* Mobile logo */}
        <div className="mb-8 flex items-center gap-2 lg:hidden">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-black text-sm font-bold">
            D
          </div>
          <span className="text-xl font-bold text-white">DMT</span>
        </div>

        <div className="w-full max-w-sm">
          <Outlet />
        </div>
      </div>

      <Toaster />
    </div>
  )
}
