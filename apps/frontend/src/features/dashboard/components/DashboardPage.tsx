import { useState } from 'react'
import {
  DndContext,
  closestCenter,
  DragOverlay,
  useSensor,
  useSensors,
  PointerSensor,
  TouchSensor,
  KeyboardSensor,
  type DragStartEvent,
  type DragEndEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
} from '@dnd-kit/sortable'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, Plus, RotateCcw, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useDashboardStore } from '@/stores/dashboardStore'
import { widgetRegistry } from './widgetRegistry'
import { SortableWidget } from './SortableWidget'
import { WidgetPicker } from './WidgetPicker'
import { StatCards } from './StatCards'

export function DashboardPage() {
  const { widgets, isEditMode, toggleEditMode, reorderWidgets, resetToDefault } =
    useDashboardStore()

  const [showPicker, setShowPicker] = useState(false)
  const [activeId, setActiveId] = useState<string | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  const visibleWidgets = widgets.filter((w) => w.visible)
  const activeWidget = activeId ? widgets.find((w) => w.id === activeId) : null
  const ActiveComponent = activeWidget ? widgetRegistry[activeWidget.type] : null

  function handleDragStart(event: DragStartEvent) {
    setActiveId(event.active.id as string)
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    setActiveId(null)
    if (over && active.id !== over.id) {
      reorderWidgets(active.id as string, over.id as string)
    }
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Dashboard</h1>
          <p className="text-sm text-muted-foreground">Track your productivity and stay focused</p>
        </div>
        <div className="flex items-center gap-2">
          <AnimatePresence>
            {isEditMode && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="flex items-center gap-2"
              >
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setShowPicker(true)}
                  className="gap-1.5"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Add
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={resetToDefault}
                  className="gap-1.5"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  Reset
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
          <Button
            size="sm"
            variant={isEditMode ? 'default' : 'outline'}
            onClick={toggleEditMode}
            className="gap-1.5"
          >
            {isEditMode ? (
              <>
                <Check className="h-3.5 w-3.5" />
                Done
              </>
            ) : (
              <>
                <Sparkles className="h-3.5 w-3.5" />
                Customize
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Stat cards */}
      <StatCards />

      {/* Draggable widget grid */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={visibleWidgets.map((w) => w.id)}
          strategy={rectSortingStrategy}
        >
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
            {visibleWidgets.map((widget) => {
              const Component = widgetRegistry[widget.type]
              if (!Component) return null
              return (
                <SortableWidget key={widget.id} widget={widget}>
                  <Component />
                </SortableWidget>
              )
            })}
          </div>
        </SortableContext>

        <DragOverlay dropAnimation={{
          duration: 200,
          easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        }}>
          {activeWidget && ActiveComponent && (
            <div className="rounded-2xl border-2 border-primary/40 bg-card p-4 shadow-2xl opacity-95 rotate-[1deg]">
              <div className="mb-2">
                <h3 className="text-sm font-semibold text-foreground">{activeWidget.title}</h3>
                <p className="text-[11px] text-muted-foreground">{activeWidget.description}</p>
              </div>
              <div className="opacity-60 max-h-40 overflow-hidden">
                <ActiveComponent />
              </div>
            </div>
          )}
        </DragOverlay>
      </DndContext>

      {/* Widget picker dialog */}
      <WidgetPicker open={showPicker} onClose={() => setShowPicker(false)} />
    </div>
  )
}
