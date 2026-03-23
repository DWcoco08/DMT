import { formatDistanceToNow } from 'date-fns'
import { GitCommitHorizontal, Github } from 'lucide-react'
import { useGitHubStore, useGitHubCommits } from '../hooks/useGitHub'

export function GitHubRecentCommits() {
  const { token, username } = useGitHubStore()
  const { data: commits, isLoading } = useGitHubCommits()

  if (!token || !username) return null

  if (isLoading) {
    return (
      <div className="space-y-2">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-10 animate-pulse rounded-lg bg-muted" />
        ))}
      </div>
    )
  }

  const recent = commits?.slice(0, 8) ?? []

  if (!recent.length) {
    return (
      <div className="flex flex-col items-center gap-2 py-6 text-center">
        <Github className="h-6 w-6 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">No recent commits</p>
      </div>
    )
  }

  return (
    <div className="space-y-1">
      {recent.map((commit) => (
        <div
          key={commit.sha}
          className="flex items-start gap-3 rounded-lg p-2 text-sm"
        >
          <GitCommitHorizontal className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-foreground">{commit.message}</p>
            <p className="text-xs text-muted-foreground">
              <span className="font-mono">{commit.sha}</span>
              {' · '}
              {commit.repo.split('/')[1]}
              {' · '}
              {formatDistanceToNow(new Date(commit.date), { addSuffix: true })}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}
