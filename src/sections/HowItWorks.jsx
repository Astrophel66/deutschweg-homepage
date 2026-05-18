import FadeIn from '../components/shared/FadeIn.jsx'
import SectionHeader from '../components/shared/SectionHeader.jsx'

const steps = [
  { num: '01', icon: '🔍', title: 'Choose a course or teacher', desc: 'Browse curated courses by CEFR level or find your ideal teacher in the marketplace.' },
  { num: '02', icon: '📖', title: 'Study lessons and resources', desc: 'Work through structured lessons, download PDFs, and practice vocabulary at your own pace.' },
  { num: '03', icon: '🎯', title: 'Join live classes and track progress', desc: 'Attend live sessions, get feedback, and watch your CEFR level advance on your dashboard.' },
]

export default function HowItWorks() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-5xl mx-auto px-6">
        <SectionHeader eyebrow="How It Works" title="Three steps to fluency" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((s, i) => (
            <FadeIn key={s.title} delay={i * 0.12}>
              <div className="border border-[var(--border-color)] rounded-2xl p-8 text-center bg-white">
                <p className="font-display text-6xl font-black text-[var(--border-color)] leading-none mb-4">{s.num}</p>
                <div className="w-12 h-12 bg-[var(--charcoal)] rounded-full flex items-center justify-center text-2xl mx-auto mb-5">{s.icon}</div>
                <h3 className="font-semibold text-[var(--charcoal)] mb-3 text-lg">{s.title}</h3>
                <p className="text-sm text-[var(--warm-gray)] leading-relaxed">{s.desc}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  )
}
