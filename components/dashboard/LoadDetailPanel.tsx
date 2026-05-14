'use client'

import { Load } from '@/types'
import StatusBadge from './StatusBadge'

interface Props {
  load: Load | null
  onClose: () => void
}

export default function LoadDetailPanel({ load, onClose }: Props) {
  if (!load) return null

  return (
    <div 
      className="fixed inset-0 z-50 flex justify-end bg-navy-950/20 backdrop-blur-sm transition-opacity animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-xl bg-white h-screen shadow-2xl animate-slide-in overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-8 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10">
          <div>
            <h2 className="text-2xl font-black text-navy-950 tracking-tight">{load.load_number}</h2>
            <div className="mt-1">
              <StatusBadge status={load.status} />
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-8 space-y-10">
          {/* Submitter info */}
          <section className="space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest border-b pb-2">Submitter Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-slate-500 mb-1">Full Name</p>
                <p className="font-bold text-navy-900">{load.submitter_name}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-1">Email Address</p>
                <p className="font-bold text-navy-900">{load.submitter_email}</p>
              </div>
            </div>
          </section>

          {/* Route info */}
          <section className="space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest border-b pb-2">Shipment Route</h3>
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-2.5 h-2.5 rounded-full bg-accent mt-1.5" />
                  <div className="w-0.5 flex-1 bg-slate-200 my-1" />
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500 mb-1.5" />
                </div>
                <div className="space-y-8 flex-1">
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Pickup Address</p>
                    <p className="font-bold text-navy-900 leading-relaxed whitespace-pre-wrap">{load.pickup_address}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Delivery Address</p>
                    <p className="font-bold text-navy-900 leading-relaxed whitespace-pre-wrap">{load.delivery_address}</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Cargo info */}
          <section className="space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest border-b pb-2">Cargo Details</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-3">
                <p className="text-xs text-slate-500 mb-1">Product</p>
                <p className="font-bold text-navy-900">{load.product_name}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-1">Quantity</p>
                <p className="font-bold text-navy-900">{load.quantity}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-1">Weight</p>
                <p className="font-bold text-navy-900">{load.weight} {load.weight_unit}</p>
              </div>
            </div>
          </section>

          {/* Schedule info */}
          <section className="space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest border-b pb-2">Schedule</h3>
            <div>
              <p className="text-xs text-slate-500 mb-1">Scheduled Pickup</p>
              <p className="font-bold text-navy-900">{load.pickup_date} at {load.pickup_time}</p>
            </div>
          </section>

          {/* Special Instructions */}
          {load.notes && (
            <section className="space-y-4">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest border-b pb-2">Special Instructions</h3>
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                <p className="text-sm text-navy-800 leading-relaxed whitespace-pre-wrap">{load.notes}</p>
              </div>
            </section>
          )}

          <section className="pt-8 border-t border-slate-100">
             <p className="text-[10px] text-slate-400">Record Created: {new Date(load.created_at).toLocaleString()}</p>
             <p className="text-[10px] text-slate-400 mt-1">System ID: {load.id}</p>
          </section>
        </div>
      </div>
    </div>
  )
}
