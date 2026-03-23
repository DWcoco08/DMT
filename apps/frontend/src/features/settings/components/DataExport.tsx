import { useState } from 'react'
import { format } from 'date-fns'
import { Download, FileText, FileJson, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { toCSV, downloadFile, downloadJSON } from '@/lib/export'
import { taskService } from '@/features/tasks/services/taskService'
import { timeSessionService } from '@/features/time-tracking/services/timeSessionService'
import { projectService } from '@/features/projects/services/projectService'
import { formatDuration } from '@/lib/utils'

const today = () => format(new Date(), 'yyyy-MM-dd')

export function DataExport() {
  const [loading, setLoading] = useState<string | null>(null)

  async function exportTasks() {
    setLoading('tasks')
    try {
      const tasks = await taskService.getTasks()
      const projects = await projectService.getProjects()
      const projectMap = new Map(projects.map((p) => [p.id, p.name]))

      const csv = toCSV(
        ['Title', 'Project', 'Completed', 'Created At'],
        tasks.map((t) => [
          t.title,
          t.project_id ? projectMap.get(t.project_id) ?? '' : '',
          t.completed ? 'Yes' : 'No',
          format(new Date(t.created_at), 'yyyy-MM-dd HH:mm'),
        ])
      )
      downloadFile(csv, `devpulse-tasks-${today()}.csv`)
      toast.success(`Exported ${tasks.length} tasks`)
    } catch {
      toast.error('Failed to export tasks')
    } finally {
      setLoading(null)
    }
  }

  async function exportSessions() {
    setLoading('sessions')
    try {
      const sessions = await timeSessionService.getRecentSessions(1000)
      const projects = await projectService.getProjects()
      const projectMap = new Map(projects.map((p) => [p.id, p.name]))

      const csv = toCSV(
        ['Project', 'Start', 'End', 'Duration'],
        sessions.map((s) => [
          s.project_id ? projectMap.get(s.project_id) ?? '' : '',
          format(new Date(s.start_time), 'yyyy-MM-dd HH:mm'),
          s.end_time ? format(new Date(s.end_time), 'yyyy-MM-dd HH:mm') : 'Running',
          formatDuration(s.duration),
        ])
      )
      downloadFile(csv, `devpulse-sessions-${today()}.csv`)
      toast.success(`Exported ${sessions.length} sessions`)
    } catch {
      toast.error('Failed to export sessions')
    } finally {
      setLoading(null)
    }
  }

  async function exportAll() {
    setLoading('all')
    try {
      const [tasks, sessions, projects] = await Promise.all([
        taskService.getTasks(),
        timeSessionService.getRecentSessions(1000),
        projectService.getProjects(),
      ])
      downloadJSON({ projects, tasks, sessions, exportedAt: new Date().toISOString() }, `devpulse-backup-${today()}.json`)
      toast.success('Full backup exported')
    } catch {
      toast.error('Failed to export data')
    } finally {
      setLoading(null)
    }
  }

  const exports = [
    { id: 'tasks', label: 'Tasks', desc: 'All tasks with project and status', icon: FileText, action: exportTasks },
    { id: 'sessions', label: 'Time Sessions', desc: 'All time tracking sessions', icon: FileText, action: exportSessions },
    { id: 'all', label: 'Full Backup', desc: 'All data as JSON', icon: FileJson, action: exportAll },
  ]

  return (
    <div className="space-y-3">
      {exports.map((exp) => (
        <div
          key={exp.id}
          className="flex items-center justify-between rounded-lg border border-border p-4"
        >
          <div className="flex items-center gap-3">
            <exp.icon className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium text-foreground">{exp.label}</p>
              <p className="text-xs text-muted-foreground">{exp.desc}</p>
            </div>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={exp.action}
            disabled={loading !== null}
            className="gap-1.5"
          >
            {loading === exp.id ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Download className="h-3.5 w-3.5" />
            )}
            Export
          </Button>
        </div>
      ))}
    </div>
  )
}
