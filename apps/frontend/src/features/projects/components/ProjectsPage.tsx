import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, FolderOpen, Clock, CheckCircle2, ChevronRight, X, Pencil, Trash2 } from 'lucide-react'
import { format } from 'date-fns'
import { Button } from '@/components/ui/button'
import { cn, formatHours } from '@/lib/utils'
import { useProjects, useDeleteProject, useUpdateProject } from '../hooks/useProjects'
import { useTasks } from '@/features/tasks/hooks/useTasks'
import { useSessionsByProject } from '@/features/time-tracking/hooks/useTimeSessions'
import { ProjectForm } from './ProjectForm'
import type { Project } from '@/types/database'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { toast } from 'sonner'

export function ProjectsPage() {
  const { data: projects, isLoading } = useProjects()
  const { data: sessionsByProject } = useSessionsByProject()
  const { data: allTasks } = useTasks()
  const deleteProject = useDeleteProject()
  const updateProject = useUpdateProject()

  const [showForm, setShowForm] = useState(false)
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editName, setEditName] = useState('')

  const durationMap = new Map(sessionsByProject?.map((s) => [s.project_id, s.total_duration]) ?? [])
  const totalHours = Array.from(durationMap.values()).reduce((a, b) => a + b, 0)
  const totalTasks = allTasks?.length ?? 0

  function getProjectTasks(projectId: string) {
    return allTasks?.filter((t) => t.project_id === projectId) ?? []
  }

  async function handleDelete(id: string) {
    try {
      await deleteProject.mutateAsync(id)
      setDeleteConfirmId(null)
      if (selectedProject?.id === id) setSelectedProject(null)
      toast.success('Project deleted')
    } catch {
      toast.error('Failed to delete project')
    }
  }

  return (
    <div className="space-y-6">
      {/* Header + Action */}
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Projects</h1>
          <p className="text-sm text-muted-foreground">Organize your work</p>
        </div>
        <Button size="sm" onClick={() => setShowForm(true)} className="gap-1.5">
          <Plus className="h-3.5 w-3.5" />
          New Project
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-2xl border border-border bg-card p-4 shadow-sm text-center">
          <p className="text-2xl font-bold text-foreground">{projects?.length ?? 0}</p>
          <p className="text-xs text-muted-foreground mt-1">Projects</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-4 shadow-sm text-center">
          <p className="text-2xl font-bold text-foreground">{totalTasks}</p>
          <p className="text-xs text-muted-foreground mt-1">Total Tasks</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-4 shadow-sm text-center">
          <p className="text-2xl font-bold text-foreground">{formatHours(totalHours)}</p>
          <p className="text-xs text-muted-foreground mt-1">Total Hours</p>
        </div>
      </div>

      <div className="flex gap-4">
        {/* Project list */}
        <div className="w-full space-y-2 lg:w-1/2">
          {isLoading ? (
            [1, 2, 3].map((i) => <div key={i} className="h-16 animate-pulse rounded-xl bg-muted" />)
          ) : !projects?.length ? (
            <div className="flex flex-col items-center gap-3 rounded-2xl border border-border bg-card py-16 text-center shadow-sm">
              <FolderOpen className="h-10 w-10 text-muted-foreground/40" />
              <p className="text-sm text-muted-foreground">No projects yet</p>
              <Button size="sm" variant="outline" onClick={() => setShowForm(true)}>Create your first project</Button>
            </div>
          ) : (
            projects.map((project) => {
              const tasks = getProjectTasks(project.id)
              const hours = durationMap.get(project.id) ?? 0
              const completed = tasks.filter((t) => t.completed).length
              const isSelected = selectedProject?.id === project.id
              const isEditingThis = editingId === project.id

              return (
                <motion.div
                  key={project.id}
                  layout
                  className={cn(
                    'group flex w-full items-center gap-4 rounded-xl border p-4 transition-colors',
                    isSelected ? 'border-primary/40 bg-primary/5' : 'border-border bg-card hover:bg-accent/30'
                  )}
                >
                  <div className="h-4 w-4 shrink-0 rounded-full" style={{ backgroundColor: project.color }} />

                  {isEditingThis ? (
                    <div className="flex flex-1 gap-2">
                      <input
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && editName.trim()) {
                            updateProject.mutate({ id: project.id, name: editName.trim() })
                            setEditingId(null)
                          }
                          if (e.key === 'Escape') setEditingId(null)
                        }}
                        autoFocus
                        className="flex-1 bg-transparent text-sm text-foreground outline-none border-b border-primary/50"
                      />
                      <Button size="sm" variant="ghost" onClick={() => setEditingId(null)}>Cancel</Button>
                    </div>
                  ) : (
                    <>
                      <button
                        onClick={() => setSelectedProject(isSelected ? null : project)}
                        className="flex-1 min-w-0 text-left"
                      >
                        <p className="font-medium text-foreground">{project.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {tasks.length} tasks · {completed} done · {formatHours(hours)}
                        </p>
                      </button>

                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          size="icon-xs"
                          variant="ghost"
                          onClick={(e) => { e.stopPropagation(); setEditingId(project.id); setEditName(project.name) }}
                        >
                          <Pencil className="h-3 w-3 text-muted-foreground" />
                        </Button>
                        <Button
                          size="icon-xs"
                          variant="ghost"
                          onClick={(e) => { e.stopPropagation(); setDeleteConfirmId(project.id) }}
                        >
                          <Trash2 className="h-3 w-3 text-muted-foreground" />
                        </Button>
                      </div>

                      <ChevronRight className={cn('h-4 w-4 text-muted-foreground transition-transform shrink-0', isSelected && 'rotate-90')} />
                    </>
                  )}
                </motion.div>
              )
            })
          )}
        </div>

        {/* Project detail */}
        <AnimatePresence>
          {selectedProject && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="hidden w-1/2 rounded-2xl border border-border bg-card p-6 shadow-sm lg:block self-start"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="h-5 w-5 rounded-full" style={{ backgroundColor: selectedProject.color }} />
                  <h2 className="text-lg font-semibold text-foreground">{selectedProject.name}</h2>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="ghost" className="text-destructive" onClick={() => setDeleteConfirmId(selectedProject.id)}>
                    Delete
                  </Button>
                  <Button size="icon-xs" variant="ghost" onClick={() => setSelectedProject(null)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 mb-6">
                <div className="rounded-lg bg-muted/50 p-3 text-center">
                  <p className="text-lg font-bold text-foreground">{getProjectTasks(selectedProject.id).length}</p>
                  <p className="text-[11px] text-muted-foreground">Tasks</p>
                </div>
                <div className="rounded-lg bg-muted/50 p-3 text-center">
                  <p className="text-lg font-bold text-green-500">{getProjectTasks(selectedProject.id).filter((t) => t.completed).length}</p>
                  <p className="text-[11px] text-muted-foreground">Done</p>
                </div>
                <div className="rounded-lg bg-muted/50 p-3 text-center">
                  <p className="text-lg font-bold text-foreground">{formatHours(durationMap.get(selectedProject.id) ?? 0)}</p>
                  <p className="text-[11px] text-muted-foreground">Hours</p>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-foreground mb-2">Recent Tasks</h3>
                {getProjectTasks(selectedProject.id).length === 0 ? (
                  <p className="text-sm text-muted-foreground py-4 text-center">No tasks</p>
                ) : (
                  <div className="space-y-1.5 max-h-60 overflow-y-auto">
                    {getProjectTasks(selectedProject.id).slice(0, 10).map((task) => (
                      <div key={task.id} className="flex items-center gap-2 rounded-lg p-2 text-sm">
                        {task.completed ? (
                          <CheckCircle2 className="h-3.5 w-3.5 text-green-500 shrink-0" />
                        ) : (
                          <Clock className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                        )}
                        <span className={cn('flex-1 truncate', task.completed && 'text-muted-foreground line-through')}>
                          {task.title}
                        </span>
                        <span className="text-[10px] text-muted-foreground">{format(new Date(task.created_at), 'MMM d')}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <ProjectForm open={showForm} onClose={() => setShowForm(false)} />

      <Dialog open={!!deleteConfirmId} onOpenChange={() => setDeleteConfirmId(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Delete Project?</DialogTitle></DialogHeader>
          <p className="text-sm text-muted-foreground">Tasks and sessions will be unlinked.</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteConfirmId(null)}>Cancel</Button>
            <Button variant="destructive" onClick={() => deleteConfirmId && handleDelete(deleteConfirmId)}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
