import { useState } from 'react'
import {
  DndContext,
  closestCenter,
  DragOverlay,
  useSensor,
  useSensors,
  PointerSensor,
  TouchSensor,
  type DragStartEvent,
  type DragEndEvent,
} from '@dnd-kit/core'
import { SortableContext, rectSortingStrategy } from '@dnd-kit/sortable'
import { Pencil, Check, Plus, RotateCcw } from 'lucide-react'
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
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 5 } })
  )

  const visibleWidgets = widgets.filter((w) => w.visible)
  const activeWidget = activeId ? widgets.find((w) => w.id === activeId) : null

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
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Dashboard</h1>
          <p className="text-sm text-muted-foreground">Track your productivity and stay focused</p>
        </div>
        <div className="flex items-center gap-2">
          {isEditMode && (
            <>
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
            </>
          )}
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
                <Pencil className="h-3.5 w-3.5" />
                Edit
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

        <DragOverlay>
          {activeWidget && (
            <div className="rounded-2xl border border-primary/30 bg-card p-4 shadow-lg opacity-90">
              <h3 className="text-sm font-semibold text-foreground">{activeWidget.title}</h3>
              <p className="text-[11px] text-muted-foreground">{activeWidget.description}</p>
            </div>
          )}
        </DragOverlay>
      </DndContext>

      {/* Widget picker dialog */}
      <WidgetPicker open={showPicker} onClose={() => setShowPicker(false)} />
    </div>
  )
}
