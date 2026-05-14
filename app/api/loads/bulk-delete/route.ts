import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  try {
    const { loadIds } = await request.json()
    
    if (!loadIds || !Array.isArray(loadIds) || loadIds.length === 0) {
      return NextResponse.json({ error: 'Invalid loadIds' }, { status: 400 })
    }

    const supabase = createAdminClient()
    const { error } = await supabase
      .from('loads')
      .delete()
      .in('id', loadIds)

    if (error) {
      console.error('Bulk delete database error:', error)
      return NextResponse.json({ error: 'Failed to delete loads' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Bulk delete API error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
