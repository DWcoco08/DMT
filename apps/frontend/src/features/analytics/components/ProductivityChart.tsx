import { useState } from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { cn } from '@/lib/utils'
import { useDailyHours, useWeeklyHours } from '../hooks/useAnalytics'

type View = 'daily' | 'weekly'

export function ProductivityChart() {
  const [view, setView] = useState<View>('daily')
  const { data: dailyData, isLoading: dailyLoading } = useDailyHours()
  const { data: weeklyData, isLoading: weeklyLoading } = useWeeklyHours()

  const isLoading = view === 'daily' ? dailyLoading : weeklyLoading
  const chartData = view === 'daily'
    ? dailyData?.map((d) => ({ name: d.date, hours: d.hours }))
    : weeklyData?.map((d) => ({ name: d.week, hours: d.hours }))

  return (
    <div className="space-y-2">
      {/* View toggle */}
      <div className="flex gap-1 rounded-lg bg-muted p-1 w-fit">
        {(['daily', 'weekly'] as const).map((v) => (
          <button
            key={v}
            onClick={() => setView(v)}
            className={cn(
              'rounded-md px-3 py-1 text-xs font-medium capitalize transition-colors',
              view === v
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            {v}
          </button>
        ))}
      </div>

      {/* Chart */}
      {isLoading ? (
        <div className="h-48 animate-pulse rounded-lg bg-muted" />
      ) : (
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={chartData ?? []}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis
              dataKey="name"
              tick={{ fontSize: 12, fill: 'var(--color-muted-foreground)' }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 12, fill: 'var(--color-muted-foreground)' }}
              axisLine={false}
              tickLine={false}
              unit="h"
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
            <Bar
              dataKey="hours"
              fill="var(--color-primary)"
              radius={[4, 4, 0, 0]}
              maxBarSize={40}
            />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}
