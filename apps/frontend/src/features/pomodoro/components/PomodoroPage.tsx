import { cn } from '@/lib/utils'
import { Play, Pause, SkipForward, RotateCcw, Cpu } from 'lucide-react'
import { motion } from 'framer-motion'
import { usePomodoro } from '../hooks/usePomodoro'
import { useProjects } from '@/features/projects/hooks/useProjects'
import type { PomodoroMode } from '@/stores/pomodoroStore'

const modeConfig: Record<PomodoroMode, {
  label: string
  color: string
  glowColor: string
  strokeColor: string
  duration: number
}> = {
  work: { label: 'FOCUS', color: 'text-red-400', glowColor: 'rgba(239,68,68,0.3)', strokeColor: '#ef4444', duration: 25 * 60 },
  break: { label: 'SHORT BREAK', color: 'text-emerald-400', glowColor: 'rgba(52,211,153,0.3)', strokeColor: '#34d399', duration: 5 * 60 },
  longBreak: { label: 'LONG BREAK', color: 'text-cyan-400', glowColor: 'rgba(34,211,238,0.3)', strokeColor: '#22d3ee', duration: 15 * 60 },
}

const modes: PomodoroMode[] = ['work', 'break', 'longBreak']

export function PomodoroPage() {
  const pomo = usePomodoro()
  const { data: projects } = useProjects()

  const config = modeConfig[pomo.mode]
  const minutes = Math.floor(pomo.timeLeft / 60)
  const seconds = pomo.timeLeft % 60
  const progress = 1 - pomo.timeLeft / config.duration
  const radius = 100
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference * (1 - progress)

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Cpu className="h-6 w-6 text-red-500" />
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Pomodoro</h1>
          <p className="text-sm text-muted-foreground">Timed focus sessions</p>
        </div>
      </div>

      {/* Cyber frame */}
      <div className="relative rounded-2xl border border-red-900/30 bg-gradient-to-b from-[#0c0507] to-[#0a0a0c] p-1 overflow-hidden">
        {/* Corner accents */}
        <div className="absolute top-0 left-0 w-12 h-[2px] bg-gradient-to-r from-red-500 to-transparent" />
        <div className="absolute top-0 left-0 w-[2px] h-12 bg-gradient-to-b from-red-500 to-transparent" />
        <div className="absolute top-0 right-0 w-12 h-[2px] bg-gradient-to-l from-red-500 to-transparent" />
        <div className="absolute top-0 right-0 w-[2px] h-12 bg-gradient-to-b from-red-500 to-transparent" />
        <div className="absolute bottom-0 left-0 w-12 h-[2px] bg-gradient-to-r from-red-500 to-transparent" />
        <div className="absolute bottom-0 left-0 w-[2px] h-12 bg-gradient-to-t from-red-500 to-transparent" />
        <div className="absolute bottom-0 right-0 w-12 h-[2px] bg-gradient-to-l from-red-500 to-transparent" />
        <div className="absolute bottom-0 right-0 w-[2px] h-12 bg-gradient-to-t from-red-500 to-transparent" />

        {/* Scan line */}
        {pomo.isRunning && (
          <motion.div
            className="absolute inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-red-500/20 to-transparent pointer-events-none"
            animate={{ top: ['0%', '100%'] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
          />
        )}

        {/* Inner content */}
        <div className="relative rounded-xl bg-[#08060a]/80 backdrop-blur-sm px-6 py-6">
          {/* Status bar */}
          <div className="flex items-center justify-between mb-4 px-1">
            <div className="flex items-center gap-2">
              <div className={cn('h-1.5 w-1.5 rounded-full', pomo.isRunning ? 'bg-red-500 animate-pulse' : 'bg-zinc-700')} />
              <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500">
                {pomo.isRunning ? 'ACTIVE' : 'STANDBY'}
              </span>
            </div>
            <span className="text-[10px] font-mono text-zinc-700">SYS.POMO v1.0</span>
          </div>

          {/* Main layout: two columns */}
          <div className="flex flex-col lg:flex-row items-center gap-6 lg:gap-10">
            {/* Left: Timer */}
            <div className="flex flex-col items-center gap-5">
              {/* Mode tabs */}
              <div className="flex gap-0.5 rounded-md bg-zinc-900/80 border border-zinc-800 p-0.5">
                {modes.map((m) => (
                  <button
                    key={m}
                    onClick={() => pomo.switchMode(m)}
                    className={cn(
                      'rounded px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider transition-all',
                      pomo.mode === m
                        ? 'bg-zinc-800 text-white border border-zinc-700'
                        : 'text-zinc-500 hover:text-zinc-300'
                    )}
                  >
                    {modeConfig[m].label}
                  </button>
                ))}
              </div>

              {/* Timer circle */}
              <div className="relative flex items-center justify-center">
                {pomo.isRunning && (
                  <motion.div
                    className="absolute inset-0 rounded-full"
                    style={{ boxShadow: `0 0 40px ${config.glowColor}` }}
                    animate={{ opacity: [0.3, 0.6, 0.3] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                )}

                {/* Tick marks */}
                <svg width="240" height="240" className="absolute -rotate-90">
                  {Array.from({ length: 60 }).map((_, i) => {
                    const angle = (i * 6 * Math.PI) / 180
                    const isMajor = i % 5 === 0
                    const r1 = isMajor ? 112 : 114
                    const r2 = 118
                    return (
                      <line
                        key={i}
                        x1={120 + r1 * Math.cos(angle)}
                        y1={120 + r1 * Math.sin(angle)}
                        x2={120 + r2 * Math.cos(angle)}
                        y2={120 + r2 * Math.sin(angle)}
                        stroke={isMajor ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.04)'}
                        strokeWidth={isMajor ? 1.5 : 0.5}
                      />
                    )
                  })}
                </svg>

                <svg width="230" height="230" className="-rotate-90">
                  <circle cx="115" cy="115" r={radius} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="5" />
                  <circle
                    cx="115" cy="115" r={radius}
                    fill="none"
                    stroke={config.strokeColor}
                    strokeWidth="5"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    style={{
                      transition: 'stroke-dashoffset 0.5s ease',
                      filter: `drop-shadow(0 0 6px ${config.glowColor})`,
                    }}
                  />
                </svg>

                <div className="absolute flex flex-col items-center">
                  <span
                    className="text-5xl font-bold font-mono text-white tabular-nums"
                    style={{ textShadow: `0 0 15px ${config.glowColor}` }}
                  >
                    {minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
                  </span>
                  <span className={cn('text-[11px] font-mono uppercase tracking-[0.25em] mt-1', config.color)}>
                    {config.label}
                  </span>
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center gap-3">
                <button
                  onClick={pomo.reset}
                  className="flex h-10 w-10 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900/50 text-zinc-400 transition-all hover:border-zinc-600 hover:text-white"
                >
                  <RotateCcw className="h-4 w-4" />
                </button>

                <button
                  onClick={pomo.isRunning ? pomo.pause : pomo.start}
                  className={cn(
                    'flex h-11 items-center gap-2 rounded-lg border px-8 font-mono text-xs uppercase tracking-wider transition-all',
                    pomo.isRunning
                      ? 'border-zinc-700 bg-zinc-800/50 text-zinc-300 hover:border-zinc-500'
                      : 'border-red-800 bg-red-950/50 text-red-400 hover:bg-red-900/50 hover:border-red-600',
                  )}
                  style={!pomo.isRunning ? { boxShadow: '0 0 15px rgba(239,68,68,0.12)' } : undefined}
                >
                  {pomo.isRunning ? <><Pause className="h-4 w-4" /> Pause</> : <><Play className="h-4 w-4" /> Engage</>}
                </button>

                <button
                  onClick={pomo.skip}
                  className="flex h-10 w-10 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900/50 text-zinc-400 transition-all hover:border-zinc-600 hover:text-white"
                >
                  <SkipForward className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Right: Info panel */}
            <div className="flex flex-col gap-4 w-full lg:w-48">
              {/* Sessions */}
              <div className="rounded-lg border border-zinc-800/50 bg-zinc-900/30 p-3">
                <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-600 block mb-2">Sessions</span>
                <div className="flex items-center gap-2 mb-2">
                  {[1, 2, 3, 4].map((i) => (
                    <motion.div
                      key={i}
                      className={cn(
                        'h-3 w-3 transition-colors',
                        i <= pomo.completedPomodoros % 4
                          ? 'bg-red-500 shadow-[0_0_6px_rgba(239,68,68,0.5)]'
                          : 'bg-zinc-800 border border-zinc-700'
                      )}
                      style={{ clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)' }}
                    />
                  ))}
                </div>
                <span className="text-xs font-mono text-zinc-400">{pomo.completedPomodoros} total</span>
              </div>

              {/* Cycle info */}
              <div className="rounded-lg border border-zinc-800/50 bg-zinc-900/30 p-3">
                <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-600 block mb-1">Cycle</span>
                <span className="text-sm font-mono text-zinc-300">
                  {Math.floor(pomo.completedPomodoros / 4) + 1} / Round {(pomo.completedPomodoros % 4) + 1}
                </span>
              </div>

              {/* Project */}
              <div className="rounded-lg border border-zinc-800/50 bg-zinc-900/30 p-3">
                <label className="text-[10px] font-mono uppercase tracking-widest text-zinc-600 block mb-2">Target</label>
                <select
                  value={pomo.projectId ?? ''}
                  onChange={(e) => pomo.setProjectId(e.target.value || null)}
                  className="w-full rounded border border-zinc-800 bg-zinc-900/50 px-2 py-1.5 text-xs font-mono text-zinc-300 focus:border-red-800 focus:outline-none"
                >
                  <option value="">-- NONE --</option>
                  {projects?.map((p) => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>

              {/* Interval */}
              <div className="rounded-lg border border-zinc-800/50 bg-zinc-900/30 p-3">
                <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-600 block mb-1">Interval</span>
                <span className="text-sm font-mono text-zinc-300">{config.duration / 60}:00 min</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
