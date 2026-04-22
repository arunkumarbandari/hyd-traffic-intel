import { NavLink } from 'react-router-dom'

const baseLinkClass =
  "h-full flex items-center text-sm font-['Inter'] antialiased tracking-tight transition-colors"

export default function TopNav() {
  return (
    <nav className="fixed top-0 z-50 h-16 w-full border-b-[0.5px] border-black/10 bg-white/70 shadow-[0_4px_24px_-1px_rgba(0,0,0,0.06)] backdrop-blur-[30px]">
      <div className="flex h-full w-full max-w-[100vw] items-center justify-between px-8">
        <div className="text-xl font-black tracking-tighter text-slate-900">
          Hyderabad Traffic
        </div>

        <div className="hidden items-center gap-space-6 md:flex">
          <NavLink
            to="/live-map"
            className={({ isActive }) =>
              `${baseLinkClass} ${
                isActive
                  ? 'border-b-2 border-blue-600 pb-1 font-semibold text-blue-600'
                  : 'text-slate-500 hover:text-slate-900'
              }`
            }
          >
            Live Map
          </NavLink>
          <NavLink
            to="/intelligence"
            className={({ isActive }) =>
              `${baseLinkClass} ${
                isActive
                  ? 'border-b-2 border-blue-600 pb-1 font-semibold text-blue-600'
                  : 'text-slate-500 hover:text-slate-900'
              }`
            }
          >
            Intelligence
          </NavLink>
          <NavLink
            to="/history"
            className={({ isActive }) =>
              `${baseLinkClass} ${
                isActive
                  ? 'border-b-2 border-blue-600 pb-1 font-semibold text-blue-600'
                  : 'text-slate-500 hover:text-slate-900'
              }`
            }
          >
            History
          </NavLink>
        </div>

        <div className="flex items-center gap-space-4">
          <div className="flex cursor-pointer items-center gap-space-2 rounded-lg px-3 py-1.5 text-sm font-['Inter'] tracking-tight text-blue-600 transition-all duration-300 ease-out hover:bg-black/5 active:scale-95">
            <span className="h-2 w-2 animate-pulse rounded-full bg-color-red shadow-[0_0_8px_#FF3B30]" />
            <span className="font-semibold tracking-wide">Live</span>
          </div>
          <button
            type="button"
            className="flex cursor-pointer items-center justify-center rounded-lg p-2 text-slate-500 transition-all duration-300 hover:bg-black/5 hover:text-slate-900 active:scale-95"
          >
            <span className="material-symbols-outlined text-[24px]">notifications</span>
          </button>
          <button
            type="button"
            className="flex cursor-pointer items-center justify-center rounded-lg p-2 text-slate-500 transition-all duration-300 hover:bg-black/5 hover:text-slate-900 active:scale-95"
          >
            <span className="material-symbols-outlined text-[24px]">account_circle</span>
          </button>
        </div>
      </div>
    </nav>
  )
}
