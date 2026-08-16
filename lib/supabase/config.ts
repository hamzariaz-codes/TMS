export function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !anonKey) return false
  if (url.includes('alertagkkomelohhdoep') || url.includes('placeholder')) return false
  if (!url.startsWith('http://') && !url.startsWith('https://')) return false

  return true
}
