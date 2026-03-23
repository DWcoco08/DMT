import { useState } from 'react'
import { format, subDays } from 'date-fns'
import { Clock, CalendarDays, TrendingUp, Zap } from 'lucide-react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { cn, formatDuration, formatHours } from '@/lib/utils'
import { useAllTimeStats } from '../hooks/useAnalytics'
import { useSessionsByProject, useFilteredSessions } from '@/features/time-tracking/hooks/useTimeSessions'
import { useProjects } from '@/features/projects/hooks/useProjects'
import { ProductivityChart } from './ProductivityChart'

type Tab = 'overview' | 'timelog'

export function ReportsPage() {
  const [tab, setTab] = useState<Tab>('overview')

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Reports</h1>
        <p className="text-sm text-muted-foreground">Analytics and time tracking history</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 rounded-lg bg-muted p-1 w-fit">
        {([
          { key: 'overview' as Tab, label: 'Overview' },
          { key: 'timelog' as Tab, label: 'Time Log' },
        ]).map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={cn(
              'rounded-md px-5 py-2 text-sm font-medium transition-colors',
              tab === t.key
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'overview' ? <OverviewTab /> : <TimeLogTab />}
    </div>
  )
}

function OverviewTab() {
  const { data: stats, isLoading: statsLoading } = useAllTimeStats()
  const { data: sessionsByProject } = useSessionsByProject()
  const { data: projects } = useProjects()

  const projectMap = new Map(projects?.map((p) => [p.id, p]) ?? [])

  const projectChartData = sessionsByProject
    ?.map((s) => ({
      name: projectMap.get(s.project_id)?.name ?? 'Unknown',
      hours: Math.round((s.total_duration / 3600) * 10) / 10,
      fill: projectMap.get(s.project_id)?.color ?? '#888',
    }))
    .sort((a, b) => b.hours - a.hours)
    .slice(0, 8) ?? []

  const statCards = [
    { label: 'Total Time', value: statsLoading ? '—' : formatHours(stats?.totalSeconds ?? 0), icon: Clock, color: 'text-blue-500' },
    { label: 'Total Sessions', value: statsLoading ? '—' : `${stats?.totalSessions ?? 0}`, icon: CalendarDays, color: 'text-green-500' },
    { label: 'Avg / Day', value: statsLoading ? '—' : formatHours(stats?.avgSecondsPerDay ?? 0), icon: TrendingUp, color: 'text-purple-500' },
    { label: 'Longest Session', value: statsLoading ? '—' : formatDuration(stats?.longestSession ?? 0), icon: Zap, color: 'text-orange-500' },
  ]

  return (
    <div className="space-y-6">
      {/* Summary cards */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {statCards.map((card) => (
          <div key={card.label} className="rounded-2xl border border-border bg-card p-4 shadow-sm">
            <div className="flex items-center gap-2">
              <card.icon className={`h-4 w-4 ${card.color}`} />
              <span className="text-xs text-muted-foreground">{card.label}</span>
            </div>
            <p className="mt-1.5 text-xl font-bold text-foreground">{card.value}</p>
          </div>
        ))}
      </div>

      {/* Productivity chart */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-foreground">Productivity Trend</h2>
        <ProductivityChart />
      </div>

      {/* Project breakdown */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-foreground">Hours by Project</h2>
        {projectChartData.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">No data yet</p>
        ) : (
          <ResponsiveContainer width="100%" height={Math.max(200, projectChartData.length * 45)}>
            <BarChart data={projectChartData} layout="vertical" margin={{ left: 20, right: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 12, fill: 'var(--color-muted-foreground)' }} axisLine={false} tickLine={false} unit="h" />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 12, fill: 'var(--color-muted-foreground)' }} axisLine={false} tickLine={false} width={70} />
              <Tooltip contentStyle={{ backgroundColor: 'var(--color-card)', border: '1px solid var(--color-border)', borderRadius: '8px', fontSize: '12px' }} formatter={(value) => [`${value}h`, 'Hours']} />
              <Bar dataKey="hours" radius={[0, 4, 4, 0]} maxBarSize={28}>
                {projectChartData.map((entry, i) => (
                  <rect key={i} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  )
}

function TimeLogTab() {
  const [projectFilter, setProjectFilter] = useState<string>('')
  const [startDate, setStartDate] = useState(format(subDays(new Date(), 30), 'yyyy-MM-dd'))
  const [endDate, setEndDate] = useState(format(new Date(), 'yyyy-MM-dd'))

  const { data: sessions, isLoading } = useFilteredSessions(
    projectFilter || undefined,
    startDate ? new Date(startDate).toISOString() : undefined,
    endDate ? new Date(endDate + 'T23:59:59').toISOString() : undefined,
  )
  const { data: projects } = useProjects()
  const projectMap = new Map(projects?.map((p) => [p.id, p]) ?? [])

  const totalSeconds = sessions?.reduce((sum, s) => sum + s.duration, 0) ?? 0

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <div className="rounded-2xl border border-border bg-card p-4 shadow-sm text-center">
          <p className="text-2xl font-bold text-foreground">{formatHours(totalSeconds)}</p>
          <p className="text-xs text-muted-foreground mt-1">Total Hours</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-4 shadow-sm text-center">
          <p className="text-2xl font-bold text-foreground">{sessions?.length ?? 0}</p>
          <p className="text-xs text-muted-foreground mt-1">Sessions</p>
        </div>
        <div className="hidden sm:block rounded-2xl border border-border bg-card p-4 shadow-sm text-center">
          <p className="text-2xl font-bold text-foreground">
            {sessions?.length ? formatDuration(Math.round(totalSeconds / sessions.length)) : '—'}
          </p>
          <p className="text-xs text-muted-foreground mt-1">Avg Duration</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <select
          value={projectFilter}
          onChange={(e) => setProjectFilter(e.target.value)}
          className="rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground"
        >
          <option value="">All projects</option>
          {projects?.map((p) => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>
        <div className="flex items-center gap-2">
          <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground" />
          <span className="text-sm text-muted-foreground">to</span>
          <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground" />
        </div>
      </div>

      {/* Sessions table */}
      <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
        <div className="grid grid-cols-4 gap-4 border-b border-border bg-muted/30 px-4 py-3 text-xs font-medium text-muted-foreground">
          <span>Project</span>
          <span>Start</span>
          <span>End</span>
          <span className="text-right">Duration</span>
        </div>

        {isLoading ? (
          <div className="p-4 space-y-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-10 animate-pulse rounded-lg bg-muted" />
            ))}
          </div>
        ) : !sessions?.length ? (
          <div className="flex flex-col items-center gap-3 py-16 text-center">
            <Clock className="h-10 w-10 text-muted-foreground/40" />
            <p className="text-sm text-muted-foreground">No sessions found</p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {sessions.map((session) => {
              const project = session.project_id ? projectMap.get(session.project_id) : null
              return (
                <div key={session.id} className="grid grid-cols-4 gap-4 px-4 py-3 text-sm hover:bg-accent/20 transition-colors">
                  <div className="flex items-center gap-2">
                    {project && <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: project.color }} />}
                    <span className="truncate text-foreground">{project?.name ?? '—'}</span>
                  </div>
                  <span className="text-muted-foreground">{format(new Date(session.start_time), 'MMM d, HH:mm')}</span>
                  <span className="text-muted-foreground">{session.end_time ? format(new Date(session.end_time), 'HH:mm') : 'Running'}</span>
                  <span className="text-right font-mono text-foreground tabular-nums">{formatDuration(session.duration)}</span>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
