import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Trash2, FolderOpen, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import type { Task, TaskStatus } from '@/types/database'
import { useUpdateTaskStatus, useDeleteTask, useUpdateTask } from '../hooks/useTasks'
import { useProjects } from '@/features/projects/hooks/useProjects'

const statusConfig: Record<TaskStatus, { label: string; color: string; bg: string; next: TaskStatus }> = {
  todo: { label: 'To Do', color: 'border-muted-foreground/50', bg: '', next: 'pending' },
  pending: { label: 'Pending', color: 'border-yellow-500', bg: 'bg-yellow-500/30', next: 'in_progress' },
  in_progress: { label: 'In Progress', color: 'border-blue-500', bg: 'bg-blue-500/30', next: 'completed' },
  completed: { label: 'Done', color: 'border-green-500', bg: 'bg-green-500', next: 'todo' },
}

interface TaskItemProps {
  task: Task
}

export function TaskItem({ task }: TaskItemProps) {
  const updateStatus = useUpdateTaskStatus()
  const deleteTask = useDeleteTask()
  const updateTask = useUpdateTask()
  const { data: projects } = useProjects()

  const status = (task.status || (task.completed ? 'completed' : 'todo')) as TaskStatus
  const config = statusConfig[status]

  const [isEditing, setIsEditing] = useState(false)
  const [editTitle, setEditTitle] = useState(task.title)
  const [showProjectPicker, setShowProjectPicker] = useState(false)
  const [showStatusPicker, setShowStatusPicker] = useState(false)
  const [expanded, setExpanded] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus()
      inputRef.current?.select()
    }
  }, [isEditing])

  function selectStatus(newStatus: TaskStatus) {
    if (newStatus !== status) {
      updateStatus.mutate({ id: task.id, status: newStatus })
    }
    setShowStatusPicker(false)
  }

  function startEdit() {
    if (status === 'completed') return
    setEditTitle(task.title)
    setIsEditing(true)
  }

  function saveEdit() {
    const trimmed = editTitle.trim()
    if (trimmed && trimmed !== task.title) {
      updateTask.mutate({ id: task.id, title: trimmed })
    }
    setIsEditing(false)
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter') saveEdit()
    if (e.key === 'Escape') { setEditTitle(task.title); setIsEditing(false) }
  }

  function changeProject(projectId: string | null) {
    updateTask.mutate({ id: task.id, project_id: projectId })
    setShowProjectPicker(false)
  }

  const currentProject = projects?.find((p) => p.id === task.project_id)

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -5 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="group rounded-lg border border-border transition-colors hover:bg-accent/30"
    >
      <div className="flex items-center gap-3 p-3">
        {/* Status circle — click to open dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowStatusPicker(!showStatusPicker)}
            className={cn(
              'flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors',
              config.color, config.bg
            )}
          >
            {status === 'completed' && (
              <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            )}
            {status === 'in_progress' && (
              <div className="h-2 w-2 rounded-full bg-blue-500" />
            )}
            {status === 'pending' && (
              <div className="h-2 w-2 rounded-full bg-yellow-500/60" />
            )}
          </button>

          {showStatusPicker && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowStatusPicker(false)} />
              <div className="absolute left-0 top-full z-50 mt-1 w-36 rounded-lg border border-border bg-card p-1 shadow-lg">
                {(Object.entries(statusConfig) as [TaskStatus, typeof config][]).map(([key, cfg]) => (
                  <button
                    key={key}
                    onClick={() => selectStatus(key)}
                    className={cn(
                      'flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-xs transition-colors hover:bg-accent/50',
                      key === status ? 'text-foreground font-medium' : 'text-muted-foreground'
                    )}
                  >
                    <div className={cn('h-3 w-3 rounded-full border-2', cfg.color, cfg.bg)} />
                    {cfg.label}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Title */}
        {isEditing ? (
          <input
            ref={inputRef}
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            onBlur={saveEdit}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent text-sm text-foreground outline-none border-b border-primary/50 py-0.5"
          />
        ) : (
          <span
            onDoubleClick={startEdit}
            className={cn(
              'flex-1 text-sm cursor-default',
              status === 'completed' ? 'text-muted-foreground line-through' : 'text-foreground'
            )}
            title={status === 'completed' ? undefined : 'Double-click to edit'}
          >
            {task.title}
          </span>
        )}

        {/* Status badge */}
        <span className={cn(
          'hidden sm:inline-flex text-[10px] font-medium px-1.5 py-0.5 rounded',
          status === 'todo' && 'text-muted-foreground/70 bg-muted/50',
          status === 'pending' && 'text-yellow-500 bg-yellow-500/10',
          status === 'in_progress' && 'text-blue-500 bg-blue-500/10',
          status === 'completed' && 'text-green-500 bg-green-500/10',
        )}>
          {config.label}
        </span>

        {/* Project badge */}
        {currentProject && !isEditing && (
          <span
            className="hidden sm:inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] text-muted-foreground border border-border"
            style={{ borderColor: currentProject.color + '40' }}
          >
            <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: currentProject.color }} />
            {currentProject.name}
          </span>
        )}

        {/* Expand if description */}
        {task.description && (
          <Button variant="ghost" size="icon-xs" onClick={() => setExpanded(!expanded)}>
            <ChevronDown className={cn('h-3 w-3 text-muted-foreground transition-transform', expanded && 'rotate-180')} />
          </Button>
        )}

        {/* Actions */}
        <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="relative">
            <Button variant="ghost" size="icon-xs" onClick={() => setShowProjectPicker(!showProjectPicker)} title="Change project">
              <FolderOpen className="h-3 w-3 text-muted-foreground" />
            </Button>
            {showProjectPicker && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowProjectPicker(false)} />
                <div className="absolute right-0 top-full z-50 mt-1 w-40 rounded-lg border border-border bg-card p-1 shadow-lg">
                  <button onClick={() => changeProject(null)} className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-xs text-muted-foreground hover:bg-accent/50">No project</button>
                  {projects?.map((p) => (
                    <button key={p.id} onClick={() => changeProject(p.id)} className={cn('flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-xs hover:bg-accent/50', p.id === task.project_id ? 'text-foreground font-medium' : 'text-muted-foreground')}>
                      <span className="h-2 w-2 rounded-full" style={{ backgroundColor: p.color }} />
                      {p.name}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
          <Button variant="ghost" size="icon-xs" onClick={() => deleteTask.mutate(task.id)}>
            <Trash2 className="h-3 w-3 text-muted-foreground" />
          </Button>
        </div>
      </div>

      {/* Description expanded */}
      {expanded && task.description && (
        <div className="px-11 pb-3">
          <p className="text-xs text-muted-foreground leading-relaxed">{task.description}</p>
        </div>
      )}
    </motion.div>
  )
}
