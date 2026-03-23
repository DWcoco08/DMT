import { useProjects } from '@/features/projects/hooks/useProjects'
import { useSessionsByProject } from '@/features/time-tracking/hooks/useTimeSessions'
import { formatHours } from '@/lib/utils'
import { Folder } from 'lucide-react'

export function ProjectsOverview() {
  const { data: projects, isLoading: projectsLoading } = useProjects()
  const { data: sessionsByProject, isLoading: sessionsLoading } = useSessionsByProject()

  const isLoading = projectsLoading || sessionsLoading

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-10 animate-pulse rounded-lg bg-muted" />
        ))}
      </div>
    )
  }

  if (!projects?.length) {
    return (
      <div className="flex flex-col items-center gap-2 py-6 text-center">
        <Folder className="h-6 w-6 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">No projects yet</p>
      </div>
    )
  }

  const durationMap = new Map(
    sessionsByProject?.map((s) => [s.project_id, s.total_duration]) ?? []
  )

  const maxDuration = Math.max(
    ...Array.from(durationMap.values()),
    1 // avoid division by zero
  )

  return (
    <div className="space-y-3">
      {projects.map((project) => {
        const duration = durationMap.get(project.id) ?? 0
        const percentage = (duration / maxDuration) * 100

        return (
          <div key={project.id} className="space-y-1.5">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <div
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: project.color }}
                />
                <span className="font-medium text-foreground">{project.name}</span>
              </div>
              <span className="text-xs text-muted-foreground tabular-nums">
                {formatHours(duration)}
              </span>
            </div>
            <div className="h-1.5 rounded-full bg-muted">
              <div
                className="h-full rounded-full transition-all"
                style={{
                  width: `${percentage}%`,
                  backgroundColor: project.color,
                }}
              />
            </div>
          </div>
        )
      })}
    </div>
  )
}
