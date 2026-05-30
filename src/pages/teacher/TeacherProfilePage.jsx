import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import api from '../../api/axios'

export default function TeacherProfilePage() {
  const navigate = useNavigate()

  // null = loading, false = no profile yet, object = existing profile
  const [existing, setExisting] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [apiError, setApiError] = useState('')
  const [success, setSuccess] = useState(false)

  const [form, setForm] = useState({
    bio: '',
    experience_years: '',
    certifications: '',
    intro_video_url: '',
    profile_picture: '',
    hourly_rate: '',
    phone: '',
  })

  // On mount — check if profile exists and prefill form
  useEffect(() => {
    api.get('/teachers/profile/')
      .then(res => {
        setExisting(res.data)
        // Prefill form with existing data
        setForm({
          bio: res.data.bio || '',
          experience_years: res.data.experience_years || '',
          certifications: res.data.certifications || '',
          intro_video_url: res.data.intro_video_url || '',
          profile_picture: res.data.profile_picture || '',
          hourly_rate: res.data.hourly_rate || '',
          phone: res.data.phone || '',
        })
      })
      .catch(err => {
        if (err.response?.status === 404) setExisting(false)
      })
      .finally(() => setLoading(false))
  }, [])

  function handleChange(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
    setApiError('')
    setSuccess(false)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSaving(true)
    setApiError('')

    try {
      // POST if no profile yet, PATCH if updating
      if (existing === false) {
        await api.post('/teachers/profile/', form)
      } else {
        await api.patch('/teachers/profile/', form)
      }
      setSuccess(true)
      setTimeout(() => navigate('/teacher/dashboard'), 1500)
    } catch (err) {
      setApiError(err.response?.data?.error || 'Something went wrong.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--cream)] flex items-center justify-center">
        <p className="text-sm text-[var(--warm-gray)]">Loading...</p>
      </div>
    )
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
          {existing ? 'Edit Profile' : 'Create Profile'}
        </h1>
        <p className="text-sm text-[var(--warm-gray)] mb-8">
          {existing ? 'Update your teaching profile.' : 'Set up your profile so students can find you.'}
        </p>

        {/* Success message */}
        {success && (
          <div className="bg-green-50 text-green-700 text-sm font-medium px-4 py-3 rounded-xl mb-6">
            Profile saved! Redirecting to dashboard…
          </div>
        )}

        {/* API error */}
        {apiError && (
          <div className="bg-[var(--red-muted)] text-[var(--red-brand)] text-sm font-medium px-4 py-3 rounded-xl mb-6">
            {apiError}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate className="bg-white border border-[var(--border-color)] rounded-2xl p-8 space-y-5">

          <Field label="Bio">
            <textarea
              name="bio"
              value={form.bio}
              onChange={handleChange}
              placeholder="Tell students about yourself..."
              rows={3}
              className={inputCls()}
            />
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Experience (years)">
              <input
                type="number"
                name="experience_years"
                value={form.experience_years}
                onChange={handleChange}
                placeholder="5"
                min="0"
                className={inputCls()}
              />
            </Field>
            <Field label="Hourly Rate ($)">
              <input
                type="number"
                name="hourly_rate"
                value={form.hourly_rate}
                onChange={handleChange}
                placeholder="25"
                min="0"
                className={inputCls()}
              />
            </Field>
          </div>

          <Field label="Certifications">
            <input
              type="text"
              name="certifications"
              value={form.certifications}
              onChange={handleChange}
              placeholder="Goethe-Zertifikat, TestDaF..."
              className={inputCls()}
            />
          </Field>

          <Field label="Phone">
            <input
              type="text"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="+977-9800000000"
              className={inputCls()}
            />
          </Field>

          <Field label="Intro Video URL">
            <input
              type="url"
              name="intro_video_url"
              value={form.intro_video_url}
              onChange={handleChange}
              placeholder="https://youtube.com/..."
              className={inputCls()}
            />
          </Field>

          <Field label="Profile Picture URL">
            <input
              type="url"
              name="profile_picture"
              value={form.profile_picture}
              onChange={handleChange}
              placeholder="https://..."
              className={inputCls()}
            />
          </Field>

          <button
            type="submit"
            disabled={saving}
            className="w-full py-3 bg-[var(--charcoal)] text-white rounded-xl text-sm font-semibold tracking-wide transition-all hover:bg-zinc-800 hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
          >
            {saving ? 'Saving…' : existing ? 'Update Profile' : 'Create Profile'}
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