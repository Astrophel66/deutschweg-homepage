import FadeIn from '../components/shared/FadeIn.jsx'
import SectionHeader from '../components/shared/SectionHeader.jsx'
import Button from '../components/ui/Button.jsx'
import Avatar from '../components/ui/Avatar.jsx'
import { teachers } from '../data/teachers.js'

export default function Teachers() {
  return (
    <section className="py-20 bg-[var(--cream)]">
      <div className="max-w-5xl mx-auto px-6">
        <SectionHeader
          eyebrow="Teacher Marketplace"
          title="Learn from certified experts"
          subtitle="All teachers are vetted native or near-native speakers with teaching certifications."
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
          {teachers.map((t, i) => (
            <FadeIn key={t.id} delay={i * 0.1}>
              <div className="bg-white border border-[var(--border-color)] rounded-2xl p-6 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                <Avatar initials={t.initials} bg={t.avatarBg} size="lg" className="mx-auto mb-4" />
                <h3 className="font-semibold text-[var(--charcoal)] mb-1">{t.name}</h3>
                <p className="text-sm text-[var(--warm-gray)] mb-3">{t.specialization}</p>
                <div className="flex justify-center gap-3 text-xs text-[var(--warm-gray)] mb-3">
                  <span>⭐ {t.rating}</span>
                  <span>{t.levels}</span>
                </div>
                <p className="font-bold text-[var(--charcoal)] mb-4">${t.price}/hr</p>
                <Button variant="ghost" size="sm" fullWidth>View Profile</Button>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  )
}
