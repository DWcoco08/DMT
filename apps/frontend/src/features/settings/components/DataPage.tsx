import { useState } from 'react'
import { AlertTriangle } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { supabase } from '@/lib/supabase'
import { DataExport } from './DataExport'

export function DataPage() {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)

  async function handleDeleteAll() {
    if (deleteConfirm !== 'DELETE') return
    setIsDeleting(true)
    try {
      await supabase.from('activities').delete().neq('id', '')
      await supabase.from('time_sessions').delete().neq('id', '')
      await supabase.from('tasks').delete().neq('id', '')
      await supabase.from('projects').delete().neq('id', '')
      toast.success('All data deleted')
      setShowDeleteDialog(false)
      setDeleteConfirm('')
    } catch {
      toast.error('Failed to delete data')
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Data</h1>
        <p className="text-sm text-muted-foreground">Export or manage your data</p>
      </div>

      {/* Export */}
      <div className="max-w-lg rounded-2xl border border-border bg-card p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-foreground">Export Data</h2>
        <DataExport />
      </div>

      {/* Danger Zone */}
      <div className="max-w-lg rounded-2xl border border-destructive/30 bg-card p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <AlertTriangle className="h-5 w-5 text-destructive" />
          <h2 className="text-lg font-semibold text-destructive">Danger Zone</h2>
        </div>
        <p className="text-sm text-muted-foreground mb-4">
          Permanently delete all your projects, tasks, time sessions, and activities. This action cannot be undone.
        </p>
        <Button variant="destructive" onClick={() => setShowDeleteDialog(true)}>
          Delete All Data
        </Button>
      </div>

      {/* Delete confirmation */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete All Data?</DialogTitle>
            <DialogDescription>
              This will permanently delete all your projects, tasks, time sessions, and activities. Type <strong>DELETE</strong> to confirm.
            </DialogDescription>
          </DialogHeader>
          <input
            value={deleteConfirm}
            onChange={(e) => setDeleteConfirm(e.target.value)}
            placeholder="Type DELETE to confirm"
            className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground"
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => { setShowDeleteDialog(false); setDeleteConfirm('') }}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              disabled={deleteConfirm !== 'DELETE' || isDeleting}
              onClick={handleDeleteAll}
            >
              {isDeleting ? 'Deleting...' : 'Delete Everything'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
