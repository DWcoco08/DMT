import { z } from 'zod/v4'

export const projectSchema = z.object({
  name: z.string().min(1, 'Project name is required').max(50, 'Name too long'),
  color: z.string(),
})

export type ProjectFormData = z.infer<typeof projectSchema>
