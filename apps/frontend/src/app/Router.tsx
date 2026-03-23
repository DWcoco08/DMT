import { lazy, Suspense } from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'
import { AuthLayout } from './layouts/AuthLayout'
import { DashboardLayout } from './layouts/DashboardLayout'
import { ProtectedRoute } from '@/features/auth/components/ProtectedRoute'

const LoginForm = lazy(() =>
  import('@/features/auth/components/LoginForm').then((m) => ({ default: m.LoginForm }))
)
const SignupForm = lazy(() =>
  import('@/features/auth/components/SignupForm').then((m) => ({ default: m.SignupForm }))
)
const DashboardPage = lazy(() =>
  import('@/features/dashboard/components/DashboardPage').then((m) => ({ default: m.DashboardPage }))
)
const SettingsPage = lazy(() =>
  import('@/features/settings/components/SettingsPage').then((m) => ({ default: m.SettingsPage }))
)
const ForgotPasswordForm = lazy(() =>
  import('@/features/auth/components/ForgotPasswordForm').then((m) => ({ default: m.ForgotPasswordForm }))
)
const TasksPage = lazy(() =>
  import('@/features/tasks/components/TasksPage').then((m) => ({ default: m.TasksPage }))
)
const ProjectsPage = lazy(() =>
  import('@/features/projects/components/ProjectsPage').then((m) => ({ default: m.ProjectsPage }))
)
const DataPage = lazy(() =>
  import('@/features/settings/components/DataPage').then((m) => ({ default: m.DataPage }))
)
const ReportsPage = lazy(() =>
  import('@/features/analytics/components/ReportsPage').then((m) => ({ default: m.ReportsPage }))
)
const NotesPage = lazy(() =>
  import('@/features/notes/components/NotesPage').then((m) => ({ default: m.NotesPage }))
)
const PomodoroPage = lazy(() =>
  import('@/features/pomodoro/components/PomodoroPage').then((m) => ({ default: m.PomodoroPage }))
)

function PageFallback() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <Loader2 className="h-6 w-6 animate-spin text-primary" />
    </div>
  )
}

const pageTransition = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
  transition: { duration: 0.2, ease: 'easeInOut' as const },
}

function AnimatedPage({ children }: { children: React.ReactNode }) {
  return (
    <motion.div {...pageTransition}>
      {children}
    </motion.div>
  )
}

export function AppRouter() {
  const location = useLocation()

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Auth routes */}
        <Route element={<AuthLayout />}>
          <Route
            path="/login"
            element={
              <Suspense fallback={<PageFallback />}>
                <AnimatedPage><LoginForm /></AnimatedPage>
              </Suspense>
            }
          />
          <Route
            path="/forgot-password"
            element={
              <Suspense fallback={<PageFallback />}>
                <AnimatedPage><ForgotPasswordForm /></AnimatedPage>
              </Suspense>
            }
          />
          <Route
            path="/signup"
            element={
              <Suspense fallback={<PageFallback />}>
                <AnimatedPage><SignupForm /></AnimatedPage>
              </Suspense>
            }
          />
        </Route>

        {/* Protected routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            <Route
              path="/dashboard"
              element={
                <Suspense fallback={<PageFallback />}>
                  <AnimatedPage><DashboardPage /></AnimatedPage>
                </Suspense>
              }
            />
            <Route
              path="/projects"
              element={
                <Suspense fallback={<PageFallback />}>
                  <AnimatedPage><ProjectsPage /></AnimatedPage>
                </Suspense>
              }
            />
            <Route
              path="/tasks"
              element={
                <Suspense fallback={<PageFallback />}>
                  <AnimatedPage><TasksPage /></AnimatedPage>
                </Suspense>
              }
            />
            <Route
              path="/pomodoro"
              element={
                <Suspense fallback={<PageFallback />}>
                  <AnimatedPage><PomodoroPage /></AnimatedPage>
                </Suspense>
              }
            />
            <Route
              path="/reports"
              element={
                <Suspense fallback={<PageFallback />}>
                  <AnimatedPage><ReportsPage /></AnimatedPage>
                </Suspense>
              }
            />
            <Route
              path="/notes"
              element={
                <Suspense fallback={<PageFallback />}>
                  <AnimatedPage><NotesPage /></AnimatedPage>
                </Suspense>
              }
            />
            <Route
              path="/data"
              element={
                <Suspense fallback={<PageFallback />}>
                  <AnimatedPage><DataPage /></AnimatedPage>
                </Suspense>
              }
            />
            <Route
              path="/settings"
              element={
                <Suspense fallback={<PageFallback />}>
                  <AnimatedPage><SettingsPage /></AnimatedPage>
                </Suspense>
              }
            />
          </Route>
        </Route>

        {/* Redirect */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </AnimatePresence>
  )
}
