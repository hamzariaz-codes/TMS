'use client'

import { useState, useEffect } from 'react'

export default function LiveClock() {
  const [time, setTime] = useState<string>('')

  useEffect(() => {
    // Initial time
    setTime(new Date().toLocaleTimeString())

    const interval = setInterval(() => {
      setTime(new Date().toLocaleTimeString())
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  if (!time) return null

  return (
    <div className="text-right">
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Local Time</p>
      <p className="text-sm font-bold text-navy-900 tabular-nums">{time}</p>
    </div>
  )
}
