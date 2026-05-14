import { createAdminClient } from '../supabase/server'

export async function generateLoadNumber() {
  const supabase = createAdminClient()
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  const today = `${year}-${month}-${day}`
  const dateString = `${year}${month}${day}`

  // Calculate bounds for the local day in UTC to get accurate count
  const startOfDay = new Date(year, now.getMonth(), now.getDate(), 0, 0, 0, 0).toISOString()
  const endOfDay = new Date(year, now.getMonth(), now.getDate(), 23, 59, 59, 999).toISOString()

  const { count, error } = await supabase
    .from('loads')
    .select('*', { count: 'exact', head: true })
    .gte('created_at', startOfDay)
    .lte('created_at', endOfDay)

  if (error) {
    console.error('Error counting today\'s loads:', error)
    throw new Error('Failed to generate load number')
  }

  const sequence = (count || 0) + 1
  const paddedSequence = sequence.toString().padStart(4, '0')
  
  // Add a 2-character random suffix to guarantee uniqueness even in high-concurrency
  const suffix = Math.random().toString(36).substring(2, 4).toUpperCase()

  return `LD-${dateString}-${paddedSequence}-${suffix}`
}
