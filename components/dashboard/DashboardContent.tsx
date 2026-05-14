'use client'

import { useState, useEffect, useMemo } from 'react'
import { createClient } from '@/lib/supabase/client'
import StatsBar from '@/components/dashboard/StatsBar'
import LoadsTable from '@/components/dashboard/LoadsTable'
import { Load, LoadStats } from '@/types'

export default function DashboardContent({ initialLoads }: { initialLoads: Load[] }) {
  const [loads, setLoads] = useState<Load[]>(initialLoads)
  const supabase = createClient()

  useEffect(() => {
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'loads',
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            const newLoad = payload.new as Load
            setLoads((prev) => [newLoad, ...prev])
          } else if (payload.eventType === 'UPDATE') {
            const updatedLoad = payload.new as Load
            setLoads((prev) => prev.map((l) => (l.id === updatedLoad.id ? updatedLoad : l)))
          } else if (payload.eventType === 'DELETE') {
            setLoads((prev) => prev.filter((l) => l.id !== payload.old.id))
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [supabase])

  const stats: LoadStats = useMemo(() => {
    return {
      total: loads.length,
      pending: loads.filter(l => l.status === 'Pending').length,
      pickedUp: loads.filter(l => l.status === 'Picked Up').length,
      inTransit: loads.filter(l => l.status === 'In Transit').length,
      delivered: loads.filter(l => l.status === 'Delivered').length,
    }
  }, [loads])

  return (
    <>
      <StatsBar stats={stats} />
      <section>
        <LoadsTable loads={loads} setLoads={setLoads} />
      </section>
    </>
  )
}
