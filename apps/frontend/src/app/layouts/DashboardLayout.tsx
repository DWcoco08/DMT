import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { LayoutDashboard, Settings, LogOut, Menu, X, CheckSquare, FolderOpen } from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import { authService } from '@/features/auth/services/authService'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { Button } from '@/components/ui/button'
import { Toaster } from '@/components/ui/sonner'
import { CommandPalette } from '@/components/shared/CommandPalette'
import { useRealtimeSync } from '@/hooks/useRealtimeSync'

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/tasks', label: 'Tasks', icon: CheckSquare },
  { to: '/projects', label: 'Projects', icon: FolderOpen },
  { to: '/settings', label: 'Settings', icon: Settings },
]

// Sidebar: darker, more muted red-black (like the arcade shadows)
const sidebarClasses = 'bg-gradient-to-b from-[#0c0507] via-[#110a0c] to-[#0a0608]'

export function DashboardLayout() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  useRealtimeSync()

  async function handleSignOut() {
    await authService.signOut()
    navigate('/login')
  }

  const sidebarContent = (
    <div className="flex h-full flex-col">
      {/* Logo */}
      <div className="flex h-14 items-center gap-2.5 border-b border-red-900/20 px-5">
        <img src="/logo-icon.png" alt="CodeCraft" className="h-8 w-8 object-contain" />
        <span className="text-xl font-semibold text-white">CodeCraft</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-0.5 p-3">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={() => setMobileMenuOpen(false)}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-[15px] font-medium transition-colors',
                isActive
                  ? 'bg-red-950/40 text-red-100'
                  : 'text-zinc-400 hover:bg-red-950/20 hover:text-zinc-200'
              )
            }
          >
            <item.icon className="h-5 w-5" />
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* Command palette hint */}
      <div className="px-3 pb-2">
        <p className="text-[11px] text-zinc-600 text-center">
          <kbd className="rounded border border-red-900/20 bg-red-950/20 px-1 py-0.5 text-[11px] font-mono text-zinc-500">Ctrl+K</kbd> commands
        </p>
      </div>

      {/* User info + Sign out */}
      <div className="border-t border-red-900/20 p-3 space-y-1.5">
        {user && (
          <p className="truncate px-3 text-xs text-zinc-500">{user.email}</p>
        )}
        <button
          onClick={handleSignOut}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-[15px] font-medium text-zinc-400 transition-colors hover:bg-red-950/20 hover:text-zinc-200"
        >
          <LogOut className="h-5 w-5" />
          Sign Out
        </button>
      </div>
    </div>
  )

  return (
    <div className="flex min-h-screen">
      {/* Desktop Sidebar */}
      <aside className={cn('hidden w-52 shrink-0 border-r border-red-900/20 md:block sticky top-0 h-screen overflow-y-auto', sidebarClasses)}>
        {sidebarContent}
      </aside>

      {/* Mobile menu overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-52 border-r border-red-900/20 transition-transform md:hidden',
          sidebarClasses,
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {sidebarContent}
      </aside>

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-auto bg-gradient-to-br from-background via-background to-red-950/[0.03] dark:to-red-950/10">
        {/* Mobile header */}
        <header className="flex h-14 items-center gap-4 border-b border-border px-4 md:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
          <span className="text-lg font-semibold">CodeCraft</span>
        </header>

        <main className="flex-1">
          <div className="p-4 lg:p-5">
            <Outlet />
          </div>
        </main>
      </div>

      <Toaster />
      <CommandPalette />
    </div>
  )
}
