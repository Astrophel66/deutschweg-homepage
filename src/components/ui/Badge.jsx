/**
 * Small pill badge — used for CEFR level tags and category labels.
 * variant: 'gold' | 'red' | 'green' | 'blue' | 'gray'
 */
const variants = {
  gold:  'bg-[var(--gold-light)] text-[var(--gold-brand)]',
  red:   'bg-[var(--red-muted)] text-[var(--red-brand)]',
  green: 'bg-emerald-100 text-emerald-700',
  blue:  'bg-blue-100 text-blue-700',
  gray:  'bg-zinc-100 text-zinc-600',
}

export default function Badge({ children, variant = 'gold', className = '' }) {
  return (
    <span className={`inline-block px-2.5 py-0.5 rounded-md text-xs font-bold ${variants[variant]} ${className}`}>
      {children}
    </span>
  )
}
