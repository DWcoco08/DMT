import { motion } from 'framer-motion'
import { Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import type { Task } from '@/types/database'
import { useToggleTask, useDeleteTask } from '../hooks/useTasks'

interface TaskItemProps {
  task: Task
}

export function TaskItem({ task }: TaskItemProps) {
  const toggleTask = useToggleTask()
  const deleteTask = useDeleteTask()

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -5 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="group flex items-center gap-3 rounded-lg border border-border p-3 transition-colors hover:bg-accent/30"
    >
      <button
        onClick={() => toggleTask.mutate({ id: task.id, completed: !task.completed })}
        className={cn(
          'flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors',
          task.completed
            ? 'border-primary bg-primary text-primary-foreground'
            : 'border-muted-foreground hover:border-primary'
        )}
      >
        {task.completed && (
          <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        )}
      </button>

      <span
        className={cn(
          'flex-1 text-sm',
          task.completed ? 'text-muted-foreground line-through' : 'text-foreground'
        )}
      >
        {task.title}
      </span>

      <Button
        variant="ghost"
        size="icon-xs"
        onClick={() => deleteTask.mutate(task.id)}
        className="opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <Trash2 className="h-3 w-3 text-muted-foreground" />
      </Button>
    </motion.div>
  )
}
