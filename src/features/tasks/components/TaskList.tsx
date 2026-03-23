import { useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { CheckCircle2, Circle, ListTodo } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useTasks } from '../hooks/useTasks'
import { TaskForm } from './TaskForm'
import { TaskItem } from './TaskItem'

type Filter = 'all' | 'pending' | 'completed'

const filters: { key: Filter; label: string; icon: React.ReactNode }[] = [
  { key: 'all', label: 'All', icon: <ListTodo className="h-3 w-3" /> },
  { key: 'pending', label: 'Pending', icon: <Circle className="h-3 w-3" /> },
  { key: 'completed', label: 'Done', icon: <CheckCircle2 className="h-3 w-3" /> },
]

export function TaskList() {
  const [filter, setFilter] = useState<Filter>('all')

  const taskFilters = filter === 'all'
    ? undefined
    : { completed: filter === 'completed' }

  const { data: tasks, isLoading } = useTasks(taskFilters)

  return (
    <div className="space-y-4">
      <TaskForm />

      {/* Filter tabs */}
      <div className="flex gap-1 rounded-lg bg-muted p-1">
        {filters.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={cn(
              'flex flex-1 items-center justify-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors',
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
      ) : !tasks?.length ? (
        <p className="py-8 text-center text-sm text-muted-foreground">
          {filter === 'all' ? 'No tasks yet. Add one above!' : `No ${filter} tasks`}
        </p>
      ) : (
        <div className="space-y-2">
          <AnimatePresence mode="popLayout">
            {tasks.map((task) => (
              <TaskItem key={task.id} task={task} />
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  )
}
