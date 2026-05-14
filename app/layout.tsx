import type { Metadata, Viewport } from 'next'
import { DM_Sans } from 'next/font/google'
import './globals.css'

const dmSans = DM_Sans({ 
  subsets: ['latin'],
  variable: '--font-dm-sans',
  weight: ['400', '500', '600', '700', '800', '900']
})

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

export const metadata: Metadata = {
  title: {
    default: 'LoadDesk | Premium TMS',
    template: '%s | LoadDesk'
  },
  description: 'The modern Transportation Management System for seamless logistics, real-time tracking, and automated shipment management.',
  keywords: ['TMS', 'Logistics', 'Transportation Management System', 'Load Board', 'Shipment Tracking'],
  authors: [{ name: 'LoadDesk Team' }],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://loaddesk.tms',
    siteName: 'LoadDesk',
    title: 'LoadDesk | Modern Logistics Management',
    description: 'Streamlined logistics and shipment management for vendors and administrators.',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${dmSans.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  )
}
