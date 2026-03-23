import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ProfileForm } from './ProfileForm'
import { ThemeToggle } from './ThemeToggle'
import { GitHubConnect } from '@/features/github/components/GitHubConnect'

export function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Settings</h1>
        <p className="text-sm text-muted-foreground">Manage your account and preferences</p>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="github">GitHub</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="mt-6">
          <div className="max-w-md rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-foreground">Profile</h2>
            <ProfileForm />
          </div>
        </TabsContent>

        <TabsContent value="appearance" className="mt-6">
          <div className="max-w-md rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-foreground">Appearance</h2>
            <ThemeToggle />
          </div>
        </TabsContent>

        <TabsContent value="github" className="mt-6">
          <div className="max-w-md rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-foreground">GitHub Integration</h2>
            <GitHubConnect />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
