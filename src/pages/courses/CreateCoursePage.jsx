import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import api from '../../api/axios'

const CEFR_LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2']

export default function CreateCoursePage() {
  const navigate = useNavigate()
  const [saving, setSaving] = useState(false)
  const [apiError, setApiError] = useState('')
  const [success, setSuccess] = useState(false)

  const [form, setForm] = useState({
    title: '',
    description: '',
    cefr_level: 'A1',
    price: '0.00',
    thumbnail_url: '',
    status: 'draft',
  })

  function handleChange(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
    setApiError('')
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSaving(true)
    try {
      const res = await api.post('/courses/', form)
      setSuccess(true)
      setTimeout(() => navigate(`/courses/${res.data.id}`), 1500)
    } catch (err) {
      setApiError(err.response?.data?.error || 'Failed to create course.')
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
          Create Course
        </h1>
        <p className="text-sm text-[var(--warm-gray)] mb-8">
          Build a structured German learning path.
        </p>

        {success && (
          <div className="bg-green-50 text-green-700 text-sm font-medium px-4 py-3 rounded-xl mb-6">
            Course created! Redirecting…
          </div>
        )}

        {apiError && (
          <div className="bg-[var(--red-muted)] text-[var(--red-brand)] text-sm font-medium px-4 py-3 rounded-xl mb-6">
            {apiError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white border border-[var(--border-color)] rounded-2xl p-8 space-y-5">

          <Field label="Title">
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="e.g. German for Beginners A1"
              required
              className={inputCls()}
            />
          </Field>

          <Field label="Description">
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="What will students learn?"
              rows={3}
              className={inputCls()}
            />
          </Field>

          <Field label="CEFR Level">
            <div className="grid grid-cols-6 gap-2">
              {CEFR_LEVELS.map(level => (
                <button
                  key={level}
                  type="button"
                  onClick={() => setForm(prev => ({ ...prev, cefr_level: level }))}
                  className={`py-2 rounded-xl border text-xs font-semibold transition-all ${
                    form.cefr_level === level
                      ? 'border-[var(--charcoal)] bg-[var(--charcoal)] text-white'
                      : 'border-[var(--border-color)] text-[var(--charcoal)] hover:border-zinc-400'
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
          </Field>

          <Field label="Price (USD) — set 0 for free">
            <input
              type="number"
              name="price"
              value={form.price}
              onChange={handleChange}
              placeholder="0.00"
              min="0"
              step="0.01"
              className={inputCls()}
            />
          </Field>

          <Field label="Thumbnail URL (optional)">
            <input
              type="url"
              name="thumbnail_url"
              value={form.thumbnail_url}
              onChange={handleChange}
              placeholder="https://..."
              className={inputCls()}
            />
          </Field>

          <Field label="Status">
            <div className="grid grid-cols-2 gap-2">
              {['draft', 'published'].map(s => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setForm(prev => ({ ...prev, status: s }))}
                  className={`py-2 rounded-xl border text-xs font-semibold transition-all capitalize ${
                    form.status === s
                      ? 'border-[var(--charcoal)] bg-[var(--charcoal)] text-white'
                      : 'border-[var(--border-color)] text-[var(--charcoal)] hover:border-zinc-400'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </Field>

          <button
            type="submit"
            disabled={saving}
            className="w-full py-3 bg-[var(--charcoal)] text-white rounded-xl text-sm font-semibold tracking-wide transition-all hover:bg-zinc-800 hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
          >
            {saving ? 'Creating…' : 'Create Course'}
          </button>

        </form>
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