import { useState } from 'react'
import { Plus } from 'lucide-react'
import { toast } from 'sonner'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useCreateTask } from '../hooks/useTasks'
import { useProjects } from '@/features/projects/hooks/useProjects'

export function TaskForm() {
  const [title, setTitle] = useState('')
  const [projectId, setProjectId] = useState<string>('')
  const createTask = useCreateTask()
  const { data: projects } = useProjects()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const trimmed = title.trim()
    if (!trimmed) return

    try {
      await createTask.mutateAsync({
        title: trimmed,
        projectId: projectId || undefined,
      })
      setTitle('')
    } catch {
      toast.error('Failed to create task')
    }
  }

  return (
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
  )
}
