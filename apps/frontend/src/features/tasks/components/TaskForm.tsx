import { useState } from 'react'
import { Plus, ChevronDown, ChevronUp } from 'lucide-react'
import { toast } from 'sonner'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useCreateTask } from '../hooks/useTasks'
import { useProjects } from '@/features/projects/hooks/useProjects'

export function TaskForm() {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [projectId, setProjectId] = useState<string>('')
  const [showDesc, setShowDesc] = useState(false)
  const createTask = useCreateTask()
  const { data: projects } = useProjects()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const trimmed = title.trim()
    if (!trimmed) return

    try {
      await createTask.mutateAsync({
        title: trimmed,
        description: description.trim() || undefined,
        projectId: projectId || undefined,
      })
      setTitle('')
      setDescription('')
      setShowDesc(false)
    } catch {
      toast.error('Failed to create task')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <div className="flex gap-2">
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
        <Button
          type="button"
          size="icon"
          variant="ghost"
          onClick={() => setShowDesc(!showDesc)}
          title="Add description"
        >
          {showDesc ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </Button>
        <Button type="submit" size="icon" disabled={!title.trim() || createTask.isPending}>
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      {showDesc && (
        <div className="space-y-1">
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value.slice(0, 360))}
            placeholder="Description (optional)..."
            maxLength={360}
            rows={2}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-1 focus:ring-ring"
          />
          <p className="text-[10px] text-muted-foreground text-right">{description.length}/360</p>
        </div>
      )}
    </form>
  )
}
