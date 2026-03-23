import { useQuery } from '@tanstack/react-query'
import { timeSessionService } from '../services/timeSessionService'

export function useRecentSessions(limit = 10) {
  return useQuery({
    queryKey: ['time-sessions', 'recent', limit],
    queryFn: () => timeSessionService.getRecentSessions(limit),
  })
}

export function useSessionsForRange(startDate: string, endDate: string) {
  return useQuery({
    queryKey: ['time-sessions', 'range', startDate, endDate],
    queryFn: () => timeSessionService.getSessionsForRange(startDate, endDate),
    enabled: !!startDate && !!endDate,
  })
}

export function useFilteredSessions(projectId?: string, startDate?: string, endDate?: string) {
  return useQuery({
    queryKey: ['time-sessions', 'filtered', projectId, startDate, endDate],
    queryFn: () => timeSessionService.getFilteredSessions(projectId, startDate, endDate),
  })
}

export function useSessionsByProject() {
  return useQuery({
    queryKey: ['time-sessions', 'by-project'],
    queryFn: timeSessionService.getSessionsByProject,
  })
}
