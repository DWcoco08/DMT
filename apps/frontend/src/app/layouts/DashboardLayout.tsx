import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { LayoutDashboard, Settings, LogOut, Menu, X, Briefcase, Database, BarChart3, StickyNote, Timer } from 'lucide-react'
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
  { to: '/workspace', label: 'Workspace', icon: Briefcase },
  { to: '/pomodoro', label: 'Pomodoro', icon: Timer },
  { to: '/reports', label: 'Reports', icon: BarChart3 },
  { to: '/notes', label: 'Notes', icon: StickyNote },
  { to: '/data', label: 'Data', icon: Database },
  { to: '/settings', label: 'Settings', icon: Settings },
]

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
      <div className="flex h-16 items-center gap-3 border-b border-sidebar-border px-5">
        <img src="/logo-icon.png" alt="DevPulse" className="h-10 w-10 object-contain" />
        <span className="text-xl font-bold text-sidebar-foreground">DevPulse</span>
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
                  ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                  : 'text-sidebar-foreground/60 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground'
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
        <p className="text-[11px] text-sidebar-foreground/40 text-center">
          <kbd className="rounded border border-sidebar-border bg-sidebar-accent/50 px-1 py-0.5 text-[11px] font-mono text-sidebar-foreground/50">Ctrl+K</kbd> commands
        </p>
      </div>

      {/* User info + Sign out */}
      <div className="border-t border-sidebar-border p-3 space-y-1.5">
        {user && (
          <p className="truncate px-3 text-xs text-sidebar-foreground/50">{user.email}</p>
        )}
        <button
          onClick={handleSignOut}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-[15px] font-medium text-sidebar-foreground/60 transition-colors hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
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
      <aside className="hidden w-52 shrink-0 border-r border-sidebar-border bg-sidebar-background md:block sticky top-0 h-screen overflow-y-auto">
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
          'fixed inset-y-0 left-0 z-50 w-52 border-r border-sidebar-border bg-sidebar-background transition-transform md:hidden',
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {sidebarContent}
      </aside>

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-auto bg-background">
        {/* Mobile header */}
        <header className="flex h-14 items-center gap-4 border-b border-border px-4 md:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
          <span className="text-lg font-semibold">DevPulse</span>
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
