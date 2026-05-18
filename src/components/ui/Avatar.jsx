/**
 * Initials avatar circle — used for teacher cards and testimonials.
 */
export default function Avatar({ initials, bg = '#C0392B', size = 'md', className = '' }) {
  const sizes = { sm: 'w-7 h-7 text-xs', md: 'w-10 h-10 text-sm', lg: 'w-16 h-16 text-xl' }
  return (
    <div
      className={`rounded-full flex items-center justify-center font-bold text-white flex-shrink-0 ${sizes[size]} ${className}`}
      style={{ background: bg }}
    >
      {initials}
    </div>
  )
}
