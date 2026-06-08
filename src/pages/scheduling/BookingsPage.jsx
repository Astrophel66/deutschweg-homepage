import { useEffect, useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import api from '../../api/axios'

import DashboardLayout from '../../components/layout/DashboardLayout'

export default function BookingsPage() {
  const { user } = useAuth()
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [meetingLink, setMeetingLink] = useState({}) // { [bookingId]: url }
  const [error, setError] = useState('')

  useEffect(() => {
    fetchBookings()
  }, [])

  function fetchBookings() {
    api.get('/scheduling/bookings/')
      .then(res => setBookings(res.data))
      .catch(() => setBookings([]))
      .finally(() => setLoading(false))
  }

  async function handleConfirm(bookingId) {
    const link = meetingLink[bookingId]
    if (!link) { setError('Please enter a meeting link first.'); return }
    try {
      await api.patch(`/scheduling/bookings/${bookingId}/confirm/`, {
        meeting_link: link
      })
      fetchBookings()
      setError('')
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to confirm.')
    }
  }

  async function handleUpdateLink(bookingId) {
    const link = meetingLink[bookingId]
    if (!link) { setError('Please enter a meeting link first.'); return }
    try {
      await api.patch(`/scheduling/bookings/${bookingId}/meeting-link/`, {
        meeting_link: link
      })
      fetchBookings()
      setError('')
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update link.')
    }
  }

  async function handleCancel(bookingId) {
    try {
      await api.patch(`/scheduling/bookings/${bookingId}/cancel/`)
      fetchBookings()
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to cancel.')
    }
  }

  const statusColors = {
    pending: 'bg-amber-50 text-amber-700',
    confirmed: 'bg-green-50 text-green-700',
    cancelled: 'bg-red-50 text-red-600',
    completed: 'bg-zinc-100 text-zinc-500',
  }

  return (
    <div className="min-h-screen bg-[var(--cream)] px-4 py-12">
      <div className="max-w-3xl mx-auto">

        <h1 className="font-display text-2xl font-black text-[var(--charcoal)] mb-2">
          {user?.role === 'teacher' ? 'Booking Requests' : 'My Bookings'}
        </h1>
        <p className="text-sm text-[var(--warm-gray)] mb-8">
          {user?.role === 'teacher'
            ? 'Manage incoming class booking requests.'
            : 'View and manage your booked classes.'}
        </p>

        {error && (
          <div className="bg-[var(--red-muted)] text-[var(--red-brand)] text-sm font-medium px-4 py-3 rounded-xl mb-6">
            {error}
          </div>
        )}

        {loading && <p className="text-sm text-[var(--warm-gray)]">Loading...</p>}

        {!loading && bookings.length === 0 && (
          <div className="text-center py-16">
            <div className="text-4xl mb-4">📅</div>
            <p className="text-sm text-[var(--warm-gray)]">No bookings yet.</p>
          </div>
        )}

        <div className="space-y-4">
          {bookings.map(b => (
            <div
              key={b.id}
              className="bg-white border border-[var(--border-color)] rounded-2xl p-6"
            >
              {/* Header */}
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="font-semibold text-[var(--charcoal)]">
                    {user?.role === 'teacher' ? b.student_name : b.teacher_name}
                  </p>
                  <p className="text-xs text-[var(--warm-gray)] mt-0.5">
                    {b.day_name} • {b.start_time} — {b.end_time} • {b.date}
                  </p>
                  {b.note && (
                    <p className="text-xs text-[var(--warm-gray)] mt-1">
                      Note: {b.note}
                    </p>
                  )}
                </div>
                <span className={`text-xs font-semibold px-3 py-1 rounded-lg capitalize ${statusColors[b.status]}`}>
                  {b.status}
                </span>
              </div>

              {/* Meeting link — show to student if confirmed */}
              {b.status === 'confirmed' && b.meeting_link && user?.role === 'student' && (
                <a
                  href={b.meeting_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-center py-2 bg-green-50 border border-green-200 rounded-xl text-xs font-semibold text-green-700 hover:bg-green-100 transition-all mb-4"
                >
                  🎥 Join Class
                </a>
              )}

              {/* Teacher actions */}
              {user?.role === 'teacher' && b.status !== 'cancelled' && b.status !== 'completed' && (
                <div className="space-y-3">
                  {/* Meeting link input */}
                  <div className="flex gap-2">
                    <input
                      type="url"
                      placeholder="https://meet.google.com/..."
                      value={meetingLink[b.id] || b.meeting_link || ''}
                      onChange={e => setMeetingLink(prev => ({ ...prev, [b.id]: e.target.value }))}
                      className="flex-1 px-3 py-2 rounded-xl border border-[var(--border-color)] text-xs bg-[var(--cream)] outline-none focus:border-[var(--charcoal)]"
                    />
                    <button
                      onClick={() => handleUpdateLink(b.id)}
                      className="px-3 py-2 bg-[var(--cream)] border border-[var(--border-color)] rounded-xl text-xs font-semibold hover:border-[var(--charcoal)] transition-all"
                    >
                      Update
                    </button>
                  </div>

                  <div className="flex gap-2">
                    {b.status === 'pending' && (
                      <button
                        onClick={() => handleConfirm(b.id)}
                        className="flex-1 py-2 bg-[var(--charcoal)] text-white rounded-xl text-xs font-semibold hover:bg-zinc-800 transition-all"
                      >
                        Confirm
                      </button>
                    )}
                    <button
                      onClick={() => handleCancel(b.id)}
                      className="flex-1 py-2 bg-[var(--cream)] border border-[var(--border-color)] rounded-xl text-xs font-semibold text-[var(--red-brand)] hover:border-[var(--red-brand)] transition-all"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {/* Student cancel */}
              {user?.role === 'student' && b.status === 'pending' && (
                <button
                  onClick={() => handleCancel(b.id)}
                  className="w-full py-2 bg-[var(--cream)] border border-[var(--border-color)] rounded-xl text-xs font-semibold text-[var(--red-brand)] hover:border-[var(--red-brand)] transition-all"
                >
                  Cancel Booking
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}