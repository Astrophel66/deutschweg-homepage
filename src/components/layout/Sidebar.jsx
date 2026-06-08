import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

// ── Icons (inline SVG to avoid extra dependencies) ────────────────────────────
const icons = {
  dashboard: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>,
  courses: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>,
  teachers: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  resources: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>,
  mockExams: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>,
  analytics: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
  flashcards: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M12 8v8M8 12h8"/></svg>,
  drills: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
  conversation: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>,
  profile: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  settings: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>,
  studio: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/></svg>,
  booking: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
  users: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  chevronLeft: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>,
  chevronRight: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>,
}

// ── Nav config by role ────────────────────────────────────────────────────────
const navConfig = {
  student: [
    {
      section: 'Learning',
      items: [
        { label: 'Dashboard', icon: 'dashboard', path: '/student/dashboard' },
        { label: 'Courses', icon: 'courses', path: '/courses' },
        { label: 'Teachers', icon: 'teachers', path: '/teachers' },
        { label: 'Resources', icon: 'resources', path: '/resources' },
        { label: 'Mock Exams', icon: 'mockExams', path: '/student/mock-exams' },
        { label: 'Analytics', icon: 'analytics', path: '/student/progress' },
      ],
    },
    {
      section: 'Practice',
      items: [
        { label: 'Flashcards', icon: 'flashcards', path: '/student/flashcards' },
        { label: 'Skill Drills', icon: 'drills', path: '/student/practice' },
        { label: 'Conversation AI', icon: 'conversation', path: '/student/conversation' },
      ],
    },
    {
      section: 'Account',
      items: [
        { label: 'Profile', icon: 'profile', path: '/student/profile' },
        { label: 'Settings', icon: 'settings', path: '/student/settings' },
      ],
    },
  ],
  teacher: [
    {
      section: 'Learning',
      items: [
        { label: 'Dashboard', icon: 'dashboard', path: '/teacher/dashboard' },
        { label: 'My Courses', icon: 'courses', path: '/teacher/courses' },
        { label: 'Resources', icon: 'resources', path: '/resources' },
        { label: 'Analytics', icon: 'analytics', path: '/teacher/analytics' },
      ],
    },
    {
      section: 'Workspace',
      items: [
        { label: 'Teacher Studio', icon: 'studio', path: '/teacher/studio' },
        { label: 'Availability', icon: 'booking', path: '/scheduling/availability' },
        { label: 'Bookings', icon: 'booking', path: '/scheduling/bookings' },
      ],
    },
    {
      section: 'Account',
      items: [
        { label: 'Profile', icon: 'profile', path: '/teacher/profile' },
        { label: 'Settings', icon: 'settings', path: '/teacher/settings' },
      ],
    },
  ],
  admin: [
    {
      section: 'Overview',
      items: [
        { label: 'Dashboard', icon: 'dashboard', path: '/admin/dashboard' },
      ],
    },
    {
      section: 'Management',
      items: [
        { label: 'Users', icon: 'users', path: '/admin/users' },
        { label: 'Teachers', icon: 'teachers', path: '/admin/teachers' },
        { label: 'Courses', icon: 'courses', path: '/admin/courses' },
        { label: 'Resources', icon: 'resources', path: '/admin/resources' },
        { label: 'Mock Exams', icon: 'mockExams', path: '/admin/mock-exams' },
        { label: 'Bookings', icon: 'booking', path: '/admin/bookings' },
      ],
    },
    {
      section: 'Account',
      items: [
        { label: 'Settings', icon: 'settings', path: '/admin/settings' },
      ],
    },
  ],
}

export default function Sidebar({ collapsed, setCollapsed, mobileOpen, setMobileOpen }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const nav = navConfig[user?.role] || navConfig.student

  function handleNav(path) {
    navigate(path)
    setMobileOpen(false)
  }

  function isActive(path) {
    return location.pathname === path
  }

  const sidebarContent = (
    <div className="flex flex-col h-full">

      {/* Logo + collapse button */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-[var(--border-color)] shrink-0">
        {!collapsed && (
          <div
            onClick={() => navigate('/')}
            className="font-display text-xl font-black text-[var(--charcoal)] cursor-pointer"
          >
            Deutsch<span className="text-[var(--red-brand)]">Weg</span>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 rounded-lg hover:bg-[var(--cream)] text-[var(--warm-gray)] hover:text-[var(--charcoal)] transition-all ml-auto"
        >
          {collapsed ? icons.chevronRight : icons.chevronLeft}
        </button>
      </div>

      {/* Nav sections */}
      <div className="flex-1 overflow-y-auto py-4 px-3 space-y-6">
        {nav.map(section => (
          <div key={section.section}>
            {/* Section header — hidden when collapsed */}
            {!collapsed && (
              <p className="text-xs font-semibold text-[var(--warm-gray)] uppercase tracking-wider px-3 mb-2">
                {section.section}
              </p>
            )}
            <div className="space-y-1">
              {section.items.map(item => (
                <button
                  key={item.path}
                  onClick={() => handleNav(item.path)}
                  title={collapsed ? item.label : ''}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isActive(item.path)
                      ? 'bg-[var(--cream)] text-[var(--charcoal)]'
                      : 'text-[var(--warm-gray)] hover:bg-[var(--cream)] hover:text-[var(--charcoal)]'
                  } ${collapsed ? 'justify-center' : ''}`}
                >
                  <span className="shrink-0">{icons[item.icon]}</span>
                  {!collapsed && <span>{item.label}</span>}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* User info + logout */}
      <div className="border-t border-[var(--border-color)] p-3 shrink-0">
        <div className={`flex items-center gap-3 px-3 py-2 ${collapsed ? 'justify-center' : ''}`}>
          <div className="w-8 h-8 rounded-full bg-[var(--charcoal)] text-white flex items-center justify-center text-xs font-bold shrink-0">
            {user?.full_name?.charAt(0) || 'U'}
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-[var(--charcoal)] truncate">{user?.full_name}</p>
              <p className="text-xs text-[var(--warm-gray)] capitalize">{user?.role}</p>
            </div>
          )}
        </div>
        {!collapsed && (
          <button
            onClick={() => { logout(); navigate('/') }}
            className="w-full mt-2 py-2 text-xs font-medium text-[var(--warm-gray)] hover:text-[var(--red-brand)] transition-colors text-left px-3"
          >
            Sign out
          </button>
        )}
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className={`hidden md:flex flex-col bg-white border-r border-[var(--border-color)] h-screen sticky top-0 transition-all duration-300 ${
          collapsed ? 'w-16' : 'w-60'
        }`}
      >
        {sidebarContent}
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile sidebar */}
      <aside
        className={`fixed top-0 left-0 h-screen w-60 bg-white border-r border-[var(--border-color)] z-50 md:hidden transition-transform duration-300 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {sidebarContent}
      </aside>
    </>
  )
}