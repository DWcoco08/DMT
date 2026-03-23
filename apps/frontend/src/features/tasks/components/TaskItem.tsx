import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Trash2, FolderOpen } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import type { Task } from '@/types/database'
import { useToggleTask, useDeleteTask, useUpdateTask } from '../hooks/useTasks'
import { useProjects } from '@/features/projects/hooks/useProjects'

interface TaskItemProps {
  task: Task
}

export function TaskItem({ task }: TaskItemProps) {
  const toggleTask = useToggleTask()
  const deleteTask = useDeleteTask()
  const updateTask = useUpdateTask()
  const { data: projects } = useProjects()

  const [isEditing, setIsEditing] = useState(false)
  const [editTitle, setEditTitle] = useState(task.title)
  const [showProjectPicker, setShowProjectPicker] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus()
      inputRef.current?.select()
    }
  }, [isEditing])

  function startEdit() {
    if (task.completed) return
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

  function cancelEdit() {
    setEditTitle(task.title)
    setIsEditing(false)
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter') saveEdit()
    if (e.key === 'Escape') cancelEdit()
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
      className="group flex items-center gap-3 rounded-lg border border-border p-3 transition-colors hover:bg-accent/30"
    >
      {/* Checkbox */}
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

      {/* Title — editable */}
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
            task.completed ? 'text-muted-foreground line-through' : 'text-foreground'
          )}
          title={task.completed ? undefined : 'Double-click to edit'}
        >
          {task.title}
        </span>
      )}

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

      {/* Actions — visible on hover */}
      <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
        {/* Change project */}
        <div className="relative">
          <Button
            variant="ghost"
            size="icon-xs"
            onClick={() => setShowProjectPicker(!showProjectPicker)}
            title="Change project"
          >
            <FolderOpen className="h-3 w-3 text-muted-foreground" />
          </Button>

          {showProjectPicker && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowProjectPicker(false)} />
              <div className="absolute right-0 top-full z-50 mt-1 w-40 rounded-lg border border-border bg-card p-1 shadow-lg">
                <button
                  onClick={() => changeProject(null)}
                  className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-xs text-muted-foreground hover:bg-accent/50"
                >
                  No project
                </button>
                {projects?.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => changeProject(p.id)}
                    className={cn(
                      'flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-xs hover:bg-accent/50',
                      p.id === task.project_id ? 'text-foreground font-medium' : 'text-muted-foreground'
                    )}
                  >
                    <span className="h-2 w-2 rounded-full" style={{ backgroundColor: p.color }} />
                    {p.name}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Delete */}
        <Button
          variant="ghost"
          size="icon-xs"
          onClick={() => deleteTask.mutate(task.id)}
        >
          <Trash2 className="h-3 w-3 text-muted-foreground" />
        </Button>
      </div>
    </motion.div>
  )
}
