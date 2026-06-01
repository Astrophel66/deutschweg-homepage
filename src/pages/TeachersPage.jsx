import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/axios'
import Avatar from '../components/ui/Avatar.jsx'
import Button from '../components/ui/Button.jsx'

export default function TeachersPage() {
  const navigate = useNavigate()
  const [teachers, setTeachers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/teachers/')
      .then(res => setTeachers(res.data))
      .catch(() => setTeachers([]))
      .finally(() => setLoading(false))
  }, [])

  function getInitials(name) {
    if (!name) return '?'
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
  }

  return (
    <div className="min-h-screen bg-[var(--cream)] px-4 py-12">
      <div className="max-w-4xl mx-auto">

        <div className="mb-8">
          <h1 className="font-display text-2xl font-black text-[var(--charcoal)]">
            Our Teachers
          </h1>
          <p className="text-sm text-[var(--warm-gray)] mt-1">
            Browse verified German language teachers
          </p>
        </div>

        {loading && <p className="text-sm text-[var(--warm-gray)]">Loading...</p>}

        {!loading && teachers.length === 0 && (
          <div className="text-center py-16">
            <div className="text-4xl mb-4">👨‍🏫</div>
            <p className="text-sm text-[var(--warm-gray)]">No verified teachers yet.</p>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
          {teachers.map((t, i) => (
            <div
              key={t.id}
              className="bg-white border border-[var(--border-color)] rounded-2xl p-6 text-center hover:-translate-y-1 hover:shadow-xl transition-all duration-200"
            >
              {t.profile_picture ? (
                <img
                  src={t.profile_picture}
                  alt={t.full_name}
                  className="w-16 h-16 rounded-full object-cover mx-auto mb-4"
                />
              ) : (
                <Avatar
                  initials={getInitials(t.full_name)}
                  bg="#4F46E5"
                  size="lg"
                  className="mx-auto mb-4"
                />
              )}
              <h3 className="font-semibold text-[var(--charcoal)] mb-1">{t.full_name}</h3>
              <p className="text-xs text-[var(--warm-gray)] mb-3 line-clamp-2">
                {t.certifications || 'German Teacher'}
              </p>
              <div className="flex justify-center gap-3 text-xs text-[var(--warm-gray)] mb-4">
                <span>{t.experience_years} yrs exp</span>
                <span>{t.hourly_rate ? `$${t.hourly_rate}/hr` : '—'}</span>
              </div>
              <Button variant="ghost" size="sm" fullWidth
                onClick={() => navigate(`/teachers/${t.id}`)}
              >
                View Profile
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}