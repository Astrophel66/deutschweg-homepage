import { useEffect, useState } from 'react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import api from '../../api/axios'
import toast from 'react-hot-toast'

export default function AdminTeachers() {
  const [teachers, setTeachers] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all') // all | verified | unverified

  useEffect(() => {
    fetchTeachers()
  }, [])

  function fetchTeachers() {
    api.get('/admin/teachers/')
      .then(res => setTeachers(res.data))
      .catch(() => toast.error('Failed to load teachers.'))
      .finally(() => setLoading(false))
  }

  async function handleToggleVerified(profileId, current) {
    try {
      const res = await api.patch(`/admin/teachers/${profileId}/toggle-verified/`)
      setTeachers(prev => prev.map(t =>
        t.id === profileId ? { ...t, is_verified: res.data.is_verified } : t
      ))
      toast.success(res.data.is_verified ? 'Teacher verified ✓' : 'Teacher unverified')
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to update.')
    }
  }

  const filtered = teachers.filter(t => {
    if (filter === 'verified') return t.is_verified
    if (filter === 'unverified') return !t.is_verified
    return true
  })

  return (
    <DashboardLayout>
      <div className="space-y-6">

        <div>
          <h1 className="font-display text-2xl font-black text-[var(--charcoal)]">Teachers</h1>
          <p className="text-sm text-[var(--warm-gray)] mt-1">
            {teachers.filter(t => !t.is_verified).length} pending verification
          </p>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2">
          {[
            { key: 'all', label: `All (${teachers.length})` },
            { key: 'verified', label: `Verified (${teachers.filter(t => t.is_verified).length})` },
            { key: 'unverified', label: `Pending (${teachers.filter(t => !t.is_verified).length})` },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all ${
                filter === tab.key
                  ? 'bg-[var(--charcoal)] text-white border-[var(--charcoal)]'
                  : 'bg-white text-[var(--warm-gray)] border-[var(--border-color)] hover:border-zinc-400'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Table */}
        <div className="bg-white border border-[var(--border-color)] rounded-2xl overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center h-40">
              <p className="text-sm text-[var(--warm-gray)]">Loading...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-sm text-[var(--warm-gray)]">No teachers found.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[var(--border-color)] bg-[var(--cream)]">
                    <th className="text-left text-xs font-semibold text-[var(--warm-gray)] px-6 py-3">Teacher</th>
                    <th className="text-left text-xs font-semibold text-[var(--warm-gray)] px-6 py-3">Experience</th>
                    <th className="text-left text-xs font-semibold text-[var(--warm-gray)] px-6 py-3">Certifications</th>
                    <th className="text-left text-xs font-semibold text-[var(--warm-gray)] px-6 py-3">Rate</th>
                    <th className="text-left text-xs font-semibold text-[var(--warm-gray)] px-6 py-3">Status</th>
                    <th className="text-left text-xs font-semibold text-[var(--warm-gray)] px-6 py-3">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(t => (
                    <tr key={t.id} className="border-b border-[var(--border-color)] last:border-0 hover:bg-[var(--cream)] transition-all">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold shrink-0">
                            {t.full_name?.charAt(0)}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-[var(--charcoal)]">{t.full_name}</p>
                            <p className="text-xs text-[var(--warm-gray)]">{t.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-[var(--charcoal)]">{t.experience_years} years</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-xs text-[var(--warm-gray)] max-w-32 truncate">
                          {t.certifications || '—'}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-[var(--charcoal)]">
                          {t.hourly_rate ? `$${t.hourly_rate}/hr` : '—'}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg ${
                          t.is_verified
                            ? 'bg-green-50 text-green-700'
                            : 'bg-amber-50 text-amber-700'
                        }`}>
                          {t.is_verified ? '✓ Verified' : '⏳ Pending'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleToggleVerified(t.id, t.is_verified)}
                          className={`text-xs font-semibold px-3 py-1.5 rounded-xl border transition-all ${
                            t.is_verified
                              ? 'border-red-200 text-red-600 hover:bg-red-50'
                              : 'border-green-200 text-green-600 hover:bg-green-50'
                          }`}
                        >
                          {t.is_verified ? 'Unverify' : 'Verify'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}