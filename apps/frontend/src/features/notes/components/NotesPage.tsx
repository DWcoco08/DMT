import { useState } from 'react'
import { format } from 'date-fns'
import { Plus, Trash2, StickyNote } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { useNotes, useCreateNote, useDeleteNote } from '../hooks/useNotes'
import { NoteEditor } from './NoteEditor'

export function NotesPage() {
  const { data: notes, isLoading } = useNotes()
  const createNote = useCreateNote()
  const deleteNote = useDeleteNote()
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const selectedNote = notes?.find((n) => n.id === selectedId)

  async function handleCreate() {
    try {
      const note = await createNote.mutateAsync()
      setSelectedId(note.id)
    } catch {
      toast.error('Failed to create note')
    }
  }

  async function handleDelete(id: string) {
    try {
      await deleteNote.mutateAsync(id)
      if (selectedId === id) setSelectedId(null)
      toast.success('Note deleted')
    } catch {
      toast.error('Failed to delete note')
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Notes</h1>
          <p className="text-sm text-muted-foreground">Developer journal and scratch pad</p>
        </div>
        <Button size="sm" onClick={handleCreate} disabled={createNote.isPending} className="gap-1.5">
          <Plus className="h-3.5 w-3.5" />
          New Note
        </Button>
      </div>

      {/* Two-column layout */}
      <div className="flex gap-4 min-h-[60vh]">
        {/* Note list */}
        <div className="w-full space-y-1.5 lg:w-72 shrink-0">
          {isLoading ? (
            [1, 2, 3].map((i) => <div key={i} className="h-16 animate-pulse rounded-lg bg-muted" />)
          ) : !notes?.length ? (
            <div className="flex flex-col items-center gap-3 rounded-2xl border border-border bg-card py-16 text-center shadow-sm">
              <StickyNote className="h-10 w-10 text-muted-foreground/40" />
              <p className="text-sm text-muted-foreground">No notes yet</p>
              <Button size="sm" variant="outline" onClick={handleCreate}>Create your first note</Button>
            </div>
          ) : (
            notes.map((note) => (
              <div
                key={note.id}
                className={cn(
                  'group flex items-start justify-between rounded-lg border p-3 cursor-pointer transition-colors',
                  selectedId === note.id
                    ? 'border-primary/40 bg-primary/5'
                    : 'border-border hover:bg-accent/30'
                )}
              >
                <button
                  onClick={() => setSelectedId(note.id)}
                  className="flex-1 text-left min-w-0"
                >
                  <p className="truncate text-sm font-medium text-foreground">
                    {note.title || 'Untitled'}
                  </p>
                  <p className="truncate text-xs text-muted-foreground mt-0.5">
                    {note.content.slice(0, 50) || 'Empty note'}
                  </p>
                  <p className="text-[10px] text-muted-foreground mt-1">
                    {format(new Date(note.created_at), 'MMM d, yyyy')}
                  </p>
                </button>
                <Button
                  variant="ghost"
                  size="icon-xs"
                  onClick={(e) => { e.stopPropagation(); handleDelete(note.id) }}
                  className="opacity-0 group-hover:opacity-100 shrink-0 mt-0.5"
                >
                  <Trash2 className="h-3 w-3 text-muted-foreground" />
                </Button>
              </div>
            ))
          )}
        </div>

        {/* Editor */}
        <div className="hidden lg:flex flex-1 rounded-2xl border border-border bg-card p-6 shadow-sm">
          {selectedNote ? (
            <NoteEditor key={selectedNote.id} note={selectedNote} />
          ) : (
            <div className="flex flex-1 items-center justify-center">
              <p className="text-sm text-muted-foreground">Select a note or create a new one</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
