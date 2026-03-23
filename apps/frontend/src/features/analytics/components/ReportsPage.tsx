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
import { formatDuration } from '@/lib/utils'
import { useAllTimeStats } from '../hooks/useAnalytics'
import { useSessionsByProject } from '@/features/time-tracking/hooks/useTimeSessions'
import { useProjects } from '@/features/projects/hooks/useProjects'
import { ProductivityChart } from './ProductivityChart'

export function ReportsPage() {
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
    { label: 'Total Hours', value: statsLoading ? '—' : `${stats?.totalHours ?? 0}h`, icon: Clock, color: 'text-blue-500' },
    { label: 'Total Sessions', value: statsLoading ? '—' : `${stats?.totalSessions ?? 0}`, icon: CalendarDays, color: 'text-green-500' },
    { label: 'Avg Hours/Day', value: statsLoading ? '—' : `${stats?.avgHoursPerDay ?? 0}h`, icon: TrendingUp, color: 'text-purple-500' },
    { label: 'Longest Session', value: statsLoading ? '—' : formatDuration(stats?.longestSession ?? 0), icon: Zap, color: 'text-orange-500' },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Reports</h1>
        <p className="text-sm text-muted-foreground">Detailed productivity analytics</p>
      </div>

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
            <BarChart data={projectChartData} layout="vertical" margin={{ left: 80 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" horizontal={false} />
              <XAxis
                type="number"
                tick={{ fontSize: 12, fill: 'var(--color-muted-foreground)' }}
                axisLine={false}
                tickLine={false}
                unit="h"
              />
              <YAxis
                type="category"
                dataKey="name"
                tick={{ fontSize: 12, fill: 'var(--color-muted-foreground)' }}
                axisLine={false}
                tickLine={false}
                width={75}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--color-card)',
                  border: '1px solid var(--color-border)',
                  borderRadius: '8px',
                  fontSize: '12px',
                }}
                formatter={(value) => [`${value}h`, 'Hours']}
              />
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
