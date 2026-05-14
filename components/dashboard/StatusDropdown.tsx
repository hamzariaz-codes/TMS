'use client'

import { useState } from 'react'
import { LoadStatus } from '@/types'
import { showToast } from '../ui/Toast'

interface Props {
  loadId: string
  currentStatus: LoadStatus
  onUpdate: (newStatus: LoadStatus) => void
}

export default function StatusDropdown({ loadId, currentStatus, onUpdate }: Props) {
  const [loading, setLoading] = useState(false)
  const statuses: LoadStatus[] = ['Pending', 'Picked Up', 'In Transit', 'Delivered']

  const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value as LoadStatus
    setLoading(true)

    try {
      const response = await fetch(`/api/loads/${loadId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })

      if (!response.ok) throw new Error('Update failed')

      onUpdate(newStatus)
      showToast(`Status updated to ${newStatus}`, 'success')
    } catch (err) {
      showToast('Failed to update status', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative inline-block w-full min-w-[140px]">
      <select
        disabled={loading}
        value={currentStatus}
        onChange={handleChange}
        onClick={(e) => e.stopPropagation()}
        className="w-full bg-slate-50 border border-slate-200 text-navy-900 text-sm font-semibold rounded-lg focus:ring-accent focus:border-accent block p-2 transition-all outline-none appearance-none disabled:opacity-50"
      >
        {statuses.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>
      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-slate-400">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  )
}
