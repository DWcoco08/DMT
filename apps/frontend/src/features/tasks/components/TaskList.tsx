import { useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { CheckCircle2, Circle, ListTodo, Loader, Search } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { useTasks } from '../hooks/useTasks'
import { TaskForm } from './TaskForm'
import { TaskItem } from './TaskItem'

type Filter = 'all' | 'pending' | 'in_progress' | 'completed'

const filters: { key: Filter; label: string; icon: React.ReactNode }[] = [
  { key: 'all', label: 'All', icon: <ListTodo className="h-3 w-3" /> },
  { key: 'pending', label: 'Pending', icon: <Circle className="h-3 w-3" /> },
  { key: 'in_progress', label: 'Active', icon: <Loader className="h-3 w-3" /> },
  { key: 'completed', label: 'Done', icon: <CheckCircle2 className="h-3 w-3" /> },
]

export function TaskList() {
  const [filter, setFilter] = useState<Filter>('all')
  const [search, setSearch] = useState('')

  const taskFilters = filter === 'all'
    ? undefined
    : { status: filter as 'pending' | 'in_progress' | 'completed' }

  const { data: tasks, isLoading } = useTasks(taskFilters)

  const filtered = tasks?.filter((t) =>
    search ? t.title.toLowerCase().includes(search.toLowerCase()) : true
  )

  return (
    <div className="space-y-3">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search tasks..."
          className="h-8 pl-8 text-xs"
        />
      </div>

      <Separator />

      {/* Add task */}
      <TaskForm />

      {/* Filter tabs */}
      <div className="flex gap-1 rounded-lg bg-muted p-1">
        {filters.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={cn(
              'flex flex-1 items-center justify-center gap-1 rounded-md px-2 py-1.5 text-[11px] font-medium transition-colors',
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
      {isLoading ? (
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-12 animate-pulse rounded-lg bg-muted" />
          ))}
        </div>
      ) : !filtered?.length ? (
        <p className="py-6 text-center text-xs text-muted-foreground">
          {search ? 'No tasks match' : filter === 'all' ? 'No tasks yet' : `No ${filter.replace('_', ' ')} tasks`}
        </p>
      ) : (
        <div className="space-y-1.5">
          <AnimatePresence mode="popLayout">
            {filtered.map((task) => (
              <TaskItem key={task.id} task={task} />
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  )
}
