import { useQuery } from '@tanstack/react-query'
import { activityService } from '../services/activityService'

export function useActivities(limit = 20) {
  return useQuery({
    queryKey: ['activities', limit],
    queryFn: () => activityService.getActivities(limit),
  })
}
