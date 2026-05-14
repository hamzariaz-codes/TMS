'use client'

import { useState } from 'react'
import Sidebar from './Sidebar'

export default function MobileNav() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <div className="lg:hidden flex items-center justify-between p-4 bg-navy-950 text-white sticky top-0 z-50">
        <h1 className="text-xl font-black tracking-tighter">LoadDesk</h1>
        <button 
          onClick={() => setIsOpen(true)}
          className="p-2 hover:bg-navy-900 rounded-lg transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
          </svg>
        </button>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-navy-950/50 backdrop-blur-sm z-50 lg:hidden"
          onClick={() => setIsOpen(false)}
        >
          <div 
            className="w-64 h-full animate-slide-in"
            onClick={(e) => e.stopPropagation()}
          >
            <Sidebar isMobile onClose={() => setIsOpen(false)} />
          </div>
        </div>
      )}
    </>
  )
}
