import { Plus } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useDashboardStore } from '@/stores/dashboardStore'

interface WidgetPickerProps {
  open: boolean
  onClose: () => void
}

export function WidgetPicker({ open, onClose }: WidgetPickerProps) {
  const widgets = useDashboardStore((s) => s.widgets)
  const addWidget = useDashboardStore((s) => s.addWidget)

  const hiddenWidgets = widgets.filter((w) => !w.visible)

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Widget</DialogTitle>
        </DialogHeader>

        {hiddenWidgets.length === 0 ? (
          <p className="py-6 text-center text-sm text-muted-foreground">
            All widgets are on your dashboard
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {hiddenWidgets.map((widget) => (
              <button
                key={widget.id}
                onClick={() => {
                  addWidget(widget.id)
                  if (hiddenWidgets.length === 1) onClose()
                }}
                className="flex flex-col items-start gap-1 rounded-xl border border-border p-4 text-left transition-colors hover:bg-accent/50"
              >
                <div className="flex w-full items-center justify-between">
                  <span className="text-sm font-medium text-foreground">{widget.title}</span>
                  <Plus className="h-4 w-4 text-primary" />
                </div>
                <span className="text-xs text-muted-foreground">{widget.description}</span>
              </button>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
