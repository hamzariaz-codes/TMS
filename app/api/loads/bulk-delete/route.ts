import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'
import { isSupabaseConfigured } from '@/lib/supabase/config'
import { deleteMockLoads } from '@/lib/store/mockLoads'
import { isAdminRequest } from '@/lib/auth/session'

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  try {
    if (!(await isAdminRequest())) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    let body: any
    try {
      body = await request.json()
    } catch {
      return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
    }

    const { loadIds } = body ?? {}

    if (!Array.isArray(loadIds) || loadIds.length === 0) {
      return NextResponse.json({ error: 'Invalid loadIds' }, { status: 400 })
    }

    const ids = loadIds.filter((id): id is string => typeof id === 'string' && id.length > 0)
    if (ids.length !== loadIds.length) {
      return NextResponse.json({ error: 'loadIds must be an array of non-empty strings' }, { status: 400 })
    }

    if (isSupabaseConfigured()) {
      try {
        const supabase = createAdminClient()
        const { error } = await supabase
          .from('loads')
          .delete()
          .in('id', ids)

        if (error) {
          // Previously this fell through and still reported success, so the row
          // stayed in the database while disappearing from the dashboard.
          console.error('Supabase bulk delete failed:', error.message || error)
          return NextResponse.json({ error: 'Failed to delete shipments' }, { status: 500 })
        }

        deleteMockLoads(ids)
        return NextResponse.json({ success: true })
      } catch (err) {
        console.error('Supabase client error during bulk delete:', err)
        return NextResponse.json({ error: 'Failed to delete shipments' }, { status: 500 })
      }
    }

    deleteMockLoads(ids)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Bulk delete API error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
