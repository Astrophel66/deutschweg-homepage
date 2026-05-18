import { motion } from 'framer-motion'

/**
 * Reusable Framer Motion fade-in wrapper.
 * Wraps any child in a whileInView animation — used across all sections.
 */
export default function FadeIn({ children, delay = 0, y = 20, className = '' }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}
