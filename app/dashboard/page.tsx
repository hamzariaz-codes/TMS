import { createClient } from '@/lib/supabase/server'
import DashboardContent from '@/components/dashboard/DashboardContent'
import LiveClock from '@/components/dashboard/LiveClock'
import { Load } from '@/types'

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  const supabase = createClient()

  const { data: loads, error } = await supabase
    .from('loads')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Fetch error:', error)
  }

  const typedLoads = (loads || []) as Load[]

  return (
    <main className="p-4 md:p-8 max-w-[1600px] mx-auto space-y-8">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-black text-navy-950 tracking-tight">Shipment Overview</h1>
          <p className="text-slate-500 font-medium text-sm md:text-base">Manage and track all incoming loads from vendors.</p>
        </div>
        <LiveClock />
      </header>

      <DashboardContent initialLoads={typedLoads} />
    </main>
  )
}
