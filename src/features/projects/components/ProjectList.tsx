import { useState } from 'react'
import { Plus, Folder } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useProjects } from '../hooks/useProjects'
import { ProjectForm } from './ProjectForm'

export function ProjectList() {
  const { data: projects, isLoading } = useProjects()
  const [showForm, setShowForm] = useState(false)

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-12 animate-pulse rounded-lg bg-muted" />
        ))}
      </div>
    )
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-foreground">Projects</h3>
        <Button size="sm" variant="ghost" onClick={() => setShowForm(true)}>
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      {!projects?.length ? (
        <div className="flex flex-col items-center gap-2 py-8 text-center">
          <Folder className="h-8 w-8 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">No projects yet</p>
          <Button size="sm" variant="outline" onClick={() => setShowForm(true)}>
            Create your first project
          </Button>
        </div>
      ) : (
        <div className="space-y-2">
          {projects.map((project) => (
            <div
              key={project.id}
              className="flex items-center gap-3 rounded-lg border border-border p-3 transition-colors hover:bg-accent/50"
            >
              <div
                className="h-3 w-3 shrink-0 rounded-full"
                style={{ backgroundColor: project.color }}
              />
              <span className="text-sm font-medium text-foreground">{project.name}</span>
            </div>
          ))}
        </div>
      )}

      <ProjectForm open={showForm} onClose={() => setShowForm(false)} />
    </div>
  )
}
