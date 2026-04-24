import HydLogo from '../../components/HydLogo'
import { useState } from 'react'
import { NavLink } from 'react-router-dom'

const segmentedLinkBaseClass =
  "flex items-center rounded-[9px] px-4 py-2 text-sm font-['Inter'] tracking-tight transition-all duration-200 ease-in-out"

const mobileLinkClass =
  "flex items-center rounded-xl px-4 py-3 text-sm font-['Inter'] font-medium tracking-tight transition-colors"

export default function TopNav() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <nav className="fixed top-0 z-50 h-16 w-full border-b-[0.5px] border-black/10 bg-white/70 shadow-[0_4px_24px_-1px_rgba(0,0,0,0.06)] backdrop-blur-[30px]">
      <div className="relative flex h-full w-full max-w-[100vw] items-center justify-between px-3 sm:px-4 md:px-8">
        <div className="text-xl font-black tracking-tighter text-slate-900">
          <div className="md:hidden">
            <HydLogo width={180} />
          </div>
          <div className="mt-2 hidden md:block">
            <HydLogo width={300} />
          </div>
        </div>

        <div className="hidden rounded-[12px] border border-white/25 bg-white/15 p-[3px] shadow-[0_6px_16px_rgba(0,0,0,0.08)] backdrop-blur-[20px] md:flex md:items-center md:gap-1">
          <NavLink
            to="/live-map"
            className={({ isActive }) =>
              `${segmentedLinkBaseClass} ${
                isActive
                  ? 'bg-[rgba(255,255,255,0.92)] font-semibold text-black shadow-[0_1px_4px_rgba(0,0,0,0.12)]'
                  : 'bg-transparent font-normal text-slate-700 hover:text-slate-900'
              }`
            }
          >
            Live Map
          </NavLink>
          <NavLink
            to="/intelligence"
            className={({ isActive }) =>
              `${segmentedLinkBaseClass} ${
                isActive
                  ? 'bg-[rgba(255,255,255,0.92)] font-semibold text-black shadow-[0_1px_4px_rgba(0,0,0,0.12)]'
                  : 'bg-transparent font-normal text-slate-700 hover:text-slate-900'
              }`
            }
          >
            Intelligence
          </NavLink>
          <NavLink
            to="/history"
            className={({ isActive }) =>
              `${segmentedLinkBaseClass} ${
                isActive
                  ? 'bg-[rgba(255,255,255,0.92)] font-semibold text-black shadow-[0_1px_4px_rgba(0,0,0,0.12)]'
                  : 'bg-transparent font-normal text-slate-700 hover:text-slate-900'
              }`
            }
          >
            History
          </NavLink>
        </div>

        <div className="flex items-center gap-1 sm:gap-space-2 md:gap-space-4">
          <button
            type="button"
            className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg text-slate-500 transition-all duration-300 hover:bg-black/5 hover:text-slate-900 active:scale-95 md:hidden"
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-nav-menu"
            onClick={() => setMobileMenuOpen((previous) => !previous)}
          >
            <span className="material-symbols-outlined text-[22px]">
              {mobileMenuOpen ? 'close' : 'menu'}
            </span>
          </button>
          <button
            type="button"
            className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg text-slate-500 transition-all duration-300 hover:bg-black/5 hover:text-slate-900 active:scale-95"
            aria-label="Profile"
          >
            <span className="material-symbols-outlined text-[24px]">account_circle</span>
          </button>
        </div>

        <div
          id="mobile-nav-menu"
          className={`absolute left-3 right-3 top-[calc(100%+8px)] z-50 rounded-2xl border border-black/10 bg-white/95 p-2 shadow-[0_14px_30px_rgba(0,0,0,0.12)] backdrop-blur-[24px] transition-all duration-200 md:hidden ${
            mobileMenuOpen ? 'visible translate-y-0 opacity-100' : 'invisible -translate-y-2 opacity-0'
          }`}
        >
          <div className="flex flex-col gap-1">
            <NavLink
              to="/live-map"
              className={({ isActive }) =>
                `${mobileLinkClass} ${
                  isActive
                    ? 'bg-blue-50 font-semibold text-blue-600'
                    : 'text-slate-600 hover:bg-black/5 hover:text-slate-900'
                }`
              }
              onClick={() => setMobileMenuOpen(false)}
            >
              Live Map
            </NavLink>
            <NavLink
              to="/intelligence"
              className={({ isActive }) =>
                `${mobileLinkClass} ${
                  isActive
                    ? 'bg-blue-50 font-semibold text-blue-600'
                    : 'text-slate-600 hover:bg-black/5 hover:text-slate-900'
                }`
              }
              onClick={() => setMobileMenuOpen(false)}
            >
              Intelligence
            </NavLink>
            <NavLink
              to="/history"
              className={({ isActive }) =>
                `${mobileLinkClass} ${
                  isActive
                    ? 'bg-blue-50 font-semibold text-blue-600'
                    : 'text-slate-600 hover:bg-black/5 hover:text-slate-900'
                }`
              }
              onClick={() => setMobileMenuOpen(false)}
            >
              History
            </NavLink>
          </div>
        </div>
      </div>
    </nav>
  )
}
