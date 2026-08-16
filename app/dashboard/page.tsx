import { createAdminClient } from '@/lib/supabase/server'
import { isSupabaseConfigured } from '@/lib/supabase/config'
import DashboardContent from '@/components/dashboard/DashboardContent'
import nextDynamic from 'next/dynamic'
import { getMockLoads } from '@/lib/store/mockLoads'
import { Load } from '@/types'

const LiveClock = nextDynamic(() => import('@/components/dashboard/LiveClock'), { ssr: false })

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  let loads: Load[] = []

  if (isSupabaseConfigured()) {
    try {
      // Same source as GET /api/loads. The anon client used to be used here, so
      // under RLS this query returned an empty list with no error and the page
      // rendered an empty table until the client-side fetch replaced it.
      const supabase = createAdminClient()
      const { data, error } = await supabase
        .from('loads')
        .select('*')
        .order('created_at', { ascending: false })

      if (!error && data) {
        loads = data as Load[]
      } else {
        loads = getMockLoads()
      }
    } catch (err) {
      console.warn('Dashboard fetch error, falling back to mock loads:', err)
      loads = getMockLoads()
    }
  } else {
    loads = getMockLoads()
  }

  return (
    <main className="p-4 md:p-8 max-w-[1600px] mx-auto space-y-8">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-black text-navy-950 tracking-tight">Shipment Overview</h1>
          <p className="text-slate-500 font-medium text-sm md:text-base">Manage and track all incoming loads from vendors.</p>
        </div>
        <LiveClock />
      </header>

      <DashboardContent initialLoads={loads} />
    </main>
  )
}

