import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { motion } from 'framer-motion'
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
    isOver,
  } = useSortable({ id: widget.id, disabled: !isEditMode })

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
  }

  const colSpanClass =
    widget.colSpan === 3 ? 'lg:col-span-3' :
    widget.colSpan === 2 ? 'lg:col-span-2' : ''

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      layout={!isDragging}
      className={cn(
        'relative rounded-2xl border bg-card p-4 shadow-sm',
        colSpanClass,
        isDragging && 'z-50 shadow-xl ring-2 ring-primary/30 opacity-90 scale-[1.02]',
        isOver && !isDragging && 'ring-2 ring-primary/20',
        isEditMode && !isDragging && 'border-dashed border-primary/40 hover:border-primary/60',
        !isEditMode && 'border-border',
      )}
    >
      {/* Edit mode overlay shimmer */}
      {isEditMode && !isDragging && (
        <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/[0.03] to-transparent" />
      )}

      {/* Header */}
      <div className="relative mb-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {isEditMode && (
            <motion.button
              {...attributes}
              {...listeners}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              className="cursor-grab touch-none rounded-md p-1 text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary active:cursor-grabbing"
            >
              <GripVertical className="h-4 w-4" />
            </motion.button>
          )}
          <div>
            <h3 className="text-sm font-semibold text-foreground">{widget.title}</h3>
            <p className="text-[11px] text-muted-foreground">{widget.description}</p>
          </div>
        </div>
        {isEditMode && (
          <motion.button
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={() => removeWidget(widget.id)}
            className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
          >
            <X className="h-3.5 w-3.5" />
          </motion.button>
        )}
      </div>

      {/* Content */}
      <div className="relative">{children}</div>
    </motion.div>
  )
}
