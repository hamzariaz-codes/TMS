'use client'

import { useState } from 'react'
import { Load } from '@/types'

interface Props {
  load: Load
  onReset: () => void
}

export default function SuccessScreen({ load, onReset }: Props) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(load.load_number)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="text-center space-y-8 animate-fade-in">
      <div className="flex justify-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-green-600">
          <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>
      </div>

      <div className="space-y-2">
        <h2 className="text-3xl font-bold text-navy-900">Success!</h2>
        <p className="text-navy-600">Your load has been registered and a confirmation email has been sent.</p>
      </div>

      <div 
        className="bg-slate-50 border border-slate-200 rounded-2xl p-8 max-w-sm mx-auto shadow-sm relative group cursor-pointer active:scale-95 transition-all hover:bg-slate-100"
        onClick={handleCopy}
      >
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-1 group-hover:text-accent transition-colors">
          {copied ? 'Copied to clipboard' : 'Click to copy Load Number'}
        </p>
        <p className="text-4xl font-black text-accent tracking-tighter">{load.load_number}</p>
        
        <div className={`absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest transition-all duration-300 shadow-lg ${
          copied 
            ? 'bg-green-500 text-white opacity-100 translate-y-0' 
            : 'bg-navy-900 text-white opacity-0 -translate-y-2 pointer-events-none'
        }`}>
          COPIED!
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 text-left max-w-md mx-auto bg-white p-6 rounded-xl border border-slate-100">
        <div>
          <p className="text-[10px] font-bold text-slate-400 uppercase">Product</p>
          <p className="text-sm font-semibold text-navy-900">{load.product_name}</p>
        </div>
        <div>
          <p className="text-[10px] font-bold text-slate-400 uppercase">Quantity</p>
          <p className="text-sm font-semibold text-navy-900">{load.quantity}</p>
        </div>
        <div className="col-span-2">
          <p className="text-[10px] font-bold text-slate-400 uppercase">Pickup Schedule</p>
          <p className="text-sm font-semibold text-navy-900">{load.pickup_date} at {load.pickup_time}</p>
        </div>
      </div>

      <button
        onClick={onReset}
        className="text-accent font-semibold hover:underline"
      >
        Submit another shipment
      </button>
    </div>
  )
}
