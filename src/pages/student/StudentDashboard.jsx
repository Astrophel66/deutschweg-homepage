import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import api from '../../api/axios'

export default function StudentDashboard() {
  const { user, logout } = useAuth()

  // null = loading, false = no profile, object = has profile
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if student has a profile yet
    api.get('/students/profile/')
      .then(res => setProfile(res.data))
      .catch(err => {
        if (err.response?.status === 404) setProfile(false)
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
            <p className="text-sm text-[var(--warm-gray)] mt-1">Student Dashboard</p>
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
              Tell us your German level so we can recommend the right courses.
            </p>
            <Link
              to="/student/profile"
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
                    Level: <strong>{profile.cefr_level}</strong>
                  </span>
                  <span className="text-xs text-[var(--warm-gray)]">
                    Phone: <strong>{profile.phone || '—'}</strong>
                  </span>
                </div>
              </div>
              <Link
                to="/student/profile"
                className="text-xs text-[var(--charcoal)] font-semibold hover:underline"
              >
                Edit
              </Link>
            </div>
          </div>
        )}

        {/* Dashboard grid */}
        <div className="grid grid-cols-2 gap-4">

          {/* Book a Class */}
          <Link
            to="/scheduling/book"
            className="bg-white border border-[var(--border-color)] rounded-2xl p-5 hover:-translate-y-1 hover:shadow-lg transition-all"
          >
            <div className="text-2xl mb-2">📅</div>
            <div className="text-sm font-semibold text-[var(--charcoal)]">Book a Class</div>
            <div className="text-xs text-[var(--warm-gray)] mt-1">Schedule with a teacher</div>
          </Link>

          {/* My Bookings */}
          <Link
            to="/scheduling/bookings"
            className="bg-white border border-[var(--border-color)] rounded-2xl p-5 hover:-translate-y-1 hover:shadow-lg transition-all"
          >
            <div className="text-2xl mb-2">📋</div>
            <div className="text-sm font-semibold text-[var(--charcoal)]">My Bookings</div>
            <div className="text-xs text-[var(--warm-gray)] mt-1">View scheduled classes</div>
          </Link>

          {/* My Courses */}
          <Link
            to="/courses"
            className="bg-white border border-[var(--border-color)] rounded-2xl p-5 hover:-translate-y-1 hover:shadow-lg transition-all"
          >
            <div className="text-2xl mb-2">📚</div>
            <div className="text-sm font-semibold text-[var(--charcoal)]">My Courses</div>
            <div className="text-xs text-[var(--warm-gray)] mt-1">Browse and enroll</div>
          </Link>

          {/* Resources */}
          <Link
            to="/resources"
            className="bg-white border border-[var(--border-color)] rounded-2xl p-5 hover:-translate-y-1 hover:shadow-lg transition-all"
          >
            <div className="text-2xl mb-2">📖</div>
            <div className="text-sm font-semibold text-[var(--charcoal)]">Resources</div>
            <div className="text-xs text-[var(--warm-gray)] mt-1">Learning materials</div>
          </Link>

          {/* CEFR Progress */}
          <div className="bg-white border border-[var(--border-color)] rounded-2xl p-5">
            <div className="text-2xl mb-2">📈</div>
            <div className="text-xl font-black text-[var(--charcoal)]">
              {profile?.cefr_level || '—'}
            </div>
            <div className="text-xs text-[var(--warm-gray)] mt-1">CEFR Progress</div>
          </div>

          {/* Achievements */}
          <div className="bg-white border border-[var(--border-color)] rounded-2xl p-5">
            <div className="text-2xl mb-2">🏆</div>
            <div className="text-xl font-black text-[var(--charcoal)]">0</div>
            <div className="text-xs text-[var(--warm-gray)] mt-1">Achievements</div>
          </div>

        </div>
      </div>
    </div>
  )
}