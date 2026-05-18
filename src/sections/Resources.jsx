import FadeIn from '../components/shared/FadeIn.jsx'
import SectionHeader from '../components/shared/SectionHeader.jsx'
import Badge from '../components/ui/Badge.jsx'
import { resources } from '../data/resources.js'

const iconBg = { pdf: 'bg-red-100', xlsx: 'bg-emerald-100', mp3: 'bg-blue-100', doc: 'bg-[var(--gold-light)]' }

export default function Resources() {
  return (
    <section className="py-20 bg-[var(--cream)]">
      <div className="max-w-5xl mx-auto px-6">
        <SectionHeader
          eyebrow="Shared Resource Library"
          title="Community-powered study materials"
          subtitle="Browse PDFs, worksheets, audio packs and practice tests shared by teachers and students."
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {resources.map((r, i) => (
            <FadeIn key={r.id} delay={i * 0.07}>
              <div className="bg-white border border-[var(--border-color)] rounded-2xl p-5 flex items-start gap-4 transition-all duration-200 hover:border-[var(--charcoal)] hover:translate-x-1">
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-xl flex-shrink-0 ${iconBg[r.type]}`}>
                  {r.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-[var(--charcoal)] text-sm mb-1 leading-snug">{r.title}</h4>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs text-[var(--warm-gray)]">{r.category}</span>
                    <Badge variant="gold" className="text-[10px] px-2">{r.level}</Badge>
                  </div>
                  <button className="text-xs font-semibold text-[var(--red-brand)] border border-[var(--red-muted)] px-3 py-1 rounded-lg transition-all hover:bg-[var(--red-brand)] hover:text-white">
                    Download
                  </button>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  )
}
