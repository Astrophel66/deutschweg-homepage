import FadeIn from './FadeIn.jsx'

/**
 * Reusable section header — eyebrow label + title + optional subtitle.
 * Used at the top of every homepage section.
 */
export default function SectionHeader({ eyebrow, title, subtitle }) {
  return (
    <div className="text-center mb-14">
      {eyebrow && (
        <FadeIn>
          <p className="text-xs font-semibold tracking-widest uppercase text-[var(--gold-brand)] mb-3">
            {eyebrow}
          </p>
        </FadeIn>
      )}
      <FadeIn delay={0.1}>
        <h2 className="font-display text-4xl font-black text-[var(--charcoal)] tracking-tight leading-tight">
          {title}
        </h2>
      </FadeIn>
      {subtitle && (
        <FadeIn delay={0.2}>
          <p className="text-base text-[var(--warm-gray)] mt-3 max-w-lg mx-auto leading-relaxed">
            {subtitle}
          </p>
        </FadeIn>
      )}
    </div>
  )
}
