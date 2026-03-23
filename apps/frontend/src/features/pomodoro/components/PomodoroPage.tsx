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
  const radius = 130
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference * (1 - progress)

  return (
    <div className="flex h-[calc(100vh-2rem)] flex-col gap-3 -mt-2 md:-mt-1">
      {/* Header — compact */}
      <div className="flex items-center gap-3 shrink-0">
        <Cpu className="h-6 w-6 text-red-500" />
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Pomodoro</h1>
      </div>

      {/* Cyber frame — fills remaining space */}
      <div className="relative flex-1 min-h-0 rounded-2xl border-2 border-red-500/40 bg-gradient-to-b from-[#0c0507] to-[#0a0a0c] p-1 overflow-hidden">
        {/* Corner accents — brighter, longer */}
        <div className="absolute top-0 left-0 w-24 h-[3px] bg-gradient-to-r from-red-500 via-red-500/60 to-transparent" />
        <div className="absolute top-0 left-0 w-[3px] h-24 bg-gradient-to-b from-red-500 via-red-500/60 to-transparent" />
        <div className="absolute top-0 right-0 w-24 h-[3px] bg-gradient-to-l from-red-500 via-red-500/60 to-transparent" />
        <div className="absolute top-0 right-0 w-[3px] h-24 bg-gradient-to-b from-red-500 via-red-500/60 to-transparent" />
        <div className="absolute bottom-0 left-0 w-24 h-[3px] bg-gradient-to-r from-red-500 via-red-500/60 to-transparent" />
        <div className="absolute bottom-0 left-0 w-[3px] h-24 bg-gradient-to-t from-red-500 via-red-500/60 to-transparent" />
        <div className="absolute bottom-0 right-0 w-24 h-[3px] bg-gradient-to-l from-red-500 via-red-500/60 to-transparent" />
        <div className="absolute bottom-0 right-0 w-[3px] h-24 bg-gradient-to-t from-red-500 via-red-500/60 to-transparent" />

        {/* Corner glow dots */}
        <div className="absolute top-0 left-0 w-2 h-2 bg-red-500 rounded-full shadow-[0_0_8px_rgba(239,68,68,0.8)]" />
        <div className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full shadow-[0_0_8px_rgba(239,68,68,0.8)]" />
        <div className="absolute bottom-0 left-0 w-2 h-2 bg-red-500 rounded-full shadow-[0_0_8px_rgba(239,68,68,0.8)]" />
        <div className="absolute bottom-0 right-0 w-2 h-2 bg-red-500 rounded-full shadow-[0_0_8px_rgba(239,68,68,0.8)]" />

        {/* Scan line */}
        {pomo.isRunning && (
          <motion.div
            className="absolute inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-red-500/30 to-transparent pointer-events-none"
            animate={{ top: ['0%', '100%'] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
          />
        )}

        {/* Inner — flex to fill */}
        <div className="relative flex h-full flex-col rounded-xl bg-[#08060a]/80 backdrop-blur-sm px-6 py-5">
          {/* Status bar */}
          <div className="flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              <div className={cn('h-2 w-2 rounded-full', pomo.isRunning ? 'bg-red-500 animate-pulse' : 'bg-zinc-700')} />
              <span className="text-[11px] font-mono uppercase tracking-widest text-zinc-500">
                {pomo.isRunning ? 'ACTIVE' : 'STANDBY'}
              </span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-[11px] font-mono text-zinc-600">
                CYCLE {Math.floor(pomo.completedPomodoros / 4) + 1} · ROUND {(pomo.completedPomodoros % 4) + 1}
              </span>
              <span className="text-[11px] font-mono text-zinc-700">SYS.POMO</span>
            </div>
          </div>

          {/* Center content — grows to fill, vertically centered */}
          <div className="flex flex-1 flex-col items-center justify-center gap-6">
            {/* Mode tabs */}
            <div className="flex gap-1 rounded-lg bg-zinc-900/80 border border-zinc-800 p-1">
              {modes.map((m) => (
                <button
                  key={m}
                  onClick={() => pomo.switchMode(m)}
                  className={cn(
                    'rounded-md px-5 py-2 text-xs font-mono uppercase tracking-wider transition-all',
                    pomo.mode === m
                      ? 'bg-zinc-800 text-white shadow-inner border border-zinc-700'
                      : 'text-zinc-500 hover:text-zinc-300'
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
                  className="absolute inset-0 rounded-full"
                  style={{ boxShadow: `0 0 60px ${config.glowColor}, 0 0 120px ${config.glowColor}` }}
                  animate={{ opacity: [0.3, 0.6, 0.3] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              )}

              <svg width="320" height="320" className="absolute -rotate-90">
                <circle cx="160" cy="160" r="155" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
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
                      stroke={isMajor ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.05)'}
                      strokeWidth={isMajor ? 1.5 : 0.5}
                    />
                  )
                })}
              </svg>

              <svg width="300" height="300" className="-rotate-90">
                <circle cx="150" cy="150" r={radius} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="6" />
                <circle
                  cx="150" cy="150" r={radius}
                  fill="none"
                  stroke={config.strokeColor}
                  strokeWidth="6"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  style={{
                    transition: 'stroke-dashoffset 0.5s ease',
                    filter: `drop-shadow(0 0 8px ${config.glowColor})`,
                  }}
                />
              </svg>

              <div className="absolute flex flex-col items-center">
                <span
                  className="text-7xl font-bold font-mono text-white tabular-nums"
                  style={{ textShadow: `0 0 20px ${config.glowColor}` }}
                >
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
                className="flex h-12 w-12 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900/50 text-zinc-400 transition-all hover:border-zinc-600 hover:text-white hover:bg-zinc-800/50"
              >
                <RotateCcw className="h-5 w-5" />
              </button>

              <button
                onClick={pomo.isRunning ? pomo.pause : pomo.start}
                className={cn(
                  'flex h-14 items-center gap-3 rounded-lg border px-10 font-mono text-sm uppercase tracking-wider transition-all',
                  pomo.isRunning
                    ? 'border-zinc-700 bg-zinc-800/50 text-zinc-300 hover:border-zinc-500'
                    : 'border-red-800 bg-red-950/50 text-red-400 hover:bg-red-900/50 hover:border-red-600 hover:text-red-300',
                )}
                style={!pomo.isRunning ? { boxShadow: '0 0 20px rgba(239,68,68,0.15)' } : undefined}
              >
                {pomo.isRunning ? <><Pause className="h-5 w-5" /> Pause</> : <><Play className="h-5 w-5" /> Engage</>}
              </button>

              <button
                onClick={pomo.skip}
                className="flex h-12 w-12 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900/50 text-zinc-400 transition-all hover:border-zinc-600 hover:text-white hover:bg-zinc-800/50"
              >
                <SkipForward className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Bottom bar — pinned */}
          <div className="flex items-center justify-between border-t border-zinc-800/50 pt-4 shrink-0">
            <div className="flex items-center gap-3">
              {[1, 2, 3, 4].map((i) => (
                <motion.div
                  key={i}
                  className={cn(
                    'h-3 w-3 transition-colors',
                    i <= pomo.completedPomodoros % 4
                      ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]'
                      : 'bg-zinc-800 border border-zinc-700'
                  )}
                  style={{ clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)' }}
                />
              ))}
              <span className="text-xs font-mono text-zinc-500">{pomo.completedPomodoros} SESSIONS</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-600">Target:</span>
              <select
                value={pomo.projectId ?? ''}
                onChange={(e) => pomo.setProjectId(e.target.value || null)}
                className="rounded border border-zinc-800 bg-zinc-900/50 px-2 py-1 text-xs font-mono text-zinc-300 focus:border-red-800 focus:outline-none"
              >
                <option value="">NONE</option>
                {projects?.map((p) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
