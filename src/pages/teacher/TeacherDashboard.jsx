import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import api from '../../api/axios'

export default function TeacherDashboard() {
  const { user, logout } = useAuth()

  // null = not loaded yet, false = no profile, object = has profile
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if teacher has a profile yet
    api.get('/teachers/profile/')
      .then(res => setProfile(res.data))
      .catch(err => {
        if (err.response?.status === 404) {
          // No profile yet — prompt to create one
          setProfile(false)
        }
      })
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--cream)] flex items-center justify-center">
        <p className="text-sm text-[var(--warm-gray)]">Loading...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[var(--cream)] px-4 py-12">
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="font-display text-2xl font-black text-[var(--charcoal)]">
              Welcome, {user?.full_name} 👋
            </h1>
            <p className="text-sm text-[var(--warm-gray)] mt-1">Teacher Dashboard</p>
          </div>
          <button
            onClick={logout}
            className="text-xs text-[var(--warm-gray)] hover:text-[var(--charcoal)] font-medium transition-colors"
          >
            Sign out
          </button>
        </div>

        {/* Profile incomplete banner */}
        {profile === false && (
          <div className="bg-white border border-[var(--border-color)] rounded-2xl p-6 mb-6">
            <h2 className="font-semibold text-[var(--charcoal)] mb-2">
              Complete your profile
            </h2>
            <p className="text-sm text-[var(--warm-gray)] mb-4">
              Set up your teacher profile so students can find and book you.
            </p>
            <Link
              to="/teacher/profile"
              className="inline-block px-5 py-2.5 bg-[var(--charcoal)] text-white rounded-xl text-sm font-semibold hover:bg-zinc-800 transition-all"
            >
              Create profile
            </Link>
          </div>
        )}

        {/* Profile exists */}
        {profile && (
          <div className="bg-white border border-[var(--border-color)] rounded-2xl p-6 mb-6">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="font-semibold text-[var(--charcoal)] mb-1">Your Profile</h2>
                <p className="text-sm text-[var(--warm-gray)]">{profile.bio || 'No bio yet'}</p>
                <div className="flex gap-4 mt-3">
                  <span className="text-xs text-[var(--warm-gray)]">
                    Experience: <strong>{profile.experience_years} years</strong>
                  </span>
                  <span className="text-xs text-[var(--warm-gray)]">
                    Rate: <strong>${profile.hourly_rate}/hr</strong>
                  </span>
                  <span className={`text-xs font-semibold ${profile.is_verified ? 'text-green-600' : 'text-amber-500'}`}>
                    {profile.is_verified ? '✓ Verified' : '⏳ Pending verification'}
                  </span>
                </div>
              </div>
              <Link
                to="/teacher/profile"
                className="text-xs text-[var(--charcoal)] font-semibold hover:underline"
              >
                Edit
              </Link>
            </div>
          </div>
        )}

        {/* Placeholder cards for future features */}
        <div className="grid grid-cols-2 gap-4">
          {[
            { label: 'Upcoming Classes', value: '0', icon: '📅' },
            { label: 'My Students', value: '0', icon: '👥' },
            { label: 'Earnings', value: '$0', icon: '💰' },
            { label: 'Ratings', value: '—', icon: '⭐' },
          ].map(card => (
            <div key={card.label} className="bg-white border border-[var(--border-color)] rounded-2xl p-5">
              <div className="text-2xl mb-2">{card.icon}</div>
              <div className="text-xl font-black text-[var(--charcoal)]">{card.value}</div>
              <div className="text-xs text-[var(--warm-gray)] mt-1">{card.label}</div>
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}