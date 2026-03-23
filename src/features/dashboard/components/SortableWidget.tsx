import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useDashboardStore, type WidgetConfig } from '@/stores/dashboardStore'

interface SortableWidgetProps {
  widget: WidgetConfig
  children: React.ReactNode
}

export function SortableWidget({ widget, children }: SortableWidgetProps) {
  const isEditMode = useDashboardStore((s) => s.isEditMode)
  const removeWidget = useDashboardStore((s) => s.removeWidget)

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: widget.id, disabled: !isEditMode })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  const colSpanClass =
    widget.colSpan === 3 ? 'lg:col-span-3' :
    widget.colSpan === 2 ? 'lg:col-span-2' : ''

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'rounded-2xl border bg-card p-4 shadow-sm transition-colors',
        colSpanClass,
        isEditMode ? 'border-dashed border-primary/40' : 'border-border',
        isDragging && 'z-50'
      )}
    >
      {/* Header */}
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {isEditMode && (
            <button
              {...attributes}
              {...listeners}
              className="cursor-grab touch-none rounded p-0.5 text-muted-foreground hover:text-foreground active:cursor-grabbing"
            >
              <GripVertical className="h-4 w-4" />
            </button>
          )}
          <div>
            <h3 className="text-sm font-semibold text-foreground">{widget.title}</h3>
            <p className="text-[11px] text-muted-foreground">{widget.description}</p>
          </div>
        </div>
        {isEditMode && (
          <button
            onClick={() => removeWidget(widget.id)}
            className="rounded p-1 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {/* Content */}
      {children}
    </div>
  )
}
