/**
 * Horizontal progress bar — used in course cards and hero preview cards.
 */
export default function ProgressBar({ value = 0, color = 'var(--red-brand)', className = '' }) {
  return (
    <div className={`h-1.5 bg-[var(--border-color)] rounded-full overflow-hidden ${className}`}>
      <div
        className="h-full rounded-full transition-all duration-500"
        style={{ width: `${value}%`, background: color }}
      />
    </div>
  )
}
