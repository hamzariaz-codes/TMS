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
    setLoads(initialLoads)
  }, [initialLoads])

  useEffect(() => {
    let isMounted = true

    // Fetch latest loads on mount to ensure client has latest data
    fetch('/api/loads')
      .then((res) => {
        if (!res.ok) throw new Error(`Failed to load shipments (${res.status})`)
        return res.json()
      })
      .then((data) => {
        if (isMounted && Array.isArray(data)) {
          setLoads(data)
        }
      })
      .catch((err) => console.warn('Failed to refresh loads:', err))

    let channel: any = null
    try {
      channel = supabase
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
              // The mount fetch and this event can both deliver the same row;
              // without the guard it shows up twice and duplicates the React key.
              setLoads((prev) =>
                prev.some((l) => l.id === newLoad.id) ? prev : [newLoad, ...prev]
              )
            } else if (payload.eventType === 'UPDATE') {
              const updatedLoad = payload.new as Load
              setLoads((prev) => prev.map((l) => (l.id === updatedLoad.id ? updatedLoad : l)))
            } else if (payload.eventType === 'DELETE') {
              const deletedId = (payload.old as Partial<Load> | null)?.id
              if (!deletedId) return
              setLoads((prev) => prev.filter((l) => l.id !== deletedId))
            }
          }
        )
        .subscribe()
    } catch (e) {
      console.warn('Realtime subscription not available:', e)
    }

    return () => {
      isMounted = false
      if (channel) {
        try {
          supabase.removeChannel(channel)
        } catch (e) {}
      }
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
