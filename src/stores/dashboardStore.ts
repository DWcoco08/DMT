import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { arrayMove } from '@dnd-kit/sortable'

export interface WidgetConfig {
  id: string
  type: string
  title: string
  description: string
  colSpan: number
  visible: boolean
}

const DEFAULT_WIDGETS: WidgetConfig[] = [
  { id: 'timer', type: 'timer', title: 'Timer', description: 'Track time on your projects', colSpan: 1, visible: true },
  { id: 'tasks', type: 'tasks', title: 'Tasks', description: 'Your to-do list', colSpan: 1, visible: true },
  { id: 'projects', type: 'projects', title: 'Projects', description: 'Time per project', colSpan: 1, visible: true },
  { id: 'productivity', type: 'productivity', title: 'Productivity', description: 'Your coding hours', colSpan: 2, visible: true },
  { id: 'activity', type: 'activity', title: 'Activity', description: 'Recent actions', colSpan: 1, visible: true },
  { id: 'github-commits', type: 'github-commits', title: 'GitHub Commits', description: 'Commits per day', colSpan: 2, visible: true },
  { id: 'recent-commits', type: 'recent-commits', title: 'Recent Commits', description: 'Latest pushes', colSpan: 1, visible: true },
  { id: 'recent-sessions', type: 'recent-sessions', title: 'Recent Sessions', description: 'Your latest time entries', colSpan: 2, visible: true },
]

interface DashboardState {
  widgets: WidgetConfig[]
  isEditMode: boolean
  toggleEditMode: () => void
  reorderWidgets: (activeId: string, overId: string) => void
  removeWidget: (id: string) => void
  addWidget: (id: string) => void
  resetToDefault: () => void
}

export const useDashboardStore = create<DashboardState>()(
  persist(
    (set) => ({
      widgets: DEFAULT_WIDGETS,
      isEditMode: false,

      toggleEditMode: () => set((s) => ({ isEditMode: !s.isEditMode })),

      reorderWidgets: (activeId, overId) =>
        set((s) => {
          const oldIndex = s.widgets.findIndex((w) => w.id === activeId)
          const newIndex = s.widgets.findIndex((w) => w.id === overId)
          if (oldIndex === -1 || newIndex === -1) return s
          return { widgets: arrayMove(s.widgets, oldIndex, newIndex) }
        }),

      removeWidget: (id) =>
        set((s) => ({
          widgets: s.widgets.map((w) => (w.id === id ? { ...w, visible: false } : w)),
        })),

      addWidget: (id) =>
        set((s) => ({
          widgets: s.widgets.map((w) => (w.id === id ? { ...w, visible: true } : w)),
        })),

      resetToDefault: () => set({ widgets: DEFAULT_WIDGETS }),
    }),
    { name: 'dmt-dashboard' }
  )
)
