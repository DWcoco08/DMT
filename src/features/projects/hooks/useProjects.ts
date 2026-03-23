import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { projectService } from '../services/projectService'
import { activityService } from '@/features/activity/services/activityService'

export function useProjects() {
  return useQuery({
    queryKey: ['projects'],
    queryFn: projectService.getProjects,
  })
}

export function useCreateProject() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ name, color }: { name: string; color?: string }) =>
      projectService.createProject(name, color),
    onSuccess: (project) => {
      queryClient.invalidateQueries({ queryKey: ['projects'] })
      activityService.logActivity('project_created', { name: project.name })
    },
  })
}

export function useUpdateProject() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, ...updates }: { id: string; name?: string; color?: string }) =>
      projectService.updateProject(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] })
    },
  })
}

export function useDeleteProject() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => projectService.deleteProject(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] })
    },
  })
}
