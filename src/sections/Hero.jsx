import { motion } from 'framer-motion'
import FadeIn from '../components/shared/FadeIn.jsx'
import Button from '../components/ui/Button.jsx'
import ProgressBar from '../components/ui/ProgressBar.jsx'
import Avatar from '../components/ui/Avatar.jsx'

// Small floating card used in the hero visual
function FloatCard({ children, className, animY, delay = 0 }) {
  return (
    <motion.div
      className={`absolute bg-white border border-[var(--border-color)] rounded-2xl p-4 shadow-lg text-sm ${className}`}
      animate={{ y: [0, animY, 0] }}
      transition={{ repeat: Infinity, duration: 4 + delay, ease: 'easeInOut', delay }}
    >
      {children}
    </motion.div>
  )
}

export default function Hero() {
  const badges = ['A1–C2 Learning', 'Live Classes', 'Shared PDFs', 'Expert Teachers']

  return (
    <section className="pt-32 pb-20 bg-[var(--cream)]">
      <div className="max-w-5xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">

          {/* Left — text */}
          <div>
            <FadeIn>
              <div className="inline-flex items-center gap-2 bg-[var(--gold-light)] text-[var(--gold-brand)] px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide mb-6">
                🇩🇪 German Learning Platform
              </div>
            </FadeIn>
            <FadeIn delay={0.1}>
              <h1 className="font-display text-6xl font-black leading-[1.05] tracking-tight text-[var(--charcoal)] mb-5">
                Learn German<br />
                <span className="text-[var(--red-brand)]">Smarter.</span>
              </h1>
            </FadeIn>
            <FadeIn delay={0.2}>
              <p className="text-lg text-[var(--warm-gray)] leading-relaxed mb-8 max-w-md">
                Master German with expert teachers, live classes, and shared study resources designed around CEFR levels.
              </p>
            </FadeIn>
            <FadeIn delay={0.3}>
              <div className="flex gap-3 mb-10 flex-wrap">
                <Button variant="primary" size="lg">Start Learning</Button>
                <Button variant="outline" size="lg">Become a Teacher</Button>
              </div>
            </FadeIn>
            <FadeIn delay={0.4}>
              <div className="flex gap-2 flex-wrap">
                {badges.map(b => (
                  <span key={b} className="bg-white border border-[var(--border-color)] px-4 py-1.5 rounded-full text-xs font-medium text-[var(--warm-gray)]">
                    {b}
                  </span>
                ))}
              </div>
            </FadeIn>
          </div>

          {/* Right — floating visual */}
          <FadeIn delay={0.15} y={30}>
            <div className="relative h-[460px]">

              {/* Course card — top right */}
              <FloatCard className="top-4 right-4 w-52" animY={-8}>
                <p className="text-[10px] font-semibold uppercase tracking-widest text-[var(--warm-gray)] mb-1">Featured Course</p>
                <p className="font-semibold text-[var(--charcoal)] mb-2">German A1 Complete</p>
                <span className="inline-block bg-[var(--gold-light)] text-[var(--gold-brand)] px-2 py-0.5 rounded text-xs font-bold">A1 Beginner</span>
                <ProgressBar value={35} className="mt-3" />
                <p className="text-xs text-[var(--warm-gray)] mt-1.5">35% complete</p>
              </FloatCard>

              {/* Vocabulary card — left */}
              <FloatCard className="top-40 left-0 w-44" animY={6} delay={0.5}>
                <p className="text-[10px] font-semibold uppercase tracking-widest text-[var(--warm-gray)] mb-2">Vocabulary</p>
                {[['Hallo', 'Hello'], ['Danke', 'Thank you'], ['Bitte', 'Please']].map(([de, en]) => (
                  <div key={de} className="flex justify-between text-xs mb-1.5">
                    <span className="font-semibold">{de}</span>
                    <span className="text-[var(--warm-gray)]">{en}</span>
                  </div>
                ))}
              </FloatCard>

              {/* Center card — live session */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-56 bg-white border border-[var(--border-color)] rounded-3xl p-6 shadow-2xl text-center">
                <div className="w-14 h-14 bg-[var(--charcoal)] rounded-2xl flex items-center justify-center text-3xl mx-auto mb-3">🎓</div>
                <p className="font-bold text-[var(--charcoal)] mb-1">Live Session</p>
                <p className="text-xs text-[var(--warm-gray)] mb-4">B2 Grammar · Today 3PM</p>
                <Button variant="danger" size="sm" fullWidth>Join Class</Button>
              </div>

              {/* Teacher card — right bottom */}
              <FloatCard className="bottom-24 right-8 w-48" animY={-6} delay={1}>
                <div className="flex gap-2 items-center mb-2">
                  <Avatar initials="AS" bg="#C0392B" size="sm" />
                  <div>
                    <p className="font-semibold text-[var(--charcoal)] text-xs">Anna Schmidt</p>
                    <p className="text-[var(--gold-brand)] text-xs">★★★★★</p>
                  </div>
                </div>
                <p className="text-xs text-[var(--warm-gray)]">Goethe B1 Specialist</p>
                <p className="font-bold text-[var(--charcoal)] text-sm mt-1">$12/hr</p>
              </FloatCard>

              {/* Progress card — bottom left */}
              <FloatCard className="bottom-4 left-4 w-52" animY={5} delay={0.8}>
                <p className="text-[10px] font-semibold uppercase tracking-widest text-[var(--warm-gray)] mb-2">Your Progress</p>
                {[['A1', 100, 'var(--red-brand)'], ['A2', 72, 'var(--red-brand)'], ['B1', 20, 'var(--gold-brand)']].map(([lvl, val, color]) => (
                  <div key={lvl} className="mb-2">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="font-semibold">{lvl}</span>
                      <span className="text-[var(--warm-gray)]">{val}%</span>
                    </div>
                    <ProgressBar value={val} color={color} />
                  </div>
                ))}
              </FloatCard>

            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  )
}
