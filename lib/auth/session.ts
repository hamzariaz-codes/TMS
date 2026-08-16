import { cookies } from 'next/headers'

import { createClient } from '@/lib/supabase/server'
import { isSupabaseConfigured } from '@/lib/supabase/config'

export const ADMIN_COOKIE = 'loaddesk_mock_auth'

/**
 * Mirrors the check `middleware.ts` performs for /dashboard. Mutating API
 * routes call this directly: middleware only matches page routes, so without it
 * the load endpoints are reachable by anyone.
 */
export async function isAdminRequest(): Promise<boolean> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = createClient()
      // getUser() validates the token with the auth server; getSession() only
      // decodes whatever cookie the client sent.
      const { data, error } = await supabase.auth.getUser()
      if (!error && data?.user) return true
    } catch (e) {
      console.warn('Supabase auth check failed, falling back to cookie check:', e)
    }
  }

  return cookies().get(ADMIN_COOKIE)?.value === 'true'
}
