import { BentoCard } from '@/components/shared/BentoCard'
import { StatCards } from './StatCards'
import { TimerWidget } from '@/features/time-tracking/components/TimerWidget'
import { SessionHistory } from '@/features/time-tracking/components/SessionHistory'
import { TaskList } from '@/features/tasks/components/TaskList'
import { ProjectsOverview } from './ProjectsOverview'
import { ProductivityChart } from '@/features/analytics/components/ProductivityChart'
import { ActivityFeed } from '@/features/activity/components/ActivityFeed'

export function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Dashboard</h1>
        <p className="text-sm text-muted-foreground">Track your productivity and stay focused</p>
      </div>

      {/* Stat cards */}
      <StatCards />

      {/* Bento grid */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Timer */}
        <BentoCard title="Timer" description="Track time on your projects">
          <TimerWidget />
        </BentoCard>

        {/* Tasks - spans 2 rows */}
        <BentoCard
          title="Tasks"
          description="Your to-do list"
          className="md:row-span-2"
        >
          <TaskList />
        </BentoCard>

        {/* Projects Overview */}
        <BentoCard title="Projects" description="Time per project">
          <ProjectsOverview />
        </BentoCard>

        {/* Analytics - spans 2 columns */}
        <BentoCard
          title="Productivity"
          description="Your coding hours"
          className="lg:col-span-2"
        >
          <ProductivityChart />
        </BentoCard>

        {/* Activity Feed */}
        <BentoCard title="Activity" description="Recent actions">
          <ActivityFeed />
        </BentoCard>

        {/* Recent Sessions */}
        <BentoCard
          title="Recent Sessions"
          description="Your latest time entries"
          className="lg:col-span-2"
        >
          <SessionHistory />
        </BentoCard>
      </div>
    </div>
  )
}
