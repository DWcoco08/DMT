import { useState } from 'react'
import { Plus, X } from 'lucide-react'
import { toast } from 'sonner'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useCreateTask, useUpdateTask } from '../hooks/useTasks'
import { useProjects } from '@/features/projects/hooks/useProjects'

export function TaskForm() {
  const [title, setTitle] = useState('')
  const [projectId, setProjectId] = useState<string>('')
  const [newTaskId, setNewTaskId] = useState<string | null>(null)
  const [description, setDescription] = useState('')
  const createTask = useCreateTask()
  const updateTask = useUpdateTask()
  const { data: projects } = useProjects()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const trimmed = title.trim()
    if (!trimmed) return

    try {
      const task = await createTask.mutateAsync({
        title: trimmed,
        projectId: projectId || undefined,
      })
      setTitle('')
      setNewTaskId(task.id)
      setDescription('')
    } catch {
      toast.error('Failed to create task')
    }
  }

  function saveDescription() {
    if (newTaskId && description.trim()) {
      updateTask.mutate({ id: newTaskId, description: description.trim() })
    }
    setNewTaskId(null)
    setDescription('')
  }

  return (
    <div className="space-y-2">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Add a task..."
          className="flex-1"
        />
        {projects && projects.length > 0 && (
          <select
            value={projectId}
            onChange={(e) => setProjectId(e.target.value)}
            className="rounded-md border border-input bg-background px-2 text-sm text-foreground"
          >
            <option value="">No project</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        )}
        <Button type="submit" size="icon" disabled={!title.trim() || createTask.isPending}>
          <Plus className="h-4 w-4" />
        </Button>
      </form>

      {/* Description for newly created task */}
      {newTaskId && (
        <div className="rounded-lg border border-primary/20 bg-primary/5 p-3 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-foreground">Add description (optional)</span>
            <button onClick={() => { setNewTaskId(null); setDescription('') }} className="text-muted-foreground hover:text-foreground">
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value.slice(0, 360))}
            placeholder="What is this task about?"
            maxLength={360}
            rows={2}
            autoFocus
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-1 focus:ring-ring"
          />
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-muted-foreground">{description.length}/360</span>
            <div className="flex gap-2">
              <Button size="sm" variant="ghost" onClick={() => { setNewTaskId(null); setDescription('') }}>
                Skip
              </Button>
              <Button size="sm" onClick={saveDescription} disabled={!description.trim()}>
                Save
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
