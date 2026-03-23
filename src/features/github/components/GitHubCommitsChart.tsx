import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { Github } from 'lucide-react'
import { useGitHubStore, useGitHubCommitsPerDay } from '../hooks/useGitHub'

export function GitHubCommitsChart() {
  const { token, username } = useGitHubStore()
  const { data, isLoading } = useGitHubCommitsPerDay(7)

  if (!token || !username) {
    return (
      <div className="flex flex-col items-center gap-2 py-8 text-center">
        <Github className="h-6 w-6 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">
          Connect GitHub in Settings to see your commits
        </p>
      </div>
    )
  }

  if (isLoading) {
    return <div className="h-48 animate-pulse rounded-lg bg-muted" />
  }

  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={data ?? []}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
        <XAxis
          dataKey="date"
          tick={{ fontSize: 12, fill: 'var(--color-muted-foreground)' }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fontSize: 12, fill: 'var(--color-muted-foreground)' }}
          axisLine={false}
          tickLine={false}
          allowDecimals={false}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: 'var(--color-card)',
            border: '1px solid var(--color-border)',
            borderRadius: '8px',
            fontSize: '12px',
          }}
          formatter={(value) => [`${value}`, 'Commits']}
        />
        <Bar
          dataKey="count"
          fill="var(--color-chart-2)"
          radius={[4, 4, 0, 0]}
          maxBarSize={40}
        />
      </BarChart>
    </ResponsiveContainer>
  )
}
