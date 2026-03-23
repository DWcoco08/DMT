import { useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { Search, CheckCircle2, Circle, ListTodo, ClipboardList, Loader, Plus, FolderOpen, Pencil, Trash2 } from 'lucide-react'
import { motion } from 'framer-motion'
import { cn, formatHours } from '@/lib/utils'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { useTasks } from '../hooks/useTasks'
import { useProjects, useDeleteProject, useUpdateProject } from '@/features/projects/hooks/useProjects'
import { useSessionsByProject } from '@/features/time-tracking/hooks/useTimeSessions'
import { ProjectForm } from '@/features/projects/components/ProjectForm'
import { TaskForm } from './TaskForm'
import { TaskItem } from './TaskItem'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { toast } from 'sonner'

type Tab = 'tasks' | 'projects'
type Filter = 'all' | 'pending' | 'in_progress' | 'completed'
type Sort = 'newest' | 'oldest' | 'name'

const filterOptions: { key: Filter; label: string; icon: React.ReactNode }[] = [
  { key: 'all', label: 'All', icon: <ListTodo className="h-3.5 w-3.5" /> },
  { key: 'pending', label: 'Pending', icon: <Circle className="h-3.5 w-3.5" /> },
  { key: 'in_progress', label: 'Active', icon: <Loader className="h-3.5 w-3.5" /> },
  { key: 'completed', label: 'Done', icon: <CheckCircle2 className="h-3.5 w-3.5" /> },
]

export function TasksPage() {
  const [tab, setTab] = useState<Tab>('tasks')

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Workspace</h1>
        <p className="text-sm text-muted-foreground">Manage tasks and projects</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 rounded-lg bg-muted p-1 w-fit">
        {([
          { key: 'tasks' as Tab, label: 'Tasks' },
          { key: 'projects' as Tab, label: 'Projects' },
        ]).map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={cn(
              'rounded-md px-5 py-2 text-sm font-medium transition-colors',
              tab === t.key
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'tasks' ? <TasksTab /> : <ProjectsTab />}
    </div>
  )
}

function TasksTab() {
  const [filter, setFilter] = useState<Filter>('all')
  const [search, setSearch] = useState('')
  const [projectFilter, setProjectFilter] = useState<string>('')
  const [sort, setSort] = useState<Sort>('newest')

  const taskFilters = {
    ...(filter !== 'all' ? { status: filter as 'pending' | 'in_progress' | 'completed' } : {}),
    ...(projectFilter ? { project_id: projectFilter } : {}),
  }

  const { data: tasks, isLoading } = useTasks(Object.keys(taskFilters).length ? taskFilters : undefined)
  const { data: projects } = useProjects()

  const filtered = tasks?.filter((t) =>
    search ? t.title.toLowerCase().includes(search.toLowerCase()) : true
  )

  const sorted = filtered?.slice().sort((a, b) => {
    if (sort === 'name') return a.title.localeCompare(b.title)
    if (sort === 'oldest') return new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  })

  const total = tasks?.length ?? 0
  const pending = tasks?.filter((t) => (t.status || 'pending') === 'pending').length ?? 0
  const inProgress = tasks?.filter((t) => t.status === 'in_progress').length ?? 0
  const completed = tasks?.filter((t) => t.status === 'completed' || t.completed).length ?? 0

  return (
    <div className="space-y-5">
      {/* Stats */}
      <div className="grid grid-cols-4 gap-3">
        <div className="rounded-2xl border border-border bg-card p-4 shadow-sm text-center">
          <p className="text-2xl font-bold text-foreground">{total}</p>
          <p className="text-xs text-muted-foreground mt-1">Total</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-4 shadow-sm text-center">
          <p className="text-2xl font-bold text-yellow-500">{pending}</p>
          <p className="text-xs text-muted-foreground mt-1">Pending</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-4 shadow-sm text-center">
          <p className="text-2xl font-bold text-blue-500">{inProgress}</p>
          <p className="text-xs text-muted-foreground mt-1">In Progress</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-4 shadow-sm text-center">
          <p className="text-2xl font-bold text-green-500">{completed}</p>
          <p className="text-xs text-muted-foreground mt-1">Completed</p>
        </div>
      </div>

      {/* Search */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search tasks..." className="pl-10" />
        </div>
        <select value={projectFilter} onChange={(e) => setProjectFilter(e.target.value)} className="rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground">
          <option value="">All projects</option>
          {projects?.map((p) => (<option key={p.id} value={p.id}>{p.name}</option>))}
        </select>
        <select value={sort} onChange={(e) => setSort(e.target.value as Sort)} className="rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground">
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
          <option value="name">Name</option>
        </select>
      </div>

      <Separator />

      {/* Add task */}
      <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
        <TaskForm />
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1 rounded-lg bg-muted p-1 w-fit">
        {filterOptions.map((f) => (
          <button key={f.key} onClick={() => setFilter(f.key)} className={cn('flex items-center gap-1.5 rounded-md px-4 py-2 text-sm font-medium transition-colors', filter === f.key ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground')}>
            {f.icon}{f.label}
          </button>
        ))}
      </div>

      {/* Task list */}
      <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
        {isLoading ? (
          <div className="space-y-2">{[1,2,3,4,5].map((i) => (<div key={i} className="h-12 animate-pulse rounded-lg bg-muted" />))}</div>
        ) : !sorted?.length ? (
          <div className="flex flex-col items-center gap-3 py-12 text-center">
            <ClipboardList className="h-10 w-10 text-muted-foreground/40" />
            <p className="text-sm text-muted-foreground">{search ? 'No tasks match your search' : filter === 'all' ? 'No tasks yet' : `No ${filter.replace('_', ' ')} tasks`}</p>
          </div>
        ) : (
          <div className="space-y-2">
            <AnimatePresence mode="popLayout">
              {sorted.map((task) => (<TaskItem key={task.id} task={task} />))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  )
}

function ProjectsTab() {
  const { data: projects, isLoading } = useProjects()
  const { data: sessionsByProject } = useSessionsByProject()
  const { data: allTasks } = useTasks()
  const deleteProject = useDeleteProject()
  const updateProject = useUpdateProject()

  const [showForm, setShowForm] = useState(false)
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editName, setEditName] = useState('')

  const durationMap = new Map(sessionsByProject?.map((s) => [s.project_id, s.total_duration]) ?? [])
  const totalHours = Array.from(durationMap.values()).reduce((a, b) => a + b, 0)

  function getProjectTasks(projectId: string) {
    return allTasks?.filter((t) => t.project_id === projectId) ?? []
  }

  async function handleDelete(id: string) {
    try {
      await deleteProject.mutateAsync(id)
      setDeleteConfirmId(null)
      toast.success('Project deleted')
    } catch { toast.error('Failed to delete project') }
  }

  return (
    <div className="space-y-5">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-2xl border border-border bg-card p-4 shadow-sm text-center">
          <p className="text-2xl font-bold text-foreground">{projects?.length ?? 0}</p>
          <p className="text-xs text-muted-foreground mt-1">Projects</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-4 shadow-sm text-center">
          <p className="text-2xl font-bold text-foreground">{allTasks?.length ?? 0}</p>
          <p className="text-xs text-muted-foreground mt-1">Total Tasks</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-4 shadow-sm text-center">
          <p className="text-2xl font-bold text-foreground">{formatHours(totalHours)}</p>
          <p className="text-xs text-muted-foreground mt-1">Total Hours</p>
        </div>
      </div>

      <div className="flex items-end justify-between">
        <span className="text-sm text-muted-foreground">{projects?.length ?? 0} projects</span>
        <Button size="sm" onClick={() => setShowForm(true)} className="gap-1.5">
          <Plus className="h-3.5 w-3.5" />New Project
        </Button>
      </div>

      {/* Project list */}
      {isLoading ? (
        [1,2,3].map((i) => <div key={i} className="h-16 animate-pulse rounded-xl bg-muted" />)
      ) : !projects?.length ? (
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-border bg-card py-16 text-center shadow-sm">
          <FolderOpen className="h-10 w-10 text-muted-foreground/40" />
          <p className="text-sm text-muted-foreground">No projects yet</p>
          <Button size="sm" variant="outline" onClick={() => setShowForm(true)}>Create your first project</Button>
        </div>
      ) : (
        <div className="space-y-2">
          {projects.map((project) => {
            const tasks = getProjectTasks(project.id)
            const hours = durationMap.get(project.id) ?? 0
            const completed = tasks.filter((t) => t.completed).length

            return (
              <motion.div key={project.id} layout className="group flex items-center gap-4 rounded-xl border border-border bg-card p-4 hover:bg-accent/30 transition-colors">
                <div className="h-4 w-4 shrink-0 rounded-full" style={{ backgroundColor: project.color }} />

                {editingId === project.id ? (
                  <div className="flex flex-1 gap-2">
                    <input value={editName} onChange={(e) => setEditName(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter' && editName.trim()) { updateProject.mutate({ id: project.id, name: editName.trim() }); setEditingId(null) } if (e.key === 'Escape') setEditingId(null) }} autoFocus className="flex-1 bg-transparent text-sm text-foreground outline-none border-b border-primary/50" />
                    <Button size="sm" variant="ghost" onClick={() => setEditingId(null)}>Cancel</Button>
                  </div>
                ) : (
                  <>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground">{project.name}</p>
                      <p className="text-xs text-muted-foreground">{tasks.length} tasks · {completed} done · {formatHours(hours)}</p>
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                      <Button size="icon-xs" variant="ghost" onClick={() => { setEditingId(project.id); setEditName(project.name) }}><Pencil className="h-3 w-3 text-muted-foreground" /></Button>
                      <Button size="icon-xs" variant="ghost" onClick={() => setDeleteConfirmId(project.id)}><Trash2 className="h-3 w-3 text-muted-foreground" /></Button>
                    </div>
                  </>
                )}
              </motion.div>
            )
          })}
        </div>
      )}

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
