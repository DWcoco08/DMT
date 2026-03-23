import { z } from 'zod/v4'

const envSchema = z.object({
  VITE_SUPABASE_URL: z.url(),
  VITE_SUPABASE_ANON_KEY: z.string().min(1),
})

function getEnv() {
  const parsed = envSchema.safeParse({
    VITE_SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL,
    VITE_SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY,
  })

  if (!parsed.success) {
    console.error('Invalid environment variables:', parsed.error.format())
    throw new Error('Missing or invalid environment variables')
  }

  return parsed.data
}

export const env = getEnv()
