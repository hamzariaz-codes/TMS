import { LoadStatus } from '@/types'

interface Props {
  status: LoadStatus
  size?: 'sm' | 'md'
}

export default function StatusBadge({ status, size = 'md' }: Props) {
  const styles: Record<LoadStatus, { badge: string; dot: string }> = {
    'Pending': {
      badge: 'bg-amber-50 text-amber-700 border-amber-200/80 shadow-amber-500/5',
      dot: 'bg-amber-500'
    },
    'Picked Up': {
      badge: 'bg-sky-50 text-sky-700 border-sky-200/80 shadow-sky-500/5',
      dot: 'bg-sky-500'
    },
    'In Transit': {
      badge: 'bg-indigo-50 text-indigo-700 border-indigo-200/80 shadow-indigo-500/5',
      dot: 'bg-indigo-500 animate-pulse'
    },
    'Delivered': {
      badge: 'bg-emerald-50 text-emerald-700 border-emerald-200/80 shadow-emerald-500/5',
      dot: 'bg-emerald-500'
    },
  }

  const currentStyle = styles[status] || {
    badge: 'bg-slate-50 text-slate-700 border-slate-200',
    dot: 'bg-slate-400'
  }

  const sizeClasses = size === 'sm' 
    ? 'px-2.5 py-0.5 text-[11px] gap-1.5' 
    : 'px-3 py-1 text-xs gap-2'

  return (
    <span className={`inline-flex items-center font-bold tracking-wide border rounded-full whitespace-nowrap shrink-0 shadow-sm ${sizeClasses} ${currentStyle.badge}`}>
      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${currentStyle.dot}`} />
      {status}
    </span>
  )
}

