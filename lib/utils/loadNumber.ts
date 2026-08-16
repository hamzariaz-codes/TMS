import { createAdminClient } from '../supabase/server'

export async function generateLoadNumber() {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  const dateString = `${year}${month}${day}`

  let sequence = Math.floor(Math.random() * 9000) + 1000

  try {
    const supabase = createAdminClient()
    const startOfDay = new Date(year, now.getMonth(), now.getDate(), 0, 0, 0, 0).toISOString()
    const endOfDay = new Date(year, now.getMonth(), now.getDate(), 23, 59, 59, 999).toISOString()

    const { count, error } = await supabase
      .from('loads')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', startOfDay)
      .lte('created_at', endOfDay)

    if (!error && typeof count === 'number') {
      sequence = count + 1
    }
  } catch (error) {
    console.warn('Supabase query failed for load number generation, using fallback sequence:', error)
  }

  const paddedSequence = sequence.toString().padStart(4, '0')
  const suffix = Math.random().toString(36).substring(2, 4).toUpperCase()

  return `LD-${dateString}-${paddedSequence}-${suffix}`
}

