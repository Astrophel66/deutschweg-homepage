import FadeIn from '../components/shared/FadeIn.jsx'
import Button from '../components/ui/Button.jsx'

export default function CTA() {
  return (
    <section className="py-28 bg-[var(--charcoal)] text-center">
      <div className="max-w-5xl mx-auto px-6">
        <FadeIn>
          <h2 className="font-display text-5xl font-black text-white tracking-tight leading-tight mb-4">
            Start Your<br />
            <span className="text-[var(--gold-light)]">German Journey</span> Today
          </h2>
        </FadeIn>
        <FadeIn delay={0.15}>
          <p className="text-lg text-white/50 mb-10 max-w-lg mx-auto leading-relaxed">
            Learn from expert teachers, access premium resources, and achieve your German goals faster.
          </p>
        </FadeIn>
        <FadeIn delay={0.25}>
          <div className="flex gap-3 justify-center flex-wrap">
            <Button variant="white" size="lg">Get Started — It's Free</Button>
            <button className="px-7 py-3.5 text-base font-semibold text-white border-2 border-white/20 rounded-xl transition-all hover:border-white/60">
              Explore Courses
            </button>
          </div>
        </FadeIn>
      </div>
    </section>
  )
}
