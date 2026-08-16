import { NextResponse } from 'next/server'

import { createClient } from '@/lib/supabase/server'
import { isSupabaseConfigured } from '@/lib/supabase/config'
import { ADMIN_COOKIE } from '@/lib/auth/session'

export const dynamic = 'force-dynamic'

export async function POST() {
  if (isSupabaseConfigured()) {
    try {
      // Clear the Supabase session too, otherwise signing out only removes the
      // marker cookie and the Supabase session stays valid.
      await createClient().auth.signOut()
    } catch (e) {
      console.warn('Supabase sign-out failed:', e)
    }
  }

  const response = NextResponse.json({ success: true })
  response.cookies.set(ADMIN_COOKIE, '', {
    path: '/',
    expires: new Date(0)
  })
  return response
}
