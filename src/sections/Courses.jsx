import FadeIn from '../components/shared/FadeIn.jsx'
import SectionHeader from '../components/shared/SectionHeader.jsx'
import Badge from '../components/ui/Badge.jsx'
import Avatar from '../components/ui/Avatar.jsx'
import { courses } from '../data/courses.js'

export default function Courses() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-5xl mx-auto px-6">
        <SectionHeader eyebrow="Featured Courses" title="Start with the right level" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {courses.map((c, i) => (
            <FadeIn key={c.id} delay={i * 0.12}>
              <div className="border border-[var(--border-color)] rounded-2xl overflow-hidden bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                {/* Thumbnail */}
                <div className="h-36 flex items-center justify-center text-5xl" style={{ background: c.thumbBg }}>
                  {c.emoji}
                </div>
                {/* Body */}
                <div className="p-5">
                  <Badge variant={c.levelVariant} className="mb-3">{c.level}</Badge>
                  <h3 className="font-semibold text-[var(--charcoal)] mb-2 leading-snug">{c.title}</h3>
                  <div className="flex gap-4 text-xs text-[var(--warm-gray)] mb-3">
                    <span>📚 {c.lessonCount} lessons</span>
                    <span>⏱ {c.durationHrs}h</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-[var(--warm-gray)] pt-3 border-t border-[var(--border-color)]">
                    <Avatar initials={c.instructorInitials} bg="#8A8680" size="sm" />
                    {c.instructor}
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
