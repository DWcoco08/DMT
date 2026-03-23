import { useQuery } from '@tanstack/react-query'
import { analyticsService } from '../services/analyticsService'

export function useDailyHours(days = 7) {
  return useQuery({
    queryKey: ['analytics', 'daily', days],
    queryFn: () => analyticsService.getDailyHours(days),
    staleTime: 1000 * 60 * 5,
  })
}

export function useWeeklyHours(weeks = 4) {
  return useQuery({
    queryKey: ['analytics', 'weekly', weeks],
    queryFn: () => analyticsService.getWeeklyHours(weeks),
    staleTime: 1000 * 60 * 5,
  })
}

export function useProductivityStats() {
  return useQuery({
    queryKey: ['analytics', 'stats'],
    queryFn: analyticsService.getProductivityStats,
    staleTime: 1000 * 60,
  })
}
