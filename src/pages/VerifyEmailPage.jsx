import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import api from '../api/axios'

// This page is opened when user clicks the link in their email
// URL looks like: /verify-email?token=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
// It reads the token from URL, sends it to backend, shows success or error
export default function VerifyEmailPage() {
  const [searchParams] = useSearchParams()
  const [status, setStatus] = useState('loading') // 'loading' | 'success' | 'error'
  const [message, setMessage] = useState('')

  useEffect(() => {
    const token = searchParams.get('token')

    // If no token in URL — show error immediately
    if (!token) {
      setStatus('error')
      setMessage('Invalid verification link.')
      return
    }

    // Send token to backend POST /api/auth/verify-email/
    api.post('/auth/verify-email/', { token })
      .then(() => {
        setStatus('success')
      })
      .catch((err) => {
        setStatus('error')
        setMessage(
          err.response?.data?.error || 'Verification failed. Link may have expired.'
        )
      })
  }, []) // runs once on mount

  return (
    <div className="min-h-screen bg-[var(--cream)] flex items-center justify-center px-4">
      <motion.div
        className="w-full max-w-sm text-center"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Loading state */}
        {status === 'loading' && (
          <>
            <div className="text-5xl mb-6">⏳</div>
            <h1 className="font-display text-2xl font-black text-[var(--charcoal)] mb-3">
              Verifying your email…
            </h1>
            <p className="text-sm text-[var(--warm-gray)]">Please wait a moment.</p>
          </>
        )}

        {/* Success state */}
        {status === 'success' && (
          <>
            <div className="text-5xl mb-6">✅</div>
            <h1 className="font-display text-2xl font-black text-[var(--charcoal)] mb-3">
              Email verified!
            </h1>
            <p className="text-sm text-[var(--warm-gray)] mb-8">
              Your account is now active. You can sign in.
            </p>
            <Link
              to="/login"
              className="inline-block px-6 py-3 bg-[var(--charcoal)] text-white rounded-xl text-sm font-semibold hover:bg-zinc-800 transition-all"
            >
              Sign in
            </Link>
          </>
        )}

        {/* Error state */}
        {status === 'error' && (
          <>
            <div className="text-5xl mb-6">❌</div>
            <h1 className="font-display text-2xl font-black text-[var(--charcoal)] mb-3">
              Verification failed
            </h1>
            <p className="text-sm text-[var(--warm-gray)] mb-8">{message}</p>
            <Link
              to="/register"
              className="inline-block px-6 py-3 bg-[var(--charcoal)] text-white rounded-xl text-sm font-semibold hover:bg-zinc-800 transition-all"
            >
              Register again
            </Link>
          </>
        )}
      </motion.div>
    </div>
  )
}