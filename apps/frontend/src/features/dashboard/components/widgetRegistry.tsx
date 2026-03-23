import type { ComponentType } from 'react'
import { TimerWidget } from '@/features/time-tracking/components/TimerWidget'
import { TaskList } from '@/features/tasks/components/TaskList'
import { ProjectsOverview } from './ProjectsOverview'
import { ProductivityChart } from '@/features/analytics/components/ProductivityChart'
import { ActivityFeed } from '@/features/activity/components/ActivityFeed'
import { GitHubCommitsChart } from '@/features/github/components/GitHubCommitsChart'
import { GitHubRecentCommits } from '@/features/github/components/GitHubRecentCommits'
import { SessionHistory } from '@/features/time-tracking/components/SessionHistory'

export const widgetRegistry: Record<string, ComponentType> = {
  'timer': TimerWidget,
  'tasks': TaskList,
  'projects': ProjectsOverview,
  'productivity': ProductivityChart,
  'activity': ActivityFeed,
  'github-commits': GitHubCommitsChart,
  'recent-commits': GitHubRecentCommits,
  'recent-sessions': SessionHistory,
}
