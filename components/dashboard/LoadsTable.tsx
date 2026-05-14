'use client'

import { useState, useMemo } from 'react'
import { Load, LoadStatus } from '@/types'
import StatusBadge from './StatusBadge'
import StatusDropdown from './StatusDropdown'
import LoadDetailPanel from './LoadDetailPanel'
import { showToast } from '../ui/Toast'

interface Props {
  loads: Load[]
  setLoads: React.Dispatch<React.SetStateAction<Load[]>>
}

export default function LoadsTable({ loads, setLoads }: Props) {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedLoad, setSelectedLoad] = useState<Load | null>(null)
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [isDeleting, setIsDeleting] = useState(false)

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return
    if (!window.confirm(`Are you sure you want to delete ${selectedIds.length} shipment(s)? This cannot be undone.`)) return

    setIsDeleting(true)
    try {
      const res = await fetch('/api/loads/bulk-delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ loadIds: selectedIds })
      })
      if (!res.ok) throw new Error('Failed to delete')
      showToast(`Successfully deleted ${selectedIds.length} shipment(s)`)
      setSelectedIds([])
    } catch (error) {
      console.error(error)
      showToast('Failed to delete shipments. Please try again.', 'error')
    } finally {
      setIsDeleting(false)
    }
  }

  const filteredLoads = useMemo(() => {
    return loads.filter((load) => {
      const searchMatch = 
        load.load_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
        load.submitter_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        load.product_name.toLowerCase().includes(searchTerm.toLowerCase())
      
      const loadDate = new Date(load.pickup_date)
      const start = startDate ? new Date(startDate) : null
      const end = endDate ? new Date(endDate) : null

      const dateMatch = (!start || loadDate >= start) && (!end || loadDate <= end)

      return searchMatch && dateMatch
    }).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
  }, [loads, searchTerm, startDate, endDate])

  const handleStatusUpdate = (loadId: string, newStatus: LoadStatus) => {
    setLoads(prev => prev.map(l => l.id === loadId ? { ...l, status: newStatus } : l))
    if (selectedLoad?.id === loadId) {
      setSelectedLoad(prev => prev ? { ...prev, status: newStatus } : null)
    }
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder="Search by load #, submitter, or product..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-accent focus:border-transparent outline-none transition-all text-sm font-medium"
          />
          <svg className="w-5 h-5 absolute left-3 top-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <div className="flex flex-col md:flex-row gap-2 items-center">
          <label className="text-xs font-bold text-slate-400 uppercase">From</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full md:w-40 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent outline-none transition-all text-sm font-medium"
          />
          <label className="text-xs font-bold text-slate-400 uppercase">To</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full md:w-40 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent outline-none transition-all text-sm font-medium"
          />
        </div>
        {selectedIds.length > 0 && (
          <button
            onClick={handleBulkDelete}
            disabled={isDeleting}
            className="px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 rounded-lg text-sm font-bold transition-colors flex items-center justify-center gap-2 whitespace-nowrap"
          >
            {isDeleting ? 'Deleting...' : `Delete Selected (${selectedIds.length})`}
          </button>
        )}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="px-6 py-4 w-12 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  <input
                    type="checkbox"
                    className="rounded border-slate-300 text-accent focus:ring-accent cursor-pointer"
                    checked={filteredLoads.length > 0 && selectedIds.length === filteredLoads.length}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedIds(filteredLoads.map(l => l.id))
                      } else {
                        setSelectedIds([])
                      }
                    }}
                  />
                </th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Load Number</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Submitter</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Product</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Pickup Date</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Created At</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredLoads.length > 0 ? filteredLoads.map((load) => (
                <tr 
                  key={load.id} 
                  className="group hover:bg-slate-50/50 transition-colors cursor-pointer"
                  onClick={() => setSelectedLoad(load)}
                >
                  <td className="px-6 py-5" onClick={(e) => e.stopPropagation()}>
                    <input
                      type="checkbox"
                      className="rounded border-slate-300 text-accent focus:ring-accent cursor-pointer"
                      checked={selectedIds.includes(load.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedIds(prev => [...prev, load.id])
                        } else {
                          setSelectedIds(prev => prev.filter(id => id !== load.id))
                        }
                      }}
                    />
                  </td>
                  <td className="px-6 py-5">
                    <span className="font-bold text-navy-950 group-hover:text-accent transition-colors">{load.load_number}</span>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex flex-col">
                      <span className="font-semibold text-navy-900">{load.submitter_name}</span>
                      <span className="text-xs text-slate-400">{load.submitter_email}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-sm text-navy-700 font-medium">{load.product_name}</td>
                  <td className="px-6 py-5 text-sm text-navy-700 font-medium">{load.pickup_date}</td>
                  <td className="px-6 py-5">
                    <StatusBadge status={load.status} />
                  </td>
                  <td className="px-6 py-5 text-sm text-slate-500 font-medium">
                    {new Date(load.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-5 text-right" onClick={(e) => e.stopPropagation()}>
                    <StatusDropdown 
                      loadId={load.id} 
                      currentStatus={load.status} 
                      onUpdate={(newStatus) => handleStatusUpdate(load.id, newStatus)} 
                    />
                  </td>
                </tr>
                )) : (
                <tr>
                  <td colSpan={8} className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center justify-center max-w-sm mx-auto">
                      <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                        <svg className="w-10 h-10 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-bold text-navy-900 mb-1">No Shipments Found</h3>
                      <p className="text-sm text-slate-500 font-medium">
                        {searchTerm || startDate || endDate
                          ? "We couldn't find any loads matching your current filters. Try adjusting your search."
                          : "There are currently no shipments in the system. New submissions will appear here in real-time."}
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <LoadDetailPanel 
        load={selectedLoad} 
        onClose={() => setSelectedLoad(null)} 
      />
    </div>
  )
}
