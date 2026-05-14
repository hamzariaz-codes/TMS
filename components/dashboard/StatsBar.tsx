import { LoadStats } from '@/types'

export default function StatsBar({ stats }: { stats: LoadStats }) {
  const cards = [
    { label: 'Total Loads', value: stats.total, color: 'text-navy-950', bg: 'bg-white' },
    { label: 'Pending', value: stats.pending, color: 'text-yellow-600', bg: 'bg-yellow-50' },
    { label: 'In Transit', value: stats.inTransit, color: 'text-orange-600', bg: 'bg-orange-50' },
    { label: 'Delivered', value: stats.delivered, color: 'text-green-600', bg: 'bg-green-50' },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {cards.map((card) => (
        <div key={card.label} className={`${card.bg} p-6 rounded-2xl border border-slate-100 shadow-sm transition-transform hover:scale-[1.02]`}>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">{card.label}</p>
          <p className={`text-3xl font-black ${card.color}`}>{card.value}</p>
        </div>
      ))}
    </div>
  )
}
