/**
 * Reusable Button component.
 * variant: 'primary' | 'ghost' | 'outline' | 'danger' | 'white'
 * size: 'sm' | 'md' | 'lg'
 */
const variants = {
  primary: 'bg-[var(--charcoal)] text-white border-transparent hover:bg-zinc-800',
  ghost:   'bg-transparent text-[var(--charcoal)] border-[var(--border-color)] hover:border-[var(--charcoal)]',
  outline: 'bg-transparent text-[var(--charcoal)] border-2 border-[var(--border-color)] hover:border-[var(--charcoal)]',
  danger:  'bg-[var(--red-brand)] text-white border-transparent hover:bg-red-700',
  white:   'bg-white text-[var(--charcoal)] border-transparent hover:bg-[var(--cream)]',
}
const sizes = {
  sm: 'px-4 py-2 text-sm rounded-lg',
  md: 'px-5 py-2.5 text-sm rounded-lg',
  lg: 'px-7 py-3.5 text-base rounded-xl',
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  fullWidth = false,
  ...props
}) {
  return (
    <button
      className={`
        inline-flex items-center justify-center font-semibold border
        transition-all duration-200 cursor-pointer
        ${variants[variant]} ${sizes[size]}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  )
}
