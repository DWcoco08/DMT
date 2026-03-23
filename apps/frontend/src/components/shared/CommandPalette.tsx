import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  Settings,
  Sun,
  Moon,
  Monitor,
  Timer,
  CheckSquare,
  FolderOpen,
  Clock,
  BarChart3,
  StickyNote,
  Database,
  Cpu,
} from 'lucide-react'
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { useThemeStore } from '@/stores/themeStore'

export function CommandPalette() {
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()
  const setTheme = useThemeStore((s) => s.setTheme)

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setOpen((o) => !o)
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  function runAndClose(fn: () => void) {
    fn()
    setOpen(false)
  }

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>

        <CommandGroup heading="Navigation">
          <CommandItem onSelect={() => runAndClose(() => navigate('/dashboard'))}>
            <LayoutDashboard className="mr-2 h-4 w-4" />
            Dashboard
          </CommandItem>
          <CommandItem onSelect={() => runAndClose(() => navigate('/tasks'))}>
            <CheckSquare className="mr-2 h-4 w-4" />
            Tasks
          </CommandItem>
          <CommandItem onSelect={() => runAndClose(() => navigate('/projects'))}>
            <FolderOpen className="mr-2 h-4 w-4" />
            Projects
          </CommandItem>
          <CommandItem onSelect={() => runAndClose(() => navigate('/time-log'))}>
            <Clock className="mr-2 h-4 w-4" />
            Time Log
          </CommandItem>
          <CommandItem onSelect={() => runAndClose(() => navigate('/pomodoro'))}>
            <Cpu className="mr-2 h-4 w-4" />
            Pomodoro
          </CommandItem>
          <CommandItem onSelect={() => runAndClose(() => navigate('/reports'))}>
            <BarChart3 className="mr-2 h-4 w-4" />
            Reports
          </CommandItem>
          <CommandItem onSelect={() => runAndClose(() => navigate('/notes'))}>
            <StickyNote className="mr-2 h-4 w-4" />
            Notes
          </CommandItem>
          <CommandItem onSelect={() => runAndClose(() => navigate('/data'))}>
            <Database className="mr-2 h-4 w-4" />
            Data
          </CommandItem>
          <CommandItem onSelect={() => runAndClose(() => navigate('/settings'))}>
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </CommandItem>
        </CommandGroup>

        <CommandGroup heading="Actions">
          <CommandItem onSelect={() => runAndClose(() => document.getElementById('timer-start')?.click())}>
            <Timer className="mr-2 h-4 w-4" />
            Start/Stop Timer
          </CommandItem>
        </CommandGroup>

        <CommandGroup heading="Theme">
          <CommandItem onSelect={() => runAndClose(() => setTheme('light'))}>
            <Sun className="mr-2 h-4 w-4" />
            Light Mode
          </CommandItem>
          <CommandItem onSelect={() => runAndClose(() => setTheme('dark'))}>
            <Moon className="mr-2 h-4 w-4" />
            Dark Mode
          </CommandItem>
          <CommandItem onSelect={() => runAndClose(() => setTheme('system'))}>
            <Monitor className="mr-2 h-4 w-4" />
            System Theme
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  )
}
