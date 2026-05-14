import { LoadStatus } from '@/types'

export default function StatusBadge({ status }: { status: LoadStatus }) {
  const styles: Record<LoadStatus, string> = {
    'Pending': 'bg-yellow-100 text-yellow-800 border-yellow-200',
    'Picked Up': 'bg-blue-100 text-blue-800 border-blue-200',
    'In Transit': 'bg-orange-100 text-orange-800 border-orange-200',
    'Delivered': 'bg-green-100 text-green-800 border-green-200',
  }

  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${styles[status]}`}>
      {status}
    </span>
  )
}
