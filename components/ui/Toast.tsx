'use client'

import { useEffect, useState } from 'react'
import { ToastMessage } from '@/types'

export default function ToastContainer() {
  const [toasts, setToasts] = useState<ToastMessage[]>([])

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = []

    const handleToast = (event: CustomEvent<ToastMessage>) => {
      const newToast = event.detail
      setToasts((prev) => [...prev, newToast])

      timers.push(
        setTimeout(() => {
          setToasts((prev) => prev.filter((t) => t.id !== newToast.id))
        }, 5000)
      )
    }

    window.addEventListener('show-toast' as any, handleToast)
    return () => {
      window.removeEventListener('show-toast' as any, handleToast)
      timers.forEach(clearTimeout)
    }
  }, [])

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`px-4 py-3 rounded-lg shadow-lg text-white animate-slide-in flex items-center justify-between min-w-[250px] ${
            toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'
          }`}
        >
          <span>{toast.message}</span>
          <button 
            onClick={() => setToasts(prev => prev.filter(t => t.id !== toast.id))}
            className="ml-4 opacity-70 hover:opacity-100"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  )
}

let toastCounter = 0

export function showToast(message: string, type: 'success' | 'error' = 'success') {
  if (typeof window === 'undefined') return

  const event = new CustomEvent('show-toast', {
    detail: {
      // A counter rather than Math.random(), so two toasts can never collide on
      // the same React key.
      id: `toast-${Date.now()}-${toastCounter++}`,
      message,
      type
    }
  })
  window.dispatchEvent(event)
}
