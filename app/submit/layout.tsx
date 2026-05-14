import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Submit Shipment',
  description: 'Public shipment entry form for vendors and partners.',
}

export default function SubmitLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
