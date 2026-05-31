import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import api from '../../api/axios'

const RESOURCE_TYPES = [
  { key: 'pdf', label: 'PDF Notes', needsFile: true },
  { key: 'text', label: 'Text Notes', needsFile: false },
  { key: 'audio', label: 'Audio File', needsFile: true },
  { key: 'image', label: 'Image / Diagram', needsFile: true },
  { key: 'vocabulary', label: 'Vocabulary List', needsFile: false },
  { key: 'practice_test', label: 'Practice Test', needsFile: false },
]

const CEFR_LEVELS = ['', 'A1', 'A2', 'B1', 'B2', 'C1', 'C2']

export default function UploadResourcePage() {
  const navigate = useNavigate()
  const [saving, setSaving] = useState(false)
  const [apiError, setApiError] = useState('')
  const [success, setSuccess] = useState(false)

  const [form, setForm] = useState({
    title: '',
    description: '',
    resource_type: 'pdf',
    cefr_level: '',
    text_content: '',
  })
  const [file, setFile] = useState(null)

  // Check if current resource type needs a file upload
  const currentType = RESOURCE_TYPES.find(t => t.key === form.resource_type)
  const needsFile = currentType?.needsFile

  function handleChange(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
    setApiError('')
  }

  function handleFileChange(e) {
    setFile(e.target.files[0])
    setApiError('')
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSaving(true)
    setApiError('')

    try {
      // Use FormData because we're sending a file
      const formData = new FormData()
      formData.append('title', form.title)
      formData.append('description', form.description)
      formData.append('resource_type', form.resource_type)
      formData.append('cefr_level', form.cefr_level)
      formData.append('text_content', form.text_content)
      if (file) formData.append('file', file)

      await api.post('/resources/upload/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })

      setSuccess(true)
      setTimeout(() => navigate('/resources'), 1500)
    } catch (err) {
      setApiError(
        err.response?.data?.error ||
        err.response?.data?.non_field_errors?.[0] ||
        'Upload failed. Try again.'
      )
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
          Upload Resource
        </h1>
        <p className="text-sm text-[var(--warm-gray)] mb-8">
          Add learning materials for students.
        </p>

        {success && (
          <div className="bg-green-50 text-green-700 text-sm font-medium px-4 py-3 rounded-xl mb-6">
            Resource uploaded! Redirecting…
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
              placeholder="e.g. A1 Vocabulary Sheet"
              required
              className={inputCls()}
            />
          </Field>

          <Field label="Resource Type">
            <div className="grid grid-cols-3 gap-2">
              {RESOURCE_TYPES.map(type => (
                <button
                  key={type.key}
                  type="button"
                  onClick={() => {
                    setForm(prev => ({ ...prev, resource_type: type.key }))
                    setFile(null)
                  }}
                  className={`py-2 px-3 rounded-xl border text-xs font-semibold transition-all ${
                    form.resource_type === type.key
                      ? 'border-[var(--charcoal)] bg-[var(--charcoal)] text-white'
                      : 'border-[var(--border-color)] text-[var(--charcoal)] hover:border-zinc-400'
                  }`}
                >
                  {type.label}
                </button>
              ))}
            </div>
          </Field>

          <Field label="CEFR Level (optional)">
            <select
              name="cefr_level"
              value={form.cefr_level}
              onChange={handleChange}
              className={inputCls()}
            >
              {CEFR_LEVELS.map(level => (
                <option key={level} value={level}>
                  {level || 'All levels'}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Description (optional)">
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Brief description of this resource..."
              rows={2}
              className={inputCls()}
            />
          </Field>

          {/* File upload — only for pdf, audio, image */}
          {needsFile && (
            <Field label="File">
              <input
                type="file"
                onChange={handleFileChange}
                accept={
                  form.resource_type === 'pdf' ? '.pdf' :
                  form.resource_type === 'audio' ? '.mp3,.wav,.ogg' :
                  form.resource_type === 'image' ? '.jpg,.jpeg,.png,.webp,.gif' :
                  '*'
                }
                className="w-full text-sm text-[var(--warm-gray)] file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-[var(--cream)] file:text-[var(--charcoal)] hover:file:bg-zinc-100"
              />
            </Field>
          )}

          {/* Text content — for text, vocabulary, practice_test */}
          {!needsFile && (
            <Field label="Content">
              <textarea
                name="text_content"
                value={form.text_content}
                onChange={handleChange}
                placeholder={
                  form.resource_type === 'vocabulary'
                    ? 'Word: Translation\nHaus: House\nAuto: Car...'
                    : form.resource_type === 'practice_test'
                    ? 'Question 1: ...\nQuestion 2: ...'
                    : 'Write your notes here...'
                }
                rows={6}
                className={inputCls()}
              />
            </Field>
          )}

          <button
            type="submit"
            disabled={saving}
            className="w-full py-3 bg-[var(--charcoal)] text-white rounded-xl text-sm font-semibold tracking-wide transition-all hover:bg-zinc-800 hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
          >
            {saving ? 'Uploading…' : 'Upload Resource'}
          </button>

        </form>
      </motion.div>
    </div>
  )
}

// ── Helpers ──────────────────────────────────────────────────────────────────

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