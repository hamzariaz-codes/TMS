import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'
import { isSupabaseConfigured } from '@/lib/supabase/config'
import { updateMockLoadStatus } from '@/lib/store/mockLoads'
import { isValidStatus, LOAD_STATUSES } from '@/lib/validation/load'
import { isAdminRequest } from '@/lib/auth/session'

export const dynamic = 'force-dynamic'

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    if (!id) {
      return NextResponse.json({ error: 'Load id is required' }, { status: 400 })
    }

    if (!(await isAdminRequest())) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    let body: any
    try {
      body = await request.json()
    } catch {
      return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
    }

    const { status } = body ?? {}
    if (!isValidStatus(status)) {
      return NextResponse.json(
        { error: `Status must be one of: ${LOAD_STATUSES.join(', ')}` },
        { status: 400 }
      )
    }

    // 1. Update the database when Supabase is configured
    if (isSupabaseConfigured()) {
      try {
        const adminSupabase = createAdminClient()
        const { data, error } = await adminSupabase
          .from('loads')
          .update({ status })
          .eq('id', id)
          .select()
          .single()

        if (!error && data) {
          return NextResponse.json(data)
        }
        if (error) {
          console.warn('Database update failed in PATCH, using fallback store:', error.message || error)
        }
      } catch (e) {
        console.warn('Supabase client error in PATCH, using fallback store:', e)
      }
    }

    // 2. Fallback store update
    const updated = updateMockLoadStatus(id, status)
    if (updated) {
      return NextResponse.json(updated)
    }

    return NextResponse.json({ error: 'Load not found' }, { status: 404 })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
