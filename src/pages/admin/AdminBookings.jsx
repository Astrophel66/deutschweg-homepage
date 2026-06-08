import { useEffect, useState } from 'react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import api from '../../api/axios'
import toast from 'react-hot-toast'

const STATUS_COLORS = {
  pending: 'bg-amber-50 text-amber-700',
  confirmed: 'bg-green-50 text-green-700',
  cancelled: 'bg-red-50 text-red-600',
  completed: 'bg-zinc-100 text-zinc-500',
}

export default function AdminBookings() {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    api.get('/admin/bookings/')
      .then(res => setBookings(res.data))
      .catch(() => toast.error('Failed to load bookings.'))
      .finally(() => setLoading(false))
  }, [])

  const filtered = bookings.filter(b => {
    if (filter === 'all') return true
    return b.status === filter
  })

  const counts = {
    all: bookings.length,
    pending: bookings.filter(b => b.status === 'pending').length,
    confirmed: bookings.filter(b => b.status === 'confirmed').length,
    cancelled: bookings.filter(b => b.status === 'cancelled').length,
    completed: bookings.filter(b => b.status === 'completed').length,
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">

        <div>
          <h1 className="font-display text-2xl font-black text-[var(--charcoal)]">Bookings</h1>
          <p className="text-sm text-[var(--warm-gray)] mt-1">
            {counts.pending} pending · {counts.confirmed} confirmed
          </p>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 flex-wrap">
          {[
            { key: 'all', label: `All (${counts.all})` },
            { key: 'pending', label: `Pending (${counts.pending})` },
            { key: 'confirmed', label: `Confirmed (${counts.confirmed})` },
            { key: 'cancelled', label: `Cancelled (${counts.cancelled})` },
            { key: 'completed', label: `Completed (${counts.completed})` },
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
              <p className="text-sm text-[var(--warm-gray)]">No bookings found.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[var(--border-color)] bg-[var(--cream)]">
                    <th className="text-left text-xs font-semibold text-[var(--warm-gray)] px-6 py-3">Student</th>
                    <th className="text-left text-xs font-semibold text-[var(--warm-gray)] px-6 py-3">Teacher</th>
                    <th className="text-left text-xs font-semibold text-[var(--warm-gray)] px-6 py-3">Day & Time</th>
                    <th className="text-left text-xs font-semibold text-[var(--warm-gray)] px-6 py-3">Date</th>
                    <th className="text-left text-xs font-semibold text-[var(--warm-gray)] px-6 py-3">Status</th>
                    <th className="text-left text-xs font-semibold text-[var(--warm-gray)] px-6 py-3">Booked</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(b => (
                    <tr key={b.id} className="border-b border-[var(--border-color)] last:border-0 hover:bg-[var(--cream)] transition-all">
                      <td className="px-6 py-4">
                        <p className="text-sm font-semibold text-[var(--charcoal)]">{b.student_name}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-[var(--charcoal)]">{b.teacher_name}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-[var(--charcoal)]">{b.day_name}</p>
                        <p className="text-xs text-[var(--warm-gray)]">{b.start_time}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-[var(--charcoal)]">
                          {new Date(b.date).toLocaleDateString()}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg capitalize ${STATUS_COLORS[b.status]}`}>
                          {b.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-xs text-[var(--warm-gray)]">
                          {new Date(b.created_at).toLocaleDateString()}
                        </p>
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