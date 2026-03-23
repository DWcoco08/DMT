import { useState } from 'react'
import { motion } from 'framer-motion'
import { Play, Square, Timer } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { formatDuration } from '@/lib/utils'
import { useTimer } from '../hooks/useTimer'
import { useProjects } from '@/features/projects/hooks/useProjects'

export function TimerWidget() {
  const timer = useTimer()
  const { data: projects } = useProjects()
  const [selectedProjectId, setSelectedProjectId] = useState<string>('')

  const activeProject = projects?.find((p) => p.id === timer.activeProjectId)

  function handleStart() {
    if (!selectedProjectId) return
    timer.start(selectedProjectId)
  }

  return (
    <div className="flex flex-col items-center gap-3">
      {/* Timer display */}
      <div className="relative flex items-center justify-center">
        {timer.isRunning && (
          <motion.div
            className={`absolute inset-0 rounded-full ${
              timer.warningLevel === 'danger' ? 'bg-red-500/20' :
              timer.warningLevel === 'warning' ? 'bg-yellow-500/20' :
              'bg-green-500/20'
            }`}
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        )}
        <div className={`relative flex h-24 w-24 items-center justify-center rounded-full border-4 bg-card ${
          timer.warningLevel === 'danger' ? 'border-red-500' :
          timer.warningLevel === 'warning' ? 'border-yellow-500' :
          'border-border'
        }`}>
          <span className="text-lg font-mono font-bold text-foreground tabular-nums">
            {formatDuration(timer.elapsed)}
          </span>
        </div>
      </div>

      {/* Active project indicator */}
      {timer.isRunning && activeProject && (
        <div className="flex items-center gap-2">
          <div
            className="h-2 w-2 rounded-full"
            style={{ backgroundColor: activeProject.color }}
          />
          <span className="text-sm text-muted-foreground">{activeProject.name}</span>
        </div>
      )}

      {/* Controls */}
      {!timer.isRunning ? (
        <div className="flex w-full flex-col gap-3">
          {projects && projects.length > 0 ? (
            <>
              <select
                value={selectedProjectId}
                onChange={(e) => setSelectedProjectId(e.target.value)}
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground"
              >
                <option value="">Select project...</option>
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
              <Button
                onClick={handleStart}
                disabled={!selectedProjectId || timer.isStarting}
                className="w-full gap-2"
              >
                <Play className="h-4 w-4" />
                {timer.isStarting ? 'Starting...' : 'Start Timer'}
              </Button>
            </>
          ) : (
            <div className="flex flex-col items-center gap-2 text-center">
              <Timer className="h-6 w-6 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                Create a project first to start tracking time
              </p>
            </div>
          )}
        </div>
      ) : (
        <Button
          onClick={() => timer.stop()}
          disabled={timer.isStopping}
          variant="destructive"
          className="w-full gap-2"
        >
          <Square className="h-4 w-4" />
          {timer.isStopping ? 'Stopping...' : 'Stop Timer'}
        </Button>
      )}
    </div>
  )
}
