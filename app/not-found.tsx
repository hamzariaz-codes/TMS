import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-navy-950 text-white flex flex-col items-center justify-center p-6 text-center">
      <div className="max-w-md w-full bg-slate-900/90 border border-slate-800 rounded-3xl p-8 backdrop-blur-lg shadow-2xl">
        <h1 className="text-6xl font-black text-accent mb-2">404</h1>
        <h2 className="text-2xl font-bold mb-2">Page Not Found</h2>
        <p className="text-slate-400 text-sm mb-6">
          The requested page could not be found.
        </p>
        <Link
          href="/submit"
          className="inline-block py-3 px-6 bg-accent hover:bg-accent-hover text-white text-sm font-semibold rounded-xl transition-all shadow-lg"
        >
          Return to LoadDesk
        </Link>
      </div>
    </div>
  )
}
