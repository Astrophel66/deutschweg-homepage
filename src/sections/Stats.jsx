import { useRef, useEffect, useState } from 'react'
import { useInView } from 'framer-motion'
import FadeIn from '../components/shared/FadeIn.jsx'

function AnimCount({ target, suffix = '' }) {
  const [val, setVal] = useState(0)
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })

  useEffect(() => {
    if (!inView) return
    let current = 0
    const step = target / 60
    const timer = setInterval(() => {
      current += step
      if (current >= target) { setVal(target); clearInterval(timer) }
      else setVal(Math.floor(current))
    }, 16)
    return () => clearInterval(timer)
  }, [inView, target])

  return <span ref={ref}>{val.toLocaleString()}{suffix}</span>
}

const stats = [
  { target: 10000, suffix: '+', label: 'Students' },
  { target: 500,   suffix: '+', label: 'Resources' },
  { target: 120,   suffix: '+', label: 'Teachers'  },
  { target: 95,    suffix: '%', label: 'Success Rate' },
]

export default function Stats() {
  return (
    <section className="bg-white border-y border-[var(--border-color)] py-10">
      <div className="max-w-5xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-[var(--border-color)]">
          {stats.map((s, i) => (
            <FadeIn key={s.label} delay={i * 0.1}>
              <div className="text-center py-4 px-6">
                <div className="font-display text-5xl font-black text-[var(--charcoal)] leading-none">
                  <AnimCount target={s.target} suffix={s.suffix} />
                </div>
                <div className="text-sm text-[var(--warm-gray)] mt-2 font-medium">{s.label}</div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  )
}
