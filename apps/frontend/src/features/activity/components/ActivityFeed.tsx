import { formatDistanceToNow } from 'date-fns'
import { motion } from 'framer-motion'
import {
  CheckCircle2,
  Clock,
  FolderPlus,
  ListPlus,
  Activity as ActivityIcon,
} from 'lucide-react'
import type { ActivityType } from '@/types/database'
import { useActivities } from '../hooks/useActivities'

const activityConfig: Record<ActivityType, { icon: React.ReactNode; label: string }> = {
  task_created: { icon: <ListPlus className="h-4 w-4 text-blue-500" />, label: 'Created task' },
  task_completed: { icon: <CheckCircle2 className="h-4 w-4 text-green-500" />, label: 'Completed task' },
  timer_started: { icon: <Clock className="h-4 w-4 text-yellow-500" />, label: 'Started timer' },
  timer_stopped: { icon: <Clock className="h-4 w-4 text-orange-500" />, label: 'Stopped timer' },
  project_created: { icon: <FolderPlus className="h-4 w-4 text-purple-500" />, label: 'Created project' },
}

export function ActivityFeed() {
  const { data: activities, isLoading } = useActivities(10)

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-10 animate-pulse rounded-lg bg-muted" />
        ))}
      </div>
    )
  }

  if (!activities?.length) {
    return (
      <div className="flex flex-col items-center gap-2 py-8 text-center">
        <ActivityIcon className="h-8 w-8 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">No activity yet</p>
      </div>
    )
  }

  return (
    <div className="space-y-1">
      {activities.map((activity, i) => {
        const config = activityConfig[activity.type as ActivityType] ?? {
          icon: <ActivityIcon className="h-4 w-4 text-muted-foreground" />,
          label: activity.type,
        }
        const meta = activity.metadata as Record<string, string>
        const detail = meta.title || meta.name || ''

        return (
          <motion.div
            key={activity.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            className="flex items-start gap-3 rounded-lg p-2 text-sm"
          >
            <div className="mt-0.5 shrink-0">{config.icon}</div>
            <div className="flex-1 min-w-0">
              <p className="text-foreground">
                {config.label}
                {detail && (
                  <span className="font-medium"> "{detail}"</span>
                )}
              </p>
              <p className="text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(activity.created_at), { addSuffix: true })}
              </p>
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}
