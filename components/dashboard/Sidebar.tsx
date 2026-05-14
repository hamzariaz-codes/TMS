'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

interface SidebarProps {
  isMobile?: boolean
  onClose?: () => void
}

export default function Sidebar({ isMobile, onClose }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const handleSignOut = async () => {
    try {
      const supabase = createClient()
      await supabase.auth.signOut()
      // Force a full page reload to the login page to ensure all state and cookies are cleared
      window.location.href = '/login'
    } catch (error) {
      console.error('Sign out error:', error)
      // Fallback redirect
      router.push('/login')
    }
  }

  const links = [
    { label: 'Dashboard', href: '/dashboard', icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
      </svg>
    )},
  ]

  return (
    <aside className={`bg-navy-950 text-slate-400 flex flex-col h-screen ${isMobile ? 'w-full' : 'w-64 fixed left-0 top-0 z-40 hidden lg:flex'}`}>
      <div className="p-8 border-b border-navy-900 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tighter">LoadDesk</h1>
          <p className="text-[10px] font-bold text-accent uppercase tracking-widest mt-1">Admin Dashboard</p>
        </div>
        {isMobile && (
          <button onClick={onClose} className="p-2 hover:bg-navy-900 rounded-lg text-white">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      <nav className="flex-1 p-4 space-y-2 mt-4">
        {links.map((link) => {
          const isActive = pathname === link.href
          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={onClose}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                isActive 
                  ? 'bg-accent text-white shadow-lg shadow-accent/20' 
                  : 'hover:bg-navy-900 hover:text-white'
              }`}
            >
              {link.icon}
              <span className="font-semibold">{link.label}</span>
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t border-navy-900">
        <button
          onClick={handleSignOut}
          className="flex items-center gap-3 px-4 py-3 w-full rounded-xl hover:bg-red-500/10 hover:text-red-500 transition-all font-semibold"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Sign Out
        </button>
      </div>
    </aside>
  )
}
