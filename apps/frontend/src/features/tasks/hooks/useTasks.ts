import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { taskService, type TaskFilters } from '../services/taskService'
import { activityService } from '@/features/activity/services/activityService'

export function useTasks(filters?: TaskFilters) {
  return useQuery({
    queryKey: ['tasks', filters],
    queryFn: () => taskService.getTasks(filters),
  })
}

export function useCreateTask() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ title, projectId }: { title: string; projectId?: string }) =>
      taskService.createTask(title, projectId),
    onSuccess: (task) => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
      activityService.logActivity('task_created', { title: task.title })
    },
  })
}

export function useToggleTask() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, completed }: { id: string; completed: boolean }) =>
      taskService.toggleTask(id, completed),
    onSuccess: (task) => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
      if (task.completed) {
        activityService.logActivity('task_completed', { title: task.title })
      }
    },
  })
}

export function useDeleteTask() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => taskService.deleteTask(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
    },
  })
}
