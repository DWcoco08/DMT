import { Outlet } from 'react-router-dom'
import { Toaster } from '@/components/ui/sonner'

export function AuthLayout() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">DMT</h1>
          <p className="mt-2 text-muted-foreground">Developer Productivity Tool</p>
        </div>
        <Outlet />
      </div>
      <Toaster />
    </div>
  )
}
