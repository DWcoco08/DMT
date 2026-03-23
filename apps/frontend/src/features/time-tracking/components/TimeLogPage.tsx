import { useState } from 'react'
import { format, subDays } from 'date-fns'
import { Clock } from 'lucide-react'
import { formatDuration, formatHours } from '@/lib/utils'
import { useFilteredSessions } from '../hooks/useTimeSessions'
import { useProjects } from '@/features/projects/hooks/useProjects'

export function TimeLogPage() {
  const [projectFilter, setProjectFilter] = useState<string>('')
  const [startDate, setStartDate] = useState(format(subDays(new Date(), 30), 'yyyy-MM-dd'))
  const [endDate, setEndDate] = useState(format(new Date(), 'yyyy-MM-dd'))

  const { data: sessions, isLoading } = useFilteredSessions(
    projectFilter || undefined,
    startDate ? new Date(startDate).toISOString() : undefined,
    endDate ? new Date(endDate + 'T23:59:59').toISOString() : undefined,
  )
  const { data: projects } = useProjects()
  const projectMap = new Map(projects?.map((p) => [p.id, p]) ?? [])

  const totalSeconds = sessions?.reduce((sum, s) => sum + s.duration, 0) ?? 0

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Time Log</h1>
          <p className="text-sm text-muted-foreground">Your complete time tracking history</p>
        </div>
        <div className="text-center">
          <p className="text-xl font-bold text-foreground">{formatHours(totalSeconds)}</p>
          <p className="text-[11px] text-muted-foreground">{sessions?.length ?? 0} sessions</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <select
          value={projectFilter}
          onChange={(e) => setProjectFilter(e.target.value)}
          className="rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground"
        >
          <option value="">All projects</option>
          {projects?.map((p) => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>
        <div className="flex items-center gap-2">
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground"
          />
          <span className="text-sm text-muted-foreground">to</span>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground"
          />
        </div>
      </div>

      {/* Sessions table */}
      <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
        {/* Table header */}
        <div className="grid grid-cols-4 gap-4 border-b border-border bg-muted/30 px-4 py-3 text-xs font-medium text-muted-foreground">
          <span>Project</span>
          <span>Start</span>
          <span>End</span>
          <span className="text-right">Duration</span>
        </div>

        {/* Rows */}
        {isLoading ? (
          <div className="p-4 space-y-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-10 animate-pulse rounded-lg bg-muted" />
            ))}
          </div>
        ) : !sessions?.length ? (
          <div className="flex flex-col items-center gap-3 py-16 text-center">
            <Clock className="h-10 w-10 text-muted-foreground/40" />
            <p className="text-sm text-muted-foreground">No sessions found</p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {sessions.map((session) => {
              const project = session.project_id ? projectMap.get(session.project_id) : null
              return (
                <div key={session.id} className="grid grid-cols-4 gap-4 px-4 py-3 text-sm hover:bg-accent/20 transition-colors">
                  <div className="flex items-center gap-2">
                    {project && (
                      <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: project.color }} />
                    )}
                    <span className="truncate text-foreground">{project?.name ?? '—'}</span>
                  </div>
                  <span className="text-muted-foreground">
                    {format(new Date(session.start_time), 'MMM d, HH:mm')}
                  </span>
                  <span className="text-muted-foreground">
                    {session.end_time ? format(new Date(session.end_time), 'HH:mm') : 'Running'}
                  </span>
                  <span className="text-right font-mono text-foreground tabular-nums">
                    {formatDuration(session.duration)}
                  </span>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
