import FadeIn from '../components/shared/FadeIn.jsx'
import SectionHeader from '../components/shared/SectionHeader.jsx'
import { features } from '../data/features.js'

export default function Features() {
  return (
    <section className="py-20 bg-[var(--cream)]">
      <div className="max-w-5xl mx-auto px-6">
        <SectionHeader
          eyebrow="Why DeutschWeg"
          title="Everything you need to master German"
          subtitle="One platform combining structured learning, expert teachers, and shared resources."
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
          {features.map((f, i) => (
            <FadeIn key={f.title} delay={i * 0.08}>
              <div className="bg-white border border-[var(--border-color)] rounded-2xl p-7 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-transparent cursor-default">
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-xl mb-4 ${
                  f.accent === 'gold' ? 'bg-[var(--gold-light)]' : 'bg-[var(--red-muted)]'
                }`}>
                  {f.icon}
                </div>
                <h3 className="font-semibold text-[var(--charcoal)] mb-2">{f.title}</h3>
                <p className="text-sm text-[var(--warm-gray)] leading-relaxed">{f.desc}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  )
}
