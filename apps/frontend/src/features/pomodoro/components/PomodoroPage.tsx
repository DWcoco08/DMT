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
  const radius = 130
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference * (1 - progress)

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Pomodoro Timer</h1>
        <p className="text-sm text-muted-foreground mt-1">Stay focused with timed work sessions</p>
      </div>

      <div className="flex flex-col items-center gap-10">
        {/* Mode tabs */}
        <div className="flex gap-1 rounded-xl bg-muted p-1.5">
          {modes.map((m) => (
            <button
              key={m}
              onClick={() => pomo.switchMode(m)}
              className={cn(
                'rounded-lg px-6 py-2.5 text-sm font-medium transition-colors',
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
          <svg width="300" height="300" className="-rotate-90">
            <circle
              cx="150"
              cy="150"
              r={radius}
              fill="none"
              stroke="var(--color-border)"
              strokeWidth="8"
            />
            <circle
              cx="150"
              cy="150"
              r={radius}
              fill="none"
              className={config.bgColor}
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              style={{ transition: 'stroke-dashoffset 0.5s ease' }}
            />
          </svg>
          <div className="absolute flex flex-col items-center">
            <span className="text-7xl font-bold font-mono text-foreground tabular-nums">
              {minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
            </span>
            <span className={cn('text-lg font-medium mt-2', config.color)}>
              {config.label}
            </span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="lg"
            onClick={pomo.reset}
            title="Reset"
            className="h-12 w-12"
          >
            <RotateCcw className="h-5 w-5" />
          </Button>

          <Button
            size="lg"
            onClick={pomo.isRunning ? pomo.pause : pomo.start}
            className="gap-2 px-10 h-14 text-base"
          >
            {pomo.isRunning ? (
              <>
                <Pause className="h-5 w-5" />
                Pause
              </>
            ) : (
              <>
                <Play className="h-5 w-5" />
                Start
              </>
            )}
          </Button>

          <Button
            variant="outline"
            size="lg"
            onClick={pomo.skip}
            title="Skip"
            className="h-12 w-12"
          >
            <SkipForward className="h-5 w-5" />
          </Button>
        </div>

        {/* Session counter */}
        <div className="flex items-center gap-3">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className={cn(
                'h-4 w-4 rounded-full transition-colors',
                i <= pomo.completedPomodoros % 4
                  ? 'bg-red-500'
                  : 'bg-muted'
              )}
            />
          ))}
          <span className="ml-2 text-base text-muted-foreground">
            {pomo.completedPomodoros} sessions completed
          </span>
        </div>

        {/* Project selector */}
        <div className="w-full max-w-sm">
          <label className="block text-sm font-medium text-muted-foreground mb-2">Working on</label>
          <select
            value={pomo.projectId ?? ''}
            onChange={(e) => pomo.setProjectId(e.target.value || null)}
            className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm text-foreground"
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
