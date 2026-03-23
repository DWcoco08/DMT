import { useState } from 'react'
import { AlertTriangle, HardDrive, Download, Shield } from 'lucide-react'
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
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Data</h1>
        <p className="text-sm text-muted-foreground">Export or manage your data</p>
      </div>

      {/* Info cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <div className="flex items-center gap-3 mb-1">
            <Download className="h-5 w-5 text-primary" />
            <h2 className="text-base font-semibold text-foreground">Export</h2>
          </div>
          <p className="text-xs text-muted-foreground">Download your data as CSV or JSON</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <div className="flex items-center gap-3 mb-1">
            <Shield className="h-5 w-5 text-green-500" />
            <h2 className="text-base font-semibold text-foreground">Privacy</h2>
          </div>
          <p className="text-xs text-muted-foreground">Your data is encrypted and only accessible by you</p>
        </div>
      </div>

      {/* Export section */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-5">
          <HardDrive className="h-5 w-5 text-muted-foreground" />
          <h2 className="text-lg font-semibold text-foreground">Export Data</h2>
        </div>
        <DataExport />
      </div>

      {/* Danger Zone */}
      <div className="rounded-2xl border border-destructive/30 bg-destructive/[0.03] p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-3">
          <AlertTriangle className="h-5 w-5 text-destructive" />
          <h2 className="text-lg font-semibold text-destructive">Danger Zone</h2>
        </div>
        <p className="text-sm text-muted-foreground mb-5">
          Permanently delete all your projects, tasks, time sessions, and activities.
          This action cannot be undone. We recommend exporting your data first.
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
