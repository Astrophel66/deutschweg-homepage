import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import DashboardLayout from '../../components/layout/DashboardLayout'
import StatCard from '../../components/ui/StatCard'
import api from '../../api/axios'

export default function TeacherDashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [profile, setProfile] = useState(null)
  const [courses, setCourses] = useState([])
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      api.get('/teachers/profile/').catch(() => null),
      api.get('/courses/my/').catch(() => null),
      api.get('/scheduling/bookings/').catch(() => null),
    ]).then(([profileRes, coursesRes, bookingsRes]) => {
      if (profileRes) setProfile(profileRes.data)
      if (coursesRes) setCourses(coursesRes.data)
      if (bookingsRes) setBookings(bookingsRes.data)
    }).finally(() => setLoading(false))
  }, [])

  const pendingBookings = bookings.filter(b => b.status === 'pending')
  const confirmedBookings = bookings.filter(b => b.status === 'confirmed')
  const totalStudents = courses.reduce((acc, c) => acc + (c.enrollment_count || 0), 0)

  return (
    <DashboardLayout>
      <div className="space-y-6">

        {/* Profile incomplete banner */}
        {!loading && !profile && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-amber-800">Complete your profile</p>
              <p className="text-xs text-amber-600 mt-0.5">Students can't find you without a complete profile</p>
            </div>
            <Link
              to="/teacher/profile"
              className="px-4 py-2 bg-amber-800 text-white rounded-xl text-xs font-semibold hover:bg-amber-900 transition-all shrink-0"
            >
              Complete now
            </Link>
          </div>
        )}

        {/* Verification banner */}
        {!loading && profile && !profile.is_verified && (
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
            <p className="text-sm font-semibold text-blue-800">⏳ Pending verification</p>
            <p className="text-xs text-blue-600 mt-0.5">Your profile is under review. You'll be notified once verified.</p>
          </div>
        )}

        {/* Stat cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard
            label="Total Students"
            value={totalStudents}
            subtitle="Across all courses"
            icon={
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
              </svg>
            }
          />
          <StatCard
            label="Upcoming Classes"
            value={confirmedBookings.length}
            subtitle="Confirmed bookings"
            icon={
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2"/>
                <line x1="16" y1="2" x2="16" y2="6"/>
                <line x1="8" y1="2" x2="8" y2="6"/>
                <line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
            }
          />
          <StatCard
            label="My Courses"
            value={courses.length}
            subtitle="Published + drafts"
            icon={
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
              </svg>
            }
          />
          <StatCard
            label="Pending Requests"
            value={pendingBookings.length}
            subtitle="Awaiting confirmation"
            badge={pendingBookings.length > 0 ? `${pendingBookings.length} new` : null}
            icon={
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <polyline points="12 6 12 12 16 14"/>
              </svg>
            }
          />
        </div>

        {/* Quick actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Create Course', icon: '📚', path: '/courses/create', desc: 'Add a new course' },
            { label: 'Set Availability', icon: '📅', path: '/scheduling/availability', desc: 'Manage time slots' },
            { label: 'View Bookings', icon: '📋', path: '/scheduling/bookings', desc: 'Manage requests' },
            { label: 'Upload Resource', icon: '📄', path: '/resources/upload', desc: 'Add learning material' },
          ].map(action => (
            <button
              key={action.label}
              onClick={() => navigate(action.path)}
              className="bg-white border border-[var(--border-color)] rounded-2xl p-5 text-left hover:-translate-y-1 hover:shadow-lg transition-all duration-200"
            >
              <div className="text-2xl mb-2">{action.icon}</div>
              <div className="text-sm font-semibold text-[var(--charcoal)]">{action.label}</div>
              <div className="text-xs text-[var(--warm-gray)] mt-0.5">{action.desc}</div>
            </button>
          ))}
        </div>

        {/* Bottom row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          {/* Recent booking requests */}
          <div className="bg-white border border-[var(--border-color)] rounded-2xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-semibold text-[var(--charcoal)]">Booking Requests</h2>
              <Link to="/scheduling/bookings" className="text-xs text-[var(--warm-gray)] hover:text-[var(--charcoal)]">
                See all →
              </Link>
            </div>
            {bookings.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-xs text-[var(--warm-gray)]">No bookings yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {bookings.slice(0, 4).map(b => (
                  <div key={b.id} className="flex items-center justify-between p-3 bg-[var(--cream)] rounded-xl">
                    <div>
                      <p className="text-xs font-semibold text-[var(--charcoal)]">{b.student_name}</p>
                      <p className="text-xs text-[var(--warm-gray)] mt-0.5">{b.day_name} • {b.date}</p>
                    </div>
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg capitalize ${
                      b.status === 'pending' ? 'bg-amber-50 text-amber-700' :
                      b.status === 'confirmed' ? 'bg-green-50 text-green-700' :
                      'bg-zinc-100 text-zinc-500'
                    }`}>
                      {b.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* My courses */}
          <div className="bg-white border border-[var(--border-color)] rounded-2xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-semibold text-[var(--charcoal)]">My Courses</h2>
              <Link to="/teacher/courses" className="text-xs text-[var(--warm-gray)] hover:text-[var(--charcoal)]">
                See all →
              </Link>
            </div>
            {courses.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-xs text-[var(--warm-gray)]">No courses yet</p>
                <Link
                  to="/courses/create"
                  className="inline-block mt-3 text-xs font-semibold text-[var(--charcoal)] hover:underline"
                >
                  Create your first course →
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {courses.slice(0, 4).map(course => (
                  <div
                    key={course.id}
                    onClick={() => navigate(`/courses/${course.id}`)}
                    className="flex items-center justify-between p-3 bg-[var(--cream)] rounded-xl cursor-pointer hover:bg-zinc-100 transition-all"
                  >
                    <div>
                      <p className="text-xs font-semibold text-[var(--charcoal)]">{course.title}</p>
                      <p className="text-xs text-[var(--warm-gray)] mt-0.5">
                        {course.lesson_count} lessons · {course.enrollment_count} students
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold bg-white border border-[var(--border-color)] px-2 py-1 rounded-lg">
                        {course.cefr_level}
                      </span>
                      <span className={`text-xs font-semibold px-2 py-1 rounded-lg capitalize ${
                        course.status === 'published' ? 'bg-green-50 text-green-700' : 'bg-zinc-100 text-zinc-500'
                      }`}>
                        {course.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>
    </DashboardLayout>
  )
}