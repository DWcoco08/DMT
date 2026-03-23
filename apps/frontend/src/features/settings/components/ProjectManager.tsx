import { useState } from 'react'
import { Pencil, Trash2, Plus } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { useProjects, useUpdateProject, useDeleteProject } from '@/features/projects/hooks/useProjects'
import { ProjectForm } from '@/features/projects/components/ProjectForm'

export function ProjectManager() {
  const { data: projects, isLoading } = useProjects()
  const updateProject = useUpdateProject()
  const deleteProject = useDeleteProject()

  const [showCreate, setShowCreate] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editName, setEditName] = useState('')
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null)

  function startEdit(id: string, name: string) {
    setEditingId(id)
    setEditName(name)
  }

  async function saveEdit() {
    if (!editingId || !editName.trim()) return
    try {
      await updateProject.mutateAsync({ id: editingId, name: editName.trim() })
      setEditingId(null)
      toast.success('Project updated')
    } catch {
      toast.error('Failed to update project')
    }
  }

  async function handleDelete(id: string) {
    try {
      await deleteProject.mutateAsync(id)
      setDeleteConfirmId(null)
      toast.success('Project deleted')
    } catch {
      toast.error('Failed to delete project')
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-2">
        {[1, 2].map((i) => (
          <div key={i} className="h-12 animate-pulse rounded-lg bg-muted" />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {projects?.length ?? 0} project{(projects?.length ?? 0) !== 1 ? 's' : ''}
        </p>
        <Button size="sm" onClick={() => setShowCreate(true)} className="gap-1">
          <Plus className="h-3 w-3" />
          New Project
        </Button>
      </div>

      <div className="space-y-2">
        {projects?.map((project) => (
          <div
            key={project.id}
            className="flex items-center gap-3 rounded-lg border border-border p-3"
          >
            <div
              className="h-3 w-3 shrink-0 rounded-full"
              style={{ backgroundColor: project.color }}
            />

            {editingId === project.id ? (
              <div className="flex flex-1 gap-2">
                <Input
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && saveEdit()}
                  className="h-8 flex-1"
                  autoFocus
                />
                <Button size="sm" onClick={saveEdit}>Save</Button>
                <Button size="sm" variant="ghost" onClick={() => setEditingId(null)}>
                  Cancel
                </Button>
              </div>
            ) : (
              <>
                <span className="flex-1 text-sm font-medium text-foreground">
                  {project.name}
                </span>
                <Button
                  size="icon-xs"
                  variant="ghost"
                  onClick={() => startEdit(project.id, project.name)}
                >
                  <Pencil className="h-3 w-3" />
                </Button>
                <Button
                  size="icon-xs"
                  variant="ghost"
                  onClick={() => setDeleteConfirmId(project.id)}
                >
                  <Trash2 className="h-3 w-3 text-destructive" />
                </Button>
              </>
            )}
          </div>
        ))}
      </div>

      <ProjectForm open={showCreate} onClose={() => setShowCreate(false)} />

      {/* Delete confirmation */}
      <Dialog open={!!deleteConfirmId} onOpenChange={() => setDeleteConfirmId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Project?</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            This will remove the project. Tasks and time sessions associated with this project will be unlinked.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteConfirmId(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => deleteConfirmId && handleDelete(deleteConfirmId)}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
