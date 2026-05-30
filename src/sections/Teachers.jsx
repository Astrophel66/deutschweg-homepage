import { useEffect, useState } from 'react'
import FadeIn from '../components/shared/FadeIn.jsx'
import SectionHeader from '../components/shared/SectionHeader.jsx'
import Button from '../components/ui/Button.jsx'
import Avatar from '../components/ui/Avatar.jsx'
import { teachers as staticTeachers } from '../data/teachers.js'
import api from '../api/axios'

export default function Teachers() {
  const [teachers, setTeachers] = useState(staticTeachers) // start with static data

  useEffect(() => {
    // Fetch verified teachers from backend
    // Falls back to static data if API fails or returns empty
    api.get('/teachers/')
      .then(res => {
        if (res.data.length > 0) {
          setTeachers(res.data)
        }
        // if empty — keep static data showing
      })
      .catch(() => {
        // API failed — keep static data, no error shown to user
      })
  }, [])

  // Helper — get initials from full_name
  function getInitials(name) {
    if (!name) return '?'
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
  }

  return (
    <section className="py-20 bg-[var(--cream)]">
      <div className="max-w-5xl mx-auto px-6">
        <SectionHeader
          eyebrow="Teacher Marketplace"
          title="Learn from certified experts"
          subtitle="All teachers are vetted native or near-native speakers with teaching certifications."
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
          {teachers.map((t, i) => {

            // Support both static data shape and API data shape
            const isApi = !!t.full_name
            const name = isApi ? t.full_name : t.name
            const initials = isApi ? getInitials(t.full_name) : t.initials
            const specialization = isApi ? t.certifications || 'German Teacher' : t.specialization
            const price = isApi ? t.hourly_rate : t.price
            const rating = isApi ? '—' : t.rating
            const levels = isApi ? t.experience_years ? `${t.experience_years} yrs exp` : '—' : t.levels

            return (
              <FadeIn key={t.id} delay={i * 0.1}>
                <div className="bg-white border border-[var(--border-color)] rounded-2xl p-6 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                  <Avatar
                    initials={initials}
                    bg={t.avatarBg || '#4F46E5'}
                    size="lg"
                    className="mx-auto mb-4"
                  />
                  <h3 className="font-semibold text-[var(--charcoal)] mb-1">{name}</h3>
                  <p className="text-sm text-[var(--warm-gray)] mb-3">{specialization}</p>
                  <div className="flex justify-center gap-3 text-xs text-[var(--warm-gray)] mb-3">
                    <span>⭐ {rating}</span>
                    <span>{levels}</span>
                  </div>
                  <p className="font-bold text-[var(--charcoal)] mb-4">
                    {price ? `$${price}/hr` : '—'}
                  </p>
                  <Button variant="ghost" size="sm" fullWidth>View Profile</Button>
                </div>
              </FadeIn>
            )
          })}
        </div>
      </div>
    </section>
  )
}