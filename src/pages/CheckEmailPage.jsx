import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

// Shown immediately after registration
// User hasn't verified yet — just tell them to check inbox
export default function CheckEmailPage() {
  return (
    <div className="min-h-screen bg-[var(--cream)] flex items-center justify-center px-4">
      <motion.div
        className="w-full max-w-sm text-center"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="text-5xl mb-6">📬</div>

        <h1 className="font-display text-2xl font-black text-[var(--charcoal)] mb-3">
          Check your email
        </h1>

        <p className="text-sm text-[var(--warm-gray)] leading-relaxed mb-8">
          We sent a verification link to your email address.
          Click the link to activate your account.
        </p>

        <p className="text-xs text-[var(--warm-gray)]">
          Already verified?{' '}
          <Link to="/login" className="text-[var(--charcoal)] font-semibold hover:underline">
            Sign in
          </Link>
        </p>
      </motion.div>
    </div>
  )
}