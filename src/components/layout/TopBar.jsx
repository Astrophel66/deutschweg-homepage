import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function TopBar({ setMobileOpen }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [dropdownOpen, setDropdownOpen] = useState(false)

  function getDashboardPath() {
    if (user?.role === 'teacher') return '/teacher/dashboard'
    if (user?.role === 'admin') return '/admin/dashboard'
    return '/student/dashboard'
  }

  return (
    <header className="h-16 bg-white border-b border-[var(--border-color)] flex items-center justify-between px-4 md:px-6 sticky top-0 z-30">

      {/* Left — mobile hamburger + greeting */}
      <div className="flex items-center gap-4">
        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 rounded-lg hover:bg-[var(--cream)] text-[var(--warm-gray)]"
          onClick={() => setMobileOpen(prev => !prev)}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="3" y1="6" x2="21" y2="6"/>
            <line x1="3" y1="12" x2="21" y2="12"/>
            <line x1="3" y1="18" x2="21" y2="18"/>
          </svg>
        </button>

        {/* Greeting — hidden on mobile */}
        <div className="hidden md:block">
          <p className="text-sm font-semibold text-[var(--charcoal)]">
            Guten Tag, {user?.full_name?.split(' ')[0]} 👋
          </p>
          <p className="text-xs text-[var(--warm-gray)]">
            Here's your German learning progress
          </p>
        </div>
      </div>

      {/* Right — search, notifications, avatar */}
      <div className="flex items-center gap-3">

        {/* Search */}
        <div className="hidden md:flex items-center gap-2 bg-[var(--cream)] border border-[var(--border-color)] rounded-xl px-3 py-2 w-64">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-[var(--warm-gray)]">
            <circle cx="11" cy="11" r="8"/>
            <line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input
            type="text"
            placeholder="Search lessons, teachers, exams..."
            className="bg-transparent text-xs text-[var(--charcoal)] placeholder:text-[var(--warm-gray)] outline-none w-full"
          />
        </div>

        {/* Notifications */}
        <button className="relative p-2 rounded-xl hover:bg-[var(--cream)] text-[var(--warm-gray)] hover:text-[var(--charcoal)] transition-all">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
            <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
          </svg>
          {/* Notification dot */}
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[var(--red-brand)] rounded-full" />
        </button>

        {/* Avatar dropdown */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="w-8 h-8 rounded-full bg-[var(--charcoal)] text-white flex items-center justify-center text-xs font-bold hover:opacity-80 transition-all"
          >
            {user?.full_name?.charAt(0) || 'U'}
          </button>

          {dropdownOpen && (
            <>
              {/* Backdrop */}
              <div
                className="fixed inset-0 z-10"
                onClick={() => setDropdownOpen(false)}
              />
              {/* Dropdown */}
              <div className="absolute right-0 top-10 w-48 bg-white border border-[var(--border-color)] rounded-2xl shadow-lg z-20 overflow-hidden">
                <div className="px-4 py-3 border-b border-[var(--border-color)]">
                  <p className="text-xs font-semibold text-[var(--charcoal)] truncate">{user?.full_name}</p>
                  <p className="text-xs text-[var(--warm-gray)] truncate">{user?.email}</p>
                </div>
                <div className="py-1">
                  <button
                    onClick={() => { navigate(getDashboardPath()); setDropdownOpen(false) }}
                    className="w-full text-left px-4 py-2.5 text-xs font-medium text-[var(--charcoal)] hover:bg-[var(--cream)] transition-all"
                  >
                    Dashboard
                  </button>
                  <button
                    onClick={() => { navigate(`/${user?.role}/profile`); setDropdownOpen(false) }}
                    className="w-full text-left px-4 py-2.5 text-xs font-medium text-[var(--charcoal)] hover:bg-[var(--cream)] transition-all"
                  >
                    Profile
                  </button>
                  <button
                    onClick={() => { logout(); navigate('/') }}
                    className="w-full text-left px-4 py-2.5 text-xs font-medium text-[var(--red-brand)] hover:bg-[var(--cream)] transition-all"
                  >
                    Sign out
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  )
}