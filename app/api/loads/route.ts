import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'
import { generateLoadNumber } from '@/lib/utils/loadNumber'
import { sendLoadEmail } from '@/lib/email/sendLoadEmail'
import { CreateLoadInput } from '@/types'

export async function POST(request: Request) {
  try {
    const body: CreateLoadInput = await request.json()
    const supabase = createAdminClient()

    // 1. Generate load number
    const load_number = await generateLoadNumber()

    // 2. Insert into database
    const { data: load, error } = await supabase
      .from('loads')
      .insert({
        ...body,
        load_number,
        status: 'Pending'
      })
      .select()
      .single()

    if (error) {
      console.error('Database insertion error:', JSON.stringify(error, null, 2))
      return NextResponse.json({ 
        error: 'Failed to create load',
        details: error.message 
      }, { status: 500 })
    }

    // 3. Send confirmation email
    // We don't await this to speed up the response, but ideally we should handle failures
    sendLoadEmail(load).catch(err => console.error('Background email sending failed:', err))

    return NextResponse.json(load)
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function GET(request: Request) {
  // Only authenticated admins can fetch loads via Server Components/Client, 
  // but let's add a basic check if needed. Dashboard usually uses Server Components.
  return NextResponse.json({ message: 'Use dashboard to view loads' }, { status: 403 })
}
