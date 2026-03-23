import { motion } from 'framer-motion'
import { Clock, CheckCircle2, TrendingUp } from 'lucide-react'
import { useProductivityStats } from '@/features/analytics/hooks/useAnalytics'

export function StatCards() {
  const { data: stats, isLoading } = useProductivityStats()

  const cards = [
    {
      label: 'Hours Today',
      value: isLoading ? '—' : `${stats?.hoursToday ?? 0}h`,
      icon: <Clock className="h-4 w-4 text-blue-500" />,
    },
    {
      label: 'This Week',
      value: isLoading ? '—' : `${stats?.hoursThisWeek ?? 0}h`,
      icon: <TrendingUp className="h-4 w-4 text-green-500" />,
    },
    {
      label: 'Tasks Done Today',
      value: isLoading ? '—' : `${stats?.tasksCompletedToday ?? 0}`,
      icon: <CheckCircle2 className="h-4 w-4 text-purple-500" />,
    },
  ]

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {cards.map((card, i) => (
        <motion.div
          key={card.label}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          className="rounded-2xl border border-border bg-card p-4 shadow-sm"
        >
          <div className="flex items-center gap-2">
            {card.icon}
            <span className="text-xs text-muted-foreground">{card.label}</span>
          </div>
          <p className="mt-2 text-2xl font-bold text-foreground">{card.value}</p>
        </motion.div>
      ))}
    </div>
  )
}
