import FadeIn from '../components/shared/FadeIn.jsx'
import SectionHeader from '../components/shared/SectionHeader.jsx'
import Avatar from '../components/ui/Avatar.jsx'
import { testimonials } from '../data/testimonials.js'

export default function Testimonials() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-5xl mx-auto px-6">
        <SectionHeader eyebrow="Student Stories" title="Real results, real learners" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {testimonials.map((t, i) => (
            <FadeIn key={t.id} delay={i * 0.12}>
              <div className="bg-[var(--cream)] border border-[var(--border-color)] rounded-2xl p-6">
                <div className="text-[var(--gold-brand)] text-base tracking-widest mb-4">★★★★★</div>
                <p className="text-sm text-[var(--charcoal)] leading-relaxed italic mb-6">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <Avatar initials={t.initials} bg={t.avatarBg} size="md" />
                  <div>
                    <p className="font-semibold text-sm text-[var(--charcoal)]">{t.name}</p>
                    <p className="text-xs text-[var(--warm-gray)]">{t.flag} {t.country}</p>
                  </div>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  )
}
