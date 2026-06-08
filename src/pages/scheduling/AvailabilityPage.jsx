import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import api from '../../api/axios'

import DashboardLayout from '../../components/layout/DashboardLayout'

const DAYS = [
  { value: 0, label: 'Monday' },
  { value: 1, label: 'Tuesday' },
  { value: 2, label: 'Wednesday' },
  { value: 3, label: 'Thursday' },
  { value: 4, label: 'Friday' },
  { value: 5, label: 'Saturday' },
  { value: 6, label: 'Sunday' },
]

export default function AvailabilityPage() {
  const [slots, setSlots] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [apiError, setApiError] = useState('')
  const [success, setSuccess] = useState('')

  const [form, setForm] = useState({
    day_of_week: 0,
    start_time: '',
    end_time: '',
  })

  useEffect(() => {
    fetchSlots()
  }, [])

  function fetchSlots() {
    api.get('/scheduling/availability/')
      .then(res => setSlots(res.data))
      .catch(() => setSlots([]))
      .finally(() => setLoading(false))
  }

  function handleChange(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
    setApiError('')
  }

  async function handleAdd(e) {
    e.preventDefault()
    setSaving(true)
    setApiError('')
    try {
      await api.post('/scheduling/availability/', form)
      setSuccess('Slot added!')
      setForm({ day_of_week: 0, start_time: '', end_time: '' })
      fetchSlots()
      setTimeout(() => setSuccess(''), 2000)
    } catch (err) {
      setApiError(err.response?.data?.non_field_errors?.[0] || 'Failed to add slot.')
    } finally {
      setSaving(false)
    }
  }

  async function handleToggle(slot) {
    try {
      await api.patch(`/scheduling/availability/${slot.id}/`, {
        is_active: !slot.is_active
      })
      fetchSlots()
    } catch {
      setApiError('Failed to update slot.')
    }
  }

  async function handleDelete(id) {
    try {
      await api.delete(`/scheduling/availability/${id}/`)
      fetchSlots()
    } catch {
      setApiError('Failed to delete slot.')
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
          My Availability
        </h1>
        <p className="text-sm text-[var(--warm-gray)] mb-8">
          Set your available time slots for students to book.
        </p>

        {/* Add slot form */}
        <form onSubmit={handleAdd} className="bg-white border border-[var(--border-color)] rounded-2xl p-6 mb-6 space-y-4">
          <h2 className="font-semibold text-[var(--charcoal)]">Add New Slot</h2>

          {success && (
            <div className="bg-green-50 text-green-700 text-xs font-medium px-3 py-2 rounded-xl">
              {success}
            </div>
          )}
          {apiError && (
            <div className="bg-[var(--red-muted)] text-[var(--red-brand)] text-xs font-medium px-3 py-2 rounded-xl">
              {apiError}
            </div>
          )}

          <Field label="Day">
            <select
              name="day_of_week"
              value={form.day_of_week}
              onChange={handleChange}
              className={inputCls()}
            >
              {DAYS.map(d => (
                <option key={d.value} value={d.value}>{d.label}</option>
              ))}
            </select>
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Start Time">
              <input
                type="time"
                name="start_time"
                value={form.start_time}
                onChange={handleChange}
                required
                className={inputCls()}
              />
            </Field>
            <Field label="End Time">
              <input
                type="time"
                name="end_time"
                value={form.end_time}
                onChange={handleChange}
                required
                className={inputCls()}
              />
            </Field>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full py-2.5 bg-[var(--charcoal)] text-white rounded-xl text-sm font-semibold hover:bg-zinc-800 transition-all disabled:opacity-60"
          >
            {saving ? 'Adding…' : 'Add Slot'}
          </button>
        </form>

        {/* Existing slots */}
        <div className="bg-white border border-[var(--border-color)] rounded-2xl p-6">
          <h2 className="font-semibold text-[var(--charcoal)] mb-4">Your Slots</h2>

          {loading && <p className="text-sm text-[var(--warm-gray)]">Loading...</p>}

          {!loading && slots.length === 0 && (
            <p className="text-sm text-[var(--warm-gray)]">No slots added yet.</p>
          )}

          <div className="space-y-3">
            {slots.map(slot => (
              <div
                key={slot.id}
                className="flex items-center justify-between p-4 bg-[var(--cream)] rounded-xl"
              >
                <div>
                  <p className="text-sm font-semibold text-[var(--charcoal)]">{slot.day_name}</p>
                  <p className="text-xs text-[var(--warm-gray)]">
                    {slot.start_time} — {slot.end_time}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  {/* Active toggle */}
                  <button
                    onClick={() => handleToggle(slot)}
                    className={`text-xs font-semibold px-3 py-1 rounded-lg transition-all ${
                      slot.is_active
                        ? 'bg-green-100 text-green-700'
                        : 'bg-zinc-100 text-zinc-500'
                    }`}
                  >
                    {slot.is_active ? 'Active' : 'Inactive'}
                  </button>
                  {/* Delete */}
                  <button
                    onClick={() => handleDelete(slot.id)}
                    className="text-xs text-[var(--red-brand)] hover:underline"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  )
}

function Field({ label, children }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-[var(--charcoal)] tracking-wide mb-1.5">
        {label}
      </label>
      {children}
    </div>
  )
}

const inputCls = () => `
  w-full px-3.5 py-2.5 rounded-xl border text-sm font-medium
  bg-[var(--cream)] text-[var(--charcoal)] placeholder:text-[var(--warm-gray)]
  outline-none transition-all duration-200 font-sans
  border-[var(--border-color)] focus:border-[var(--charcoal)] focus:bg-white
`