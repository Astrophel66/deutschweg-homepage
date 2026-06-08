import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import DashboardLayout from '../../components/layout/DashboardLayout'
import api from '../../api/axios'
import toast from 'react-hot-toast'

const RESOURCE_TYPES = [
  { key: 'pdf', label: 'PDF Notes', icon: '📄', needsFile: true },
  { key: 'text', label: 'Text Notes', icon: '📝', needsFile: false },
  { key: 'audio', label: 'Audio File', icon: '🎧', needsFile: true },
  { key: 'image', label: 'Image / Diagram', icon: '🖼️', needsFile: true },
  { key: 'vocabulary', label: 'Vocabulary List', icon: '📚', needsFile: false },
  { key: 'practice_test', label: 'Practice Test', icon: '✏️', needsFile: false },
]

const CEFR_LEVELS = ['', 'A1', 'A2', 'B1', 'B2', 'C1', 'C2']

export default function UploadResourcePage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [saving, setSaving] = useState(false)

  const [form, setForm] = useState({
    title: '',
    description: '',
    resource_type: 'pdf',
    cefr_level: '',
    text_content: '',
    preview_text: '',
    is_premium: false,
    preview_duration: 30,
  })
  const [file, setFile] = useState(null)

  const currentType = RESOURCE_TYPES.find(t => t.key === form.resource_type)
  const needsFile = currentType?.needsFile

  function handleChange(e) {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    setForm(prev => ({ ...prev, [e.target.name]: value }))
  }

  function handleFileChange(e) {
    setFile(e.target.files[0])
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSaving(true)

    try {
      const formData = new FormData()
      Object.entries(form).forEach(([key, val]) => {
        formData.append(key, val)
      })
      if (file) formData.append('file', file)

      await api.post('/resources/upload/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })

      toast.success('Resource uploaded successfully!')
      setTimeout(() => navigate('/resources'), 1000)
    } catch (err) {
      toast.error(
        err.response?.data?.error ||
        err.response?.data?.non_field_errors?.[0] ||
        'Upload failed. Try again.'
      )
    } finally {
      setSaving(false)
    }
  }

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto space-y-6">

        {/* Header */}
        <div>
          <h1 className="font-display text-2xl font-black text-[var(--charcoal)]">
            Upload Resource
          </h1>
          <p className="text-sm text-[var(--warm-gray)] mt-1">
            Add learning materials for students.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Basic info */}
          <div className="bg-white border border-[var(--border-color)] rounded-2xl p-6 space-y-4">
            <h2 className="font-semibold text-[var(--charcoal)]">Basic Info</h2>

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

            <Field label="CEFR Level">
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
          </div>

          {/* Resource type */}
          <div className="bg-white border border-[var(--border-color)] rounded-2xl p-6">
            <h2 className="font-semibold text-[var(--charcoal)] mb-4">Resource Type</h2>
            <div className="grid grid-cols-3 gap-2">
              {RESOURCE_TYPES.map(type => (
                <button
                  key={type.key}
                  type="button"
                  onClick={() => {
                    setForm(prev => ({ ...prev, resource_type: type.key }))
                    setFile(null)
                  }}
                  className={`py-3 px-2 rounded-xl border text-center transition-all ${
                    form.resource_type === type.key
                      ? 'border-[var(--charcoal)] bg-[var(--charcoal)] text-white'
                      : 'border-[var(--border-color)] text-[var(--charcoal)] hover:border-zinc-400'
                  }`}
                >
                  <span className="block text-xl mb-1">{type.icon}</span>
                  <span className="block text-xs font-semibold">{type.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* File or text content */}
          <div className="bg-white border border-[var(--border-color)] rounded-2xl p-6 space-y-4">
            <h2 className="font-semibold text-[var(--charcoal)]">Content</h2>

            {needsFile ? (
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
                {file && (
                  <p className="text-xs text-green-600 mt-1">✓ {file.name}</p>
                )}
              </Field>
            ) : (
              <Field label="Content">
                <textarea
                  name="text_content"
                  value={form.text_content}
                  onChange={handleChange}
                  placeholder={
                    form.resource_type === 'vocabulary'
                      ? 'Haus: House\nAuto: Car\nSchule: School...'
                      : form.resource_type === 'practice_test'
                      ? 'Question 1: ...\nA) ...\nB) ...\nCorrect: A\n\nQuestion 2: ...'
                      : 'Write your notes here...'
                  }
                  rows={8}
                  className={inputCls()}
                />
              </Field>
            )}
          </div>

          {/* Premium settings */}
          <div className="bg-white border border-[var(--border-color)] rounded-2xl p-6 space-y-4">
            <h2 className="font-semibold text-[var(--charcoal)]">Access Settings</h2>

            {/* Premium toggle */}
            <div className="flex items-center justify-between p-4 bg-[var(--cream)] rounded-xl">
              <div>
                <p className="text-sm font-semibold text-[var(--charcoal)]">Premium Resource</p>
                <p className="text-xs text-[var(--warm-gray)] mt-0.5">
                  Only users with granted access can view full content
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="is_premium"
                  checked={form.is_premium}
                  onChange={handleChange}
                  className="sr-only peer"
                />
                <div className="w-10 h-6 bg-zinc-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--charcoal)]"></div>
              </label>
            </div>

            {/* Preview settings — show only if premium */}
            {form.is_premium && (
              <>
                <Field label="Preview Text (shown to non-subscribers)">
                  <textarea
                    name="preview_text"
                    value={form.preview_text}
                    onChange={handleChange}
                    placeholder="Enter a short preview of the content..."
                    rows={3}
                    className={inputCls()}
                  />
                  <p className="text-xs text-[var(--warm-gray)] mt-1">
                    Leave empty to auto-generate from first 300 characters
                  </p>
                </Field>

                {/* Preview duration — only for audio */}
                {form.resource_type === 'audio' && (
                  <Field label="Preview Duration (seconds)">
                    <input
                      type="number"
                      name="preview_duration"
                      value={form.preview_duration}
                      onChange={handleChange}
                      min="10"
                      max="120"
                      className={inputCls()}
                    />
                    <p className="text-xs text-[var(--warm-gray)] mt-1">
                      How many seconds of audio to play for free (default: 30s)
                    </p>
                  </Field>
                )}
              </>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={saving}
            className="w-full py-3 bg-[var(--charcoal)] text-white rounded-xl text-sm font-semibold tracking-wide transition-all hover:bg-zinc-800 hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
          >
            {saving ? 'Uploading…' : 'Upload Resource'}
          </button>

        </form>
      </div>
    </DashboardLayout>
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