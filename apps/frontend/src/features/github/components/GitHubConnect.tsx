import { useState } from 'react'
import { Github, Unlink, CheckCircle2 } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useGitHubStore, useConnectGitHub, useDisconnectGitHub } from '../hooks/useGitHub'

export function GitHubConnect() {
  const { token, username } = useGitHubStore()
  const connect = useConnectGitHub()
  const disconnect = useDisconnectGitHub()
  const [inputToken, setInputToken] = useState('')

  const isConnected = !!token && !!username

  async function handleConnect(e: React.FormEvent) {
    e.preventDefault()
    if (!inputToken.trim()) return

    try {
      await connect.mutateAsync(inputToken.trim())
      setInputToken('')
      toast.success('GitHub connected')
    } catch {
      toast.error('Invalid GitHub token')
    }
  }

  function handleDisconnect() {
    disconnect()
    toast.success('GitHub disconnected')
  }

  if (isConnected) {
    return (
      <div className="space-y-3">
        <div className="flex items-center gap-3 rounded-lg border border-border bg-green-500/5 p-4">
          <CheckCircle2 className="h-5 w-5 text-green-500" />
          <div className="flex-1">
            <p className="text-sm font-medium text-foreground">Connected as @{username}</p>
            <p className="text-xs text-muted-foreground">Commits are synced</p>
          </div>
          <Button size="sm" variant="ghost" onClick={handleDisconnect}>
            <Unlink className="mr-1 h-3 w-3" />
            Disconnect
          </Button>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleConnect} className="space-y-3">
      <div className="space-y-2">
        <Label htmlFor="gh-token">Personal Access Token</Label>
        <Input
          id="gh-token"
          type="password"
          value={inputToken}
          onChange={(e) => setInputToken(e.target.value)}
          placeholder="ghp_xxxxxxxxxxxx"
        />
        <p className="text-xs text-muted-foreground">
          Create a token at GitHub → Settings → Developer settings → Personal access tokens.
          No scopes needed for public repos.
        </p>
      </div>
      <Button type="submit" disabled={!inputToken.trim() || connect.isPending} className="gap-2">
        <Github className="h-4 w-4" />
        {connect.isPending ? 'Connecting...' : 'Connect GitHub'}
      </Button>
    </form>
  )
}
