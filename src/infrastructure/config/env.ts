import { z } from 'zod';

const SupabaseEnvSchema = z.object({
  url: z.url(),
  anonKey: z.string().min(20),
});

export type SupabaseEnv = z.infer<typeof SupabaseEnvSchema>;

export function getSupabaseEnv(): SupabaseEnv | null {
  const url = import.meta.env.PUBLIC_SUPABASE_URL;
  const anonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    return null;
  }

  const parsed = SupabaseEnvSchema.safeParse({ url, anonKey });
  return parsed.success ? parsed.data : null;
}

export function isSupabaseConfigured(): boolean {
  return getSupabaseEnv() !== null;
}
