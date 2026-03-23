import { User, Palette, Github } from 'lucide-react'
import { ProfileForm } from './ProfileForm'
import { ThemeToggle } from './ThemeToggle'
import { GitHubConnect } from '@/features/github/components/GitHubConnect'

export function SettingsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Settings</h1>
        <p className="text-sm text-muted-foreground">Manage your account and preferences</p>
      </div>

      {/* Sections stacked */}
      <div className="space-y-5 max-w-2xl">
        {/* Profile */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
              <User className="h-4 w-4 text-primary" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-foreground">Profile</h2>
              <p className="text-xs text-muted-foreground">Your account information</p>
            </div>
          </div>
          <ProfileForm />
        </div>

        {/* Appearance */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-purple-500/10">
              <Palette className="h-4 w-4 text-purple-500" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-foreground">Appearance</h2>
              <p className="text-xs text-muted-foreground">Choose your preferred theme</p>
            </div>
          </div>
          <ThemeToggle />
        </div>

        {/* GitHub */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-zinc-500/10">
              <Github className="h-4 w-4 text-zinc-500" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-foreground">GitHub Integration</h2>
              <p className="text-xs text-muted-foreground">Connect your GitHub account to track commits</p>
            </div>
          </div>
          <GitHubConnect />
        </div>
      </div>
    </div>
  )
}
