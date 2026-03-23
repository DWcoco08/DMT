import { format } from 'date-fns'
import { Clock } from 'lucide-react'
import { formatDuration } from '@/lib/utils'
import { useRecentSessions } from '../hooks/useTimeSessions'
import { useProjects } from '@/features/projects/hooks/useProjects'

export function SessionHistory() {
  const { data: sessions, isLoading } = useRecentSessions(5)
  const { data: projects } = useProjects()

  const projectMap = new Map(projects?.map((p) => [p.id, p]) ?? [])

  if (isLoading) {
    return (
      <div className="space-y-2">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-10 animate-pulse rounded-lg bg-muted" />
        ))}
      </div>
    )
  }

  if (!sessions?.length) {
    return (
      <div className="flex flex-col items-center gap-2 py-6 text-center">
        <Clock className="h-6 w-6 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">No sessions yet</p>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {sessions.map((session) => {
        const project = session.project_id ? projectMap.get(session.project_id) : null
        return (
          <div
            key={session.id}
            className="flex items-center gap-3 rounded-lg border border-border p-3 text-sm"
          >
            {project && (
              <div
                className="h-2.5 w-2.5 shrink-0 rounded-full"
                style={{ backgroundColor: project.color }}
              />
            )}
            <span className="flex-1 truncate text-foreground">
              {project?.name ?? 'Unknown project'}
            </span>
            <span className="font-mono text-xs text-muted-foreground tabular-nums">
              {formatDuration(session.duration)}
            </span>
            <span className="text-xs text-muted-foreground">
              {format(new Date(session.start_time), 'MMM d')}
            </span>
          </div>
        )
      })}
    </div>
  )
}
