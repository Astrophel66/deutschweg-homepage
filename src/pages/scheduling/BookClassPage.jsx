import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import api from '../../api/axios'

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

export default function BookClassPage() {
  const navigate = useNavigate()
  const [teachers, setTeachers] = useState([])
  const [selectedTeacher, setSelectedTeacher] = useState(null)
  const [slots, setSlots] = useState([])
  const [selectedSlot, setSelectedSlot] = useState(null)
  const [date, setDate] = useState('')
  const [note, setNote] = useState('')
  const [saving, setSaving] = useState(false)
  const [apiError, setApiError] = useState('')
  const [success, setSuccess] = useState(false)

  // Fetch verified teachers on mount
  useEffect(() => {
    api.get('/teachers/')
      .then(res => setTeachers(res.data))
      .catch(() => setTeachers([]))
  }, [])

  // Fetch slots when teacher is selected
  useEffect(() => {
    if (!selectedTeacher) return
    setSlots([])
    setSelectedSlot(null)
    api.get(`/scheduling/availability/teacher/${selectedTeacher.id}/`)
      .then(res => setSlots(res.data))
      .catch(() => setSlots([]))
  }, [selectedTeacher])

  async function handleSubmit(e) {
    e.preventDefault()
    if (!selectedSlot) { setApiError('Please select a time slot.'); return }
    if (!date) { setApiError('Please select a date.'); return }

    setSaving(true)
    setApiError('')
    try {
      await api.post('/scheduling/bookings/', {
        availability_id: selectedSlot.id,
        date,
        note,
      })
      setSuccess(true)
      setTimeout(() => navigate('/scheduling/bookings'), 1500)
    } catch (err) {
      setApiError(err.response?.data?.error || 'Booking failed.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-[var(--cream)] px-4 py-12">
      <motion.div
        className="max-w-lg mx-auto"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      >
        <h1 className="font-display text-2xl font-black text-[var(--charcoal)] mb-2">
          Book a Class
        </h1>
        <p className="text-sm text-[var(--warm-gray)] mb-8">
          Pick a teacher, choose a time slot and date.
        </p>

        {success && (
          <div className="bg-green-50 text-green-700 text-sm font-medium px-4 py-3 rounded-xl mb-6">
            Booking sent! Redirecting…
          </div>
        )}

        {apiError && (
          <div className="bg-[var(--red-muted)] text-[var(--red-brand)] text-sm font-medium px-4 py-3 rounded-xl mb-6">
            {apiError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Step 1 — Pick teacher */}
          <div className="bg-white border border-[var(--border-color)] rounded-2xl p-6">
            <h2 className="font-semibold text-[var(--charcoal)] mb-4">1. Pick a Teacher</h2>
            {teachers.length === 0 && (
              <p className="text-sm text-[var(--warm-gray)]">No verified teachers available.</p>
            )}
            <div className="space-y-2">
              {teachers.map(t => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setSelectedTeacher(t)}
                  className={`w-full flex items-center gap-4 p-4 rounded-xl border transition-all text-left ${
                    selectedTeacher?.id === t.id
                      ? 'border-[var(--charcoal)] bg-[var(--cream)]'
                      : 'border-[var(--border-color)] hover:border-zinc-400'
                  }`}
                >
                  <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-sm font-bold text-indigo-700">
                    {t.full_name?.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[var(--charcoal)]">{t.full_name}</p>
                    <p className="text-xs text-[var(--warm-gray)]">
                      {t.hourly_rate ? `$${t.hourly_rate}/hr` : 'Rate not set'}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Step 2 — Pick slot */}
          {selectedTeacher && (
            <div className="bg-white border border-[var(--border-color)] rounded-2xl p-6">
              <h2 className="font-semibold text-[var(--charcoal)] mb-4">2. Pick a Time Slot</h2>
              {slots.length === 0 && (
                <p className="text-sm text-[var(--warm-gray)]">
                  This teacher has no available slots yet.
                </p>
              )}
              <div className="space-y-2">
                {slots.map(slot => (
                  <button
                    key={slot.id}
                    type="button"
                    onClick={() => setSelectedSlot(slot)}
                    className={`w-full flex justify-between items-center p-4 rounded-xl border transition-all ${
                      selectedSlot?.id === slot.id
                        ? 'border-[var(--charcoal)] bg-[var(--cream)]'
                        : 'border-[var(--border-color)] hover:border-zinc-400'
                    }`}
                  >
                    <span className="text-sm font-semibold text-[var(--charcoal)]">
                      {slot.day_name}
                    </span>
                    <span className="text-xs text-[var(--warm-gray)]">
                      {slot.start_time} — {slot.end_time}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 3 — Pick date */}
          {selectedSlot && (
            <div className="bg-white border border-[var(--border-color)] rounded-2xl p-6">
              <h2 className="font-semibold text-[var(--charcoal)] mb-4">3. Pick a Date</h2>
              <input
                type="date"
                value={date}
                onChange={e => setDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="w-full px-3.5 py-2.5 rounded-xl border text-sm font-medium bg-[var(--cream)] text-[var(--charcoal)] outline-none border-[var(--border-color)] focus:border-[var(--charcoal)] focus:bg-white"
              />
              <textarea
                value={note}
                onChange={e => setNote(e.target.value)}
                placeholder="Optional note to teacher..."
                rows={2}
                className="w-full mt-4 px-3.5 py-2.5 rounded-xl border text-sm font-medium bg-[var(--cream)] text-[var(--charcoal)] placeholder:text-[var(--warm-gray)] outline-none border-[var(--border-color)] focus:border-[var(--charcoal)] focus:bg-white"
              />
            </div>
          )}

          {selectedSlot && date && (
            <button
              type="submit"
              disabled={saving}
              className="w-full py-3 bg-[var(--charcoal)] text-white rounded-xl text-sm font-semibold tracking-wide transition-all hover:bg-zinc-800 hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
            >
              {saving ? 'Booking…' : 'Confirm Booking'}
            </button>
          )}

        </form>
      </motion.div>
    </div>
  )
}