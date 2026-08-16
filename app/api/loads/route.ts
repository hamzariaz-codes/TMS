import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'
import { isSupabaseConfigured } from '@/lib/supabase/config'
import { generateLoadNumber } from '@/lib/utils/loadNumber'
import { sendLoadEmail } from '@/lib/email/sendLoadEmail'
import { addMockLoad, getMockLoads } from '@/lib/store/mockLoads'
import { validateCreateLoadInput } from '@/lib/validation/load'
import { isAdminRequest } from '@/lib/auth/session'
import { Load } from '@/types'

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  try {
    let body: unknown
    try {
      body = await request.json()
    } catch {
      return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
    }

    const validated = validateCreateLoadInput(body)
    if (!validated.ok) {
      return NextResponse.json({ error: validated.error }, { status: 400 })
    }
    const input = validated.value

    // 1. Generate load number
    const load_number = await generateLoadNumber()

    let load: Load | null = null

    // 2. Insert into database if configured
    if (isSupabaseConfigured()) {
      try {
        const supabase = createAdminClient()
        const { data, error } = await supabase
          .from('loads')
          .insert({
            ...input,
            load_number,
            status: 'Pending'
          })
          .select()
          .single()

        if (!error && data) {
          load = data as Load
        } else if (error) {
          console.warn('Database insertion error (using fallback store):', error.message || error)
        }
      } catch (dbError) {
        console.warn('Supabase client error during POST (using fallback store):', dbError)
      }
    }

    // Fallback if Supabase is unreachable or unconfigured
    if (!load) {
      load = {
        id: crypto.randomUUID(),
        ...input,
        load_number,
        status: 'Pending',
        created_at: new Date().toISOString()
      }
      addMockLoad(load)
    }

    // 3. Send confirmation email (async)
    sendLoadEmail(load).catch(err => console.error('Background email sending failed:', err))

    return NextResponse.json(load)
  } catch (error: any) {
    console.error('API Error:', error)
    return NextResponse.json({
      error: 'Internal Server Error',
      details: error?.message || 'An error occurred while creating the load.'
    }, { status: 500 })
  }
}

export async function GET(request: Request) {
  if (!(await isAdminRequest())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (isSupabaseConfigured()) {
    try {
      const supabase = createAdminClient()
      const { data: loads, error } = await supabase
        .from('loads')
        .select('*')
        .order('created_at', { ascending: false })

      if (!error && loads) {
        return NextResponse.json(loads)
      }
    } catch (err) {
      console.warn('Supabase fetch failed in GET /api/loads:', err)
    }
  }

  return NextResponse.json(getMockLoads())
}
