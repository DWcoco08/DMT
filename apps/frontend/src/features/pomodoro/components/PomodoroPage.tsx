import { cn } from '@/lib/utils'
import { Play, Pause, SkipForward, RotateCcw } from 'lucide-react'
import { motion } from 'framer-motion'
import { usePomodoro } from '../hooks/usePomodoro'
import { useProjects } from '@/features/projects/hooks/useProjects'
import type { PomodoroMode } from '@/stores/pomodoroStore'

const modeConfig: Record<PomodoroMode, {
  label: string
  color: string
  strokeColor: string
  duration: number
}> = {
  work: { label: 'FOCUS', color: 'text-primary', strokeColor: 'var(--color-primary)', duration: 25 * 60 },
  break: { label: 'SHORT BREAK', color: 'text-emerald-400', strokeColor: '#34d399', duration: 5 * 60 },
  longBreak: { label: 'LONG BREAK', color: 'text-cyan-400', strokeColor: '#22d3ee', duration: 15 * 60 },
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
    <div className="flex h-[calc(100vh-3.5rem)] flex-col gap-3 overflow-hidden">
      {/* Header */}
      <div className="shrink-0">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Pomodoro</h1>
        <p className="text-sm text-muted-foreground">Timed focus sessions</p>
      </div>

      {/* Cyber frame */}
      <div className="relative flex-1 min-h-0 rounded-2xl border-2 border-primary/40 bg-card p-1 overflow-hidden">
        {/* Corner accents */}
        <div className="absolute top-0 left-0 w-24 h-[3px] bg-gradient-to-r from-primary via-primary/60 to-transparent" />
        <div className="absolute top-0 left-0 w-[3px] h-24 bg-gradient-to-b from-primary via-primary/60 to-transparent" />
        <div className="absolute top-0 right-0 w-24 h-[3px] bg-gradient-to-l from-primary via-primary/60 to-transparent" />
        <div className="absolute top-0 right-0 w-[3px] h-24 bg-gradient-to-b from-primary via-primary/60 to-transparent" />
        <div className="absolute bottom-0 left-0 w-24 h-[3px] bg-gradient-to-r from-primary via-primary/60 to-transparent" />
        <div className="absolute bottom-0 left-0 w-[3px] h-24 bg-gradient-to-t from-primary via-primary/60 to-transparent" />
        <div className="absolute bottom-0 right-0 w-24 h-[3px] bg-gradient-to-l from-primary via-primary/60 to-transparent" />
        <div className="absolute bottom-0 right-0 w-[3px] h-24 bg-gradient-to-t from-primary via-primary/60 to-transparent" />

        {/* Corner glow dots */}
        <div className="absolute top-0 left-0 w-2 h-2 rounded-full bg-primary shadow-[0_0_8px] shadow-primary/80" />
        <div className="absolute top-0 right-0 w-2 h-2 rounded-full bg-primary shadow-[0_0_8px] shadow-primary/80" />
        <div className="absolute bottom-0 left-0 w-2 h-2 rounded-full bg-primary shadow-[0_0_8px] shadow-primary/80" />
        <div className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-primary shadow-[0_0_8px] shadow-primary/80" />

        {/* Scan line */}
        {pomo.isRunning && (
          <motion.div
            className="absolute inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-primary/30 to-transparent pointer-events-none"
            animate={{ top: ['0%', '100%'] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
          />
        )}

        {/* Inner */}
        <div className="relative flex h-full flex-col rounded-xl bg-background/80 backdrop-blur-sm px-6 py-5">
          {/* Top-left: Status */}
          <div className="absolute top-4 left-5 flex items-center gap-2">
            <div className={cn('h-2 w-2 rounded-full', pomo.isRunning ? 'bg-primary animate-pulse shadow-[0_0_8px] shadow-primary/60' : 'bg-muted-foreground/30')} />
            <span className="text-[11px] font-mono uppercase tracking-widest text-muted-foreground">
              {pomo.isRunning ? 'ACTIVE' : 'STANDBY'}
            </span>
          </div>

          {/* Top-right: Cycle */}
          <div className="absolute top-4 right-5 text-right">
            <span className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground">
              CYCLE {Math.floor(pomo.completedPomodoros / 4) + 1} · ROUND {(pomo.completedPomodoros % 4) + 1}
            </span>
          </div>

          {/* Bottom-left: Sessions */}
          <div className="absolute bottom-4 left-5 flex items-center gap-2">
            {[1, 2, 3, 4].map((i) => (
              <motion.div
                key={i}
                className={cn(
                  'h-3 w-3 transition-colors',
                  i <= pomo.completedPomodoros % 4
                    ? 'bg-primary shadow-[0_0_8px] shadow-primary/50'
                    : 'bg-muted border border-border'
                )}
                style={{ clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)' }}
              />
            ))}
            <span className="text-[11px] font-mono text-muted-foreground">{pomo.completedPomodoros} SESSIONS</span>
          </div>

          {/* Bottom-right: Target */}
          <div className="absolute bottom-4 right-5 flex items-center gap-2">
            <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">Target:</span>
            <select
              value={pomo.projectId ?? ''}
              onChange={(e) => pomo.setProjectId(e.target.value || null)}
              className="rounded border border-border bg-muted px-2 py-1 text-[11px] font-mono text-foreground focus:border-primary focus:outline-none"
            >
              <option value="">NONE</option>
              {projects?.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>

          {/* Center content */}
          <div className="flex flex-1 flex-col items-center justify-center gap-6">
            {/* Mode tabs */}
            <div className="flex gap-1 rounded-lg bg-muted border border-border p-1">
              {modes.map((m) => (
                <button
                  key={m}
                  onClick={() => pomo.switchMode(m)}
                  className={cn(
                    'rounded-md px-5 py-2 text-xs font-mono uppercase tracking-wider transition-all',
                    pomo.mode === m
                      ? 'bg-background text-foreground shadow-inner border border-border'
                      : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  {modeConfig[m].label}
                </button>
              ))}
            </div>

            {/* Timer */}
            <div className="relative flex items-center justify-center">
              {pomo.isRunning && (
                <motion.div
                  className="absolute inset-0 rounded-full shadow-[0_0_60px] shadow-primary/30"
                  animate={{ opacity: [0.3, 0.6, 0.3] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              )}

              <svg width="320" height="320" className="absolute -rotate-90">
                <circle cx="160" cy="160" r="155" fill="none" stroke="var(--color-border)" strokeWidth="1" strokeOpacity="0.3" />
                {Array.from({ length: 60 }).map((_, i) => {
                  const angle = (i * 6 * Math.PI) / 180
                  const isMajor = i % 5 === 0
                  const r1 = isMajor ? 145 : 148
                  const r2 = 152
                  return (
                    <line
                      key={i}
                      x1={160 + r1 * Math.cos(angle)}
                      y1={160 + r1 * Math.sin(angle)}
                      x2={160 + r2 * Math.cos(angle)}
                      y2={160 + r2 * Math.sin(angle)}
                      stroke="var(--color-foreground)"
                      strokeOpacity={isMajor ? 0.15 : 0.05}
                      strokeWidth={isMajor ? 1.5 : 0.5}
                    />
                  )
                })}
              </svg>

              <svg width="300" height="300" className="-rotate-90">
                <circle cx="150" cy="150" r={radius} fill="none" stroke="var(--color-border)" strokeWidth="6" strokeOpacity="0.2" />
                <circle
                  cx="150" cy="150" r={radius}
                  fill="none"
                  stroke={config.strokeColor}
                  strokeWidth="6"
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
                <span className={cn('text-sm font-mono uppercase tracking-[0.3em] mt-2', config.color)}>
                  {config.label}
                </span>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-4">
              <button
                onClick={pomo.reset}
                className="flex h-12 w-12 items-center justify-center rounded-lg border border-border bg-muted text-muted-foreground transition-all hover:border-primary/40 hover:text-foreground"
              >
                <RotateCcw className="h-5 w-5" />
              </button>

              <button
                onClick={pomo.isRunning ? pomo.pause : pomo.start}
                className={cn(
                  'flex h-14 items-center gap-3 rounded-lg border px-10 font-mono text-sm uppercase tracking-wider transition-all',
                  pomo.isRunning
                    ? 'border-border bg-muted text-foreground hover:border-primary/40'
                    : 'border-primary/60 bg-primary/10 text-primary hover:bg-primary/20 hover:border-primary',
                )}
              >
                {pomo.isRunning ? <><Pause className="h-5 w-5" /> Pause</> : <><Play className="h-5 w-5" /> Engage</>}
              </button>

              <button
                onClick={pomo.skip}
                className="flex h-12 w-12 items-center justify-center rounded-lg border border-border bg-muted text-muted-foreground transition-all hover:border-primary/40 hover:text-foreground"
              >
                <SkipForward className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
