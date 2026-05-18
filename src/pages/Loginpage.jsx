import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Eye, EyeOff } from 'lucide-react'
import { useAuth } from '../../context/AuthContext.jsx'

export default function LoginPage() {
  const navigate = useNavigate()
  const { login, loading } = useAuth()

  const [form, setForm] = useState({ email: '', password: '' })
  const [showPw, setShowPw] = useState(false)
  const [errors, setErrors] = useState({})
  const [apiError, setApiError] = useState('')

  function handleChange(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
    setErrors(prev => ({ ...prev, [e.target.name]: '' }))
    setApiError('')
  }

  function validate() {
    const errs = {}
    if (!form.email)    errs.email    = 'Email is required'
    if (!form.password) errs.password = 'Password is required'
    return errs
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    const result = await login(form)
    if (result.success) {
      // TODO: redirect based on user.role — 'student' | 'teacher' | 'admin'
      navigate('/student/dashboard')
    } else {
      setApiError(result.error || 'Invalid email or password')
    }
  }

  return (
    <div className="min-h-screen bg-[var(--cream)] flex items-center justify-center px-4 py-12">
      <motion.div
        className="w-full max-w-sm"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Logo */}
        <Link to="/" className="block text-center font-display text-2xl font-black text-[var(--charcoal)] mb-8">
          Deutsch<span className="text-[var(--red-brand)]">Weg</span>
        </Link>

        {/* Card */}
        <div className="bg-white border border-[var(--border-color)] rounded-2xl p-8">

          {/* Tab-style header */}
          <div className="flex bg-[var(--cream)] rounded-xl p-1 mb-6">
            <div className="flex-1 text-center py-2 bg-white rounded-lg border border-[var(--border-color)] text-sm font-semibold text-[var(--charcoal)] shadow-sm">
              Sign in
            </div>
            <Link
              to="/register"
              className="flex-1 text-center py-2 rounded-lg text-sm font-medium text-[var(--warm-gray)] hover:text-[var(--charcoal)] transition-colors"
            >
              Create account
            </Link>
          </div>

          {/* Google */}
          <button
            type="button"
            className="w-full flex items-center justify-center gap-3 py-2.5 border border-[var(--border-color)] rounded-xl text-sm font-medium text-[var(--charcoal)] bg-white hover:border-[var(--charcoal)] transition-all"
          >
            <GoogleIcon />
            Continue with Google
          </button>

          <Divider />

          {/* API error */}
          {apiError && (
            <div className="bg-[var(--red-muted)] text-[var(--red-brand)] text-xs font-medium px-4 py-2.5 rounded-xl mb-4">
              {apiError}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            {/* Email */}
            <Field label="Email" error={errors.email}>
              <input
                type="email"
                name="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
                autoComplete="email"
                className={inputCls(errors.email)}
              />
            </Field>

            {/* Password */}
            <Field label="Password" error={errors.password} extra={
              <Link to="/forgot-password" className="text-xs text-[var(--red-brand)] font-medium hover:underline">
                Forgot?
              </Link>
            }>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'}
                  name="password"
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={handleChange}
                  autoComplete="current-password"
                  className={inputCls(errors.password)}
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--warm-gray)] hover:text-[var(--charcoal)] transition-colors"
                  aria-label={showPw ? 'Hide password' : 'Show password'}
                >
                  {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </Field>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-1 py-3 bg-[var(--charcoal)] text-white rounded-xl text-sm font-semibold tracking-wide transition-all hover:bg-zinc-800 hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>

          <p className="text-xs text-[var(--warm-gray)] text-center mt-5 leading-relaxed">
            By signing in you agree to our{' '}
            <a href="#" className="text-[var(--charcoal)] font-medium underline">Terms</a>
            {' & '}
            <a href="#" className="text-[var(--charcoal)] font-medium underline">Privacy Policy</a>
          </p>
        </div>
      </motion.div>
    </div>
  )
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function Field({ label, error, extra, children }) {
  return (
    <div className="mb-4">
      <div className="flex justify-between items-center mb-1.5">
        <label className="text-xs font-semibold text-[var(--charcoal)] tracking-wide">{label}</label>
        {extra}
      </div>
      {children}
      {error && <p className="text-xs text-[var(--red-brand)] mt-1.5 font-medium">{error}</p>}
    </div>
  )
}

function Divider() {
  return (
    <div className="flex items-center gap-3 my-4">
      <div className="flex-1 h-px bg-[var(--border-color)]" />
      <span className="text-xs text-[var(--warm-gray)]">or</span>
      <div className="flex-1 h-px bg-[var(--border-color)]" />
    </div>
  )
}

function GoogleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 18 18" aria-hidden="true">
      <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z"/>
      <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"/>
      <path fill="#FBBC05" d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"/>
      <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"/>
    </svg>
  )
}

const inputCls = (err) => `
  w-full px-3.5 py-2.5 rounded-xl border text-sm font-medium
  bg-[var(--cream)] text-[var(--charcoal)] placeholder:text-[var(--warm-gray)]
  outline-none transition-all duration-200 font-sans
  ${err
    ? 'border-[var(--red-brand)]'
    : 'border-[var(--border-color)] focus:border-[var(--charcoal)] focus:bg-white'
  }
`