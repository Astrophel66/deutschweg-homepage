import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import DashboardLayout from '../../components/layout/DashboardLayout'
import StatCard from '../../components/ui/StatCard'
import api from '../../api/axios'
import toast from 'react-hot-toast'

export default function AdminDashboard() {
  const navigate = useNavigate()
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/admin/stats/')
      .then(res => setStats(res.data))
      .catch(() => toast.error('Failed to load stats.'))
      .finally(() => setLoading(false))
  }, [])

  const quickLinks = [
    { label: 'Users', icon: '👥', path: '/admin/users', desc: 'Manage all users' },
    { label: 'Teachers', icon: '👨‍🏫', path: '/admin/teachers', desc: 'Verify teachers' },
    { label: 'Courses', icon: '📚', path: '/admin/courses', desc: 'Publish/unpublish' },
    { label: 'Resources', icon: '📄', path: '/admin/resources', desc: 'Mark as premium' },
    { label: 'Bookings', icon: '📅', path: '/admin/bookings', desc: 'View all bookings' },
  ]

  return (
    <DashboardLayout>
      <div className="space-y-6">

        <div>
          <h1 className="font-display text-2xl font-black text-[var(--charcoal)]">
            Admin Dashboard
          </h1>
          <p className="text-sm text-[var(--warm-gray)] mt-1">
            Platform overview and management
          </p>
        </div>

        {/* Stat cards */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white border border-[var(--border-color)] rounded-2xl p-5 h-28 animate-pulse" />
            ))}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard
                label="Total Users"
                value={stats?.total_users || 0}
                subtitle={`${stats?.total_students || 0} students · ${stats?.total_teachers || 0} teachers`}
                icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>}
              />
              <StatCard
                label="Verified Teachers"
                value={stats?.verified_teachers || 0}
                subtitle={`of ${stats?.total_teachers || 0} total`}
                icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>}
              />
              <StatCard
                label="Published Courses"
                value={stats?.published_courses || 0}
                subtitle={`of ${stats?.total_courses || 0} total`}
                icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>}
              />
              <StatCard
                label="Total Enrollments"
                value={stats?.total_enrollments || 0}
                subtitle="Across all courses"
                icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>}
              />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard
                label="Total Bookings"
                value={stats?.total_bookings || 0}
                subtitle={`${stats?.pending_bookings || 0} pending`}
                badge={stats?.pending_bookings > 0 ? `${stats.pending_bookings} pending` : null}
                icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>}
              />
              <StatCard
                label="Total Resources"
                value={stats?.total_resources || 0}
                subtitle={`${stats?.premium_resources || 0} premium`}
                icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>}
              />
            </div>
          </>
        )}

        {/* Quick links */}
        <div>
          <h2 className="text-sm font-semibold text-[var(--warm-gray)] uppercase tracking-wider mb-3">
            Management
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {quickLinks.map(link => (
              <button
                key={link.label}
                onClick={() => navigate(link.path)}
                className="bg-white border border-[var(--border-color)] rounded-2xl p-5 text-left hover:-translate-y-1 hover:shadow-lg transition-all duration-200"
              >
                <div className="text-2xl mb-2">{link.icon}</div>
                <div className="text-sm font-semibold text-[var(--charcoal)]">{link.label}</div>
                <div className="text-xs text-[var(--warm-gray)] mt-0.5">{link.desc}</div>
              </button>
            ))}
          </div>
        </div>

      </div>
    </DashboardLayout>
  )
}