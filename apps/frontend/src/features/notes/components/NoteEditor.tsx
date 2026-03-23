import { useState, useEffect } from 'react'
import type { Note } from '@/types/database'
import { useUpdateNote } from '../hooks/useNotes'
import { useDebounce } from '@/hooks/useDebounce'

interface NoteEditorProps {
  note: Note
}

export function NoteEditor({ note }: NoteEditorProps) {
  const [title, setTitle] = useState(note.title)
  const [content, setContent] = useState(note.content)
  const updateNote = useUpdateNote()

  const debouncedTitle = useDebounce(title, 800)
  const debouncedContent = useDebounce(content, 800)

  // Reset on note change
  useEffect(() => {
    setTitle(note.title)
    setContent(note.content)
  }, [note.id])

  // Auto-save
  useEffect(() => {
    if (debouncedTitle !== note.title) {
      updateNote.mutate({ id: note.id, title: debouncedTitle })
    }
  }, [debouncedTitle])

  useEffect(() => {
    if (debouncedContent !== note.content) {
      updateNote.mutate({ id: note.id, content: debouncedContent })
    }
  }, [debouncedContent])

  return (
    <div className="flex h-full flex-col gap-3">
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Note title..."
        className="bg-transparent text-xl font-bold text-foreground outline-none placeholder:text-muted-foreground/50"
      />
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Write your thoughts..."
        className="flex-1 resize-none bg-transparent text-sm text-foreground leading-relaxed outline-none placeholder:text-muted-foreground/50"
      />
      <p className="text-[10px] text-muted-foreground">
        {updateNote.isPending ? 'Saving...' : 'Auto-saved'}
      </p>
    </div>
  )
}
