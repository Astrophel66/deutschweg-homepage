export default function StatCard({ label, value, subtitle, badge, icon }) {
  return (
    <div className="bg-white border border-[var(--border-color)] rounded-2xl p-5">
      <div className="flex justify-between items-start mb-3">
        <p className="text-xs font-semibold text-[var(--warm-gray)] uppercase tracking-wider">
          {label}
        </p>
        {icon && (
          <div className="w-8 h-8 rounded-lg bg-[var(--cream)] flex items-center justify-center text-[var(--warm-gray)]">
            {icon}
          </div>
        )}
      </div>
      <p className="text-3xl font-black text-[var(--charcoal)] mb-1">{value}</p>
      {subtitle && (
        <p className="text-xs text-[var(--warm-gray)]">{subtitle}</p>
      )}
      {badge && (
        <div className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-green-700 bg-green-50 px-2.5 py-1 rounded-lg">
          <span>↗</span>
          <span>{badge}</span>
        </div>
      )}
    </div>
  )
}