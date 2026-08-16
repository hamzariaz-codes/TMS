import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { isSupabaseConfigured } from '@/lib/supabase/config'
import { ADMIN_COOKIE } from '@/lib/auth/session'

export const dynamic = 'force-dynamic'

const COOKIE_OPTIONS = {
  path: '/',
  maxAge: 86400,
  sameSite: 'lax' as const,
  // The cookie is the session marker in fallback mode, so it must not be
  // readable or writable from client-side JavaScript.
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
}

export async function POST(request: Request) {
  try {
    let body: any
    try {
      body = await request.json()
    } catch {
      return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
    }

    const { email, password } = body ?? {}

    if (!email || !password || typeof email !== 'string' || typeof password !== 'string') {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 })
    }

    if (isSupabaseConfigured()) {
      try {
        // Use the cookie-backed server client (anon key) rather than the
        // service-role client: this is what persists the Supabase auth cookies,
        // without which middleware and the API routes never see a session.
        const supabase = createClient()
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password
        })

        if (error) {
          return NextResponse.json({ error: error.message || 'Invalid login credentials' }, { status: 401 })
        }

        if (!data?.session) {
          return NextResponse.json({ error: 'Invalid login credentials' }, { status: 401 })
        }

        const response = NextResponse.json({ success: true, user: data.user })
        response.cookies.set(ADMIN_COOKIE, 'true', COOKIE_OPTIONS)
        return response
      } catch (err: any) {
        console.error('Supabase auth error:', err)
        return NextResponse.json({ error: 'Authentication service unavailable' }, { status: 500 })
      }
    }

    // Fallback/demo mode: Supabase is not configured, so there is no credential
    // store to check against and any sign-in is accepted.
    console.warn('Supabase is not configured — accepting login without credential verification (demo mode).')
    const response = NextResponse.json({ success: true, message: 'Logged in successfully' })
    response.cookies.set(ADMIN_COOKIE, 'true', COOKIE_OPTIONS)

    return response
  } catch (error: any) {
    console.error('Login error:', error)
    return NextResponse.json({ error: 'Failed to process login request' }, { status: 500 })
  }
}
