import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import api from '../../api/axios'

export default function AddLessonPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [saving, setSaving] = useState(false)
  const [apiError, setApiError] = useState('')
  const [success, setSuccess] = useState(false)
  const [resources, setResources] = useState([])

  const [form, setForm] = useState({
    title: '',
    description: '',
    order: 1,
    video_url: '',
    text_content: '',
    resource_ids: [],
  })

  // Fetch available resources to attach
  useEffect(() => {
    api.get('/resources/')
      .then(res => setResources(res.data))
      .catch(() => {})
  }, [])

  function handleChange(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
    setApiError('')
  }

  function toggleResource(resourceId) {
    setForm(prev => ({
      ...prev,
      resource_ids: prev.resource_ids.includes(resourceId)
        ? prev.resource_ids.filter(id => id !== resourceId)
        : [...prev.resource_ids, resourceId]
    }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSaving(true)
    try {
      await api.post(`/courses/${id}/lessons/`, form)
      setSuccess(true)
      setTimeout(() => navigate(`/courses/${id}`), 1500)
    } catch (err) {
      setApiError(err.response?.data?.error || 'Failed to add lesson.')
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
          Add Lesson
        </h1>
        <p className="text-sm text-[var(--warm-gray)] mb-8">
          Add a new lesson to this course.
        </p>

        {success && (
          <div className="bg-green-50 text-green-700 text-sm font-medium px-4 py-3 rounded-xl mb-6">
            Lesson added! Redirecting…
          </div>
        )}

        {apiError && (
          <div className="bg-[var(--red-muted)] text-[var(--red-brand)] text-sm font-medium px-4 py-3 rounded-xl mb-6">
            {apiError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white border border-[var(--border-color)] rounded-2xl p-8 space-y-5">

          <Field label="Lesson Title">
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="e.g. Introduction to German Alphabet"
              required
              className={inputCls()}
            />
          </Field>

          <Field label="Description">
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="What will students learn in this lesson?"
              rows={2}
              className={inputCls()}
            />
          </Field>

          <Field label="Order">
            <input
              type="number"
              name="order"
              value={form.order}
              onChange={handleChange}
              min="1"
              className={inputCls()}
            />
          </Field>

          <Field label="Video URL (optional)">
            <input
              type="url"
              name="video_url"
              value={form.video_url}
              onChange={handleChange}
              placeholder="https://youtube.com/..."
              className={inputCls()}
            />
          </Field>

          <Field label="Text Content (optional)">
            <textarea
              name="text_content"
              value={form.text_content}
              onChange={handleChange}
              placeholder="Write lesson content here..."
              rows={4}
              className={inputCls()}
            />
          </Field>

          {/* Attach resources from library */}
          {resources.length > 0 && (
            <Field label="Attach Resources (optional)">
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {resources.map(r => (
                  <label
                    key={r.id}
                    className="flex items-center gap-3 p-3 bg-[var(--cream)] rounded-xl cursor-pointer hover:bg-zinc-100 transition-all"
                  >
                    <input
                      type="checkbox"
                      checked={form.resource_ids.includes(r.id)}
                      onChange={() => toggleResource(r.id)}
                      className="rounded"
                    />
                    <span className="text-xs font-medium text-[var(--charcoal)]">
                      {r.title}
                    </span>
                    <span className="text-xs text-[var(--warm-gray)] ml-auto">
                      {r.resource_type}
                    </span>
                  </label>
                ))}
              </div>
            </Field>
          )}

          <button
            type="submit"
            disabled={saving}
            className="w-full py-3 bg-[var(--charcoal)] text-white rounded-xl text-sm font-semibold tracking-wide transition-all hover:bg-zinc-800 hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
          >
            {saving ? 'Adding…' : 'Add Lesson'}
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