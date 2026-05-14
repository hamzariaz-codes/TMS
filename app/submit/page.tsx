'use client'

import { useState } from 'react'
import ShipmentForm from '@/components/submit/ShipmentForm'
import SuccessScreen from '@/components/submit/SuccessScreen'
import { Load } from '@/types'

export default function SubmitPage() {
  const [submittedLoad, setSubmittedLoad] = useState<Load | null>(null)

  return (
    <main className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-black text-navy-950 tracking-tight">LoadDesk</h1>
          <p className="text-navy-600 font-medium">Transportation Management System</p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100">
          <div className="bg-navy-900 py-4 px-8">
            <h2 className="text-white font-bold tracking-wide">
              {submittedLoad ? 'Shipment Registered' : 'Public Shipment Entry'}
            </h2>
          </div>
          
          <div className="p-8 md:p-12">
            {!submittedLoad ? (
              <div className="animate-slide-up">
                <div className="mb-8">
                  <h3 className="text-2xl font-bold text-navy-900">Create New Load</h3>
                  <p className="text-slate-500 text-sm">Fill in the shipment details below to generate a load number instantly.</p>
                </div>
                <ShipmentForm onSuccess={(load) => setSubmittedLoad(load)} />
              </div>
            ) : (
              <SuccessScreen 
                load={submittedLoad} 
                onReset={() => setSubmittedLoad(null)} 
              />
            )}
          </div>
        </div>

        <div className="mt-8 text-center text-slate-400 text-xs font-medium">
          &copy; {new Date().getFullYear()} LoadDesk Logistics. All rights reserved.
        </div>
      </div>
    </main>
  )
}
