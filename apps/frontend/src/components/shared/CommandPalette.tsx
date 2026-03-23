import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  Settings,
  Sun,
  Moon,
  Monitor,
  Timer,
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
            Go to Dashboard
          </CommandItem>
          <CommandItem onSelect={() => runAndClose(() => navigate('/settings'))}>
            <Settings className="mr-2 h-4 w-4" />
            Go to Settings
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
