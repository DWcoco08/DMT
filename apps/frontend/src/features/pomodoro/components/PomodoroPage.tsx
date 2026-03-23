import { cn } from '@/lib/utils'
import { Play, Pause, SkipForward, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { usePomodoro } from '../hooks/usePomodoro'
import { useProjects } from '@/features/projects/hooks/useProjects'
import type { PomodoroMode } from '@/stores/pomodoroStore'

const modeConfig: Record<PomodoroMode, { label: string; color: string; bgColor: string; duration: number }> = {
  work: { label: 'Focus', color: 'text-red-500', bgColor: 'stroke-red-500', duration: 25 * 60 },
  break: { label: 'Short Break', color: 'text-green-500', bgColor: 'stroke-green-500', duration: 5 * 60 },
  longBreak: { label: 'Long Break', color: 'text-blue-500', bgColor: 'stroke-blue-500', duration: 15 * 60 },
}

const modes: PomodoroMode[] = ['work', 'break', 'longBreak']

export function PomodoroPage() {
  const pomo = usePomodoro()
  const { data: projects } = useProjects()

  const config = modeConfig[pomo.mode]
  const minutes = Math.floor(pomo.timeLeft / 60)
  const seconds = pomo.timeLeft % 60
  const progress = 1 - pomo.timeLeft / config.duration
  const circumference = 2 * Math.PI * 90
  const strokeDashoffset = circumference * (1 - progress)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Pomodoro</h1>
        <p className="text-sm text-muted-foreground">Stay focused with timed work sessions</p>
      </div>

      <div className="flex flex-col items-center gap-8">
        {/* Mode tabs */}
        <div className="flex gap-1 rounded-lg bg-muted p-1">
          {modes.map((m) => (
            <button
              key={m}
              onClick={() => pomo.switchMode(m)}
              className={cn(
                'rounded-md px-4 py-2 text-sm font-medium transition-colors',
                pomo.mode === m
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              {modeConfig[m].label}
            </button>
          ))}
        </div>

        {/* Circular timer */}
        <div className="relative flex items-center justify-center">
          <svg width="220" height="220" className="-rotate-90">
            {/* Background circle */}
            <circle
              cx="110"
              cy="110"
              r="90"
              fill="none"
              stroke="var(--color-border)"
              strokeWidth="6"
            />
            {/* Progress circle */}
            <circle
              cx="110"
              cy="110"
              r="90"
              fill="none"
              className={config.bgColor}
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              style={{ transition: 'stroke-dashoffset 0.5s ease' }}
            />
          </svg>
          <div className="absolute flex flex-col items-center">
            <span className="text-5xl font-bold font-mono text-foreground tabular-nums">
              {minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
            </span>
            <span className={cn('text-sm font-medium mt-1', config.color)}>
              {config.label}
            </span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="icon"
            onClick={pomo.reset}
            title="Reset"
          >
            <RotateCcw className="h-4 w-4" />
          </Button>

          <Button
            size="lg"
            onClick={pomo.isRunning ? pomo.pause : pomo.start}
            className="gap-2 px-8"
          >
            {pomo.isRunning ? (
              <>
                <Pause className="h-4 w-4" />
                Pause
              </>
            ) : (
              <>
                <Play className="h-4 w-4" />
                Start
              </>
            )}
          </Button>

          <Button
            variant="outline"
            size="icon"
            onClick={pomo.skip}
            title="Skip"
          >
            <SkipForward className="h-4 w-4" />
          </Button>
        </div>

        {/* Session counter */}
        <div className="flex items-center gap-2">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className={cn(
                'h-3 w-3 rounded-full transition-colors',
                i <= pomo.completedPomodoros % 4
                  ? 'bg-red-500'
                  : 'bg-muted'
              )}
            />
          ))}
          <span className="ml-2 text-sm text-muted-foreground">
            {pomo.completedPomodoros} sessions completed
          </span>
        </div>

        {/* Project selector */}
        <div className="w-full max-w-xs">
          <select
            value={pomo.projectId ?? ''}
            onChange={(e) => pomo.setProjectId(e.target.value || null)}
            className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground"
          >
            <option value="">No project</option>
            {projects?.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  )
}
