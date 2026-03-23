import { motion } from 'framer-motion'
import { Plus, LayoutGrid } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
          <DialogDescription>Choose a widget to add to your dashboard</DialogDescription>
        </DialogHeader>

        {hiddenWidgets.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-8 text-center">
            <LayoutGrid className="h-10 w-10 text-muted-foreground/50" />
            <p className="text-sm text-muted-foreground">
              All widgets are on your dashboard
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {hiddenWidgets.map((widget, i) => (
              <motion.button
                key={widget.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => {
                  addWidget(widget.id)
                  if (hiddenWidgets.length === 1) onClose()
                }}
                className="group flex flex-col items-start gap-2 rounded-xl border border-border p-4 text-left transition-all hover:border-primary/40 hover:bg-primary/5 hover:shadow-sm"
              >
                <div className="flex w-full items-center justify-between">
                  <span className="text-sm font-medium text-foreground">{widget.title}</span>
                  <div className="rounded-full bg-primary/10 p-1 text-primary opacity-0 transition-opacity group-hover:opacity-100">
                    <Plus className="h-3 w-3" />
                  </div>
                </div>
                <span className="text-xs text-muted-foreground">{widget.description}</span>
              </motion.button>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
