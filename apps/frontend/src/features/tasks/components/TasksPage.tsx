import { useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { Search, CheckCircle2, Circle, ListTodo, ClipboardList, Loader } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Input } from '@/components/ui/input'
import { useTasks } from '../hooks/useTasks'
import { useProjects } from '@/features/projects/hooks/useProjects'
import { TaskForm } from './TaskForm'
import { TaskItem } from './TaskItem'

type Filter = 'all' | 'pending' | 'in_progress' | 'completed'
type Sort = 'newest' | 'oldest' | 'name'

const filterOptions: { key: Filter; label: string; icon: React.ReactNode }[] = [
  { key: 'all', label: 'All', icon: <ListTodo className="h-3.5 w-3.5" /> },
  { key: 'pending', label: 'Pending', icon: <Circle className="h-3.5 w-3.5" /> },
  { key: 'in_progress', label: 'In Progress', icon: <Loader className="h-3.5 w-3.5" /> },
  { key: 'completed', label: 'Done', icon: <CheckCircle2 className="h-3.5 w-3.5" /> },
]

export function TasksPage() {
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
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Tasks</h1>
        <p className="text-sm text-muted-foreground">Manage all your tasks in one place</p>
      </div>

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

      {/* Add task */}
      <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
        <TaskForm />
      </div>

      {/* Filters bar */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search tasks..."
            className="pl-10"
          />
        </div>
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
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as Sort)}
          className="rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground"
        >
          <option value="newest">Newest first</option>
          <option value="oldest">Oldest first</option>
          <option value="name">By name</option>
        </select>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1 rounded-lg bg-muted p-1 w-fit">
        {filterOptions.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={cn(
              'flex items-center gap-1.5 rounded-md px-4 py-2 text-sm font-medium transition-colors',
              filter === f.key
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            {f.icon}
            {f.label}
          </button>
        ))}
      </div>

      {/* Task list */}
      <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
        {isLoading ? (
          <div className="space-y-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-12 animate-pulse rounded-lg bg-muted" />
            ))}
          </div>
        ) : !sorted?.length ? (
          <div className="flex flex-col items-center gap-3 py-12 text-center">
            <ClipboardList className="h-10 w-10 text-muted-foreground/40" />
            <p className="text-sm text-muted-foreground">
              {search ? 'No tasks match your search' : filter === 'all' ? 'No tasks yet' : `No ${filter} tasks`}
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            <AnimatePresence mode="popLayout">
              {sorted.map((task) => (
                <TaskItem key={task.id} task={task} />
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  )
}
