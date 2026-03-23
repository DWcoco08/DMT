import { z } from 'zod/v4'

export const taskSchema = z.object({
  title: z.string().min(1, 'Task title is required').max(200, 'Title too long'),
  projectId: z.string().optional(),
})

export type TaskFormData = z.infer<typeof taskSchema>
