import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import DashboardLayout from '../../components/layout/DashboardLayout'
import StatCard from '../../components/ui/StatCard'
import api from '../../api/axios'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, RadarChart, Radar, PolarGrid,
  PolarAngleAxis, PolarRadiusAxis
} from 'recharts'

// Mock data — will be replaced with real API data later
const cefrProgressData = [
  { month: 'Jan', score: 40 },
  { month: 'Feb', score: 45 },
  { month: 'Mar', score: 52 },
  { month: 'Apr', score: 58 },
  { month: 'May', score: 65 },
  { month: 'Jun', score: 72 },
  { month: 'Jul', score: 80 },
]

const skillData = [
  { skill: 'Reading', score: 75 },
  { skill: 'Writing', score: 60 },
  { skill: 'Listening', score: 80 },
  { skill: 'Speaking', score: 55 },
  { skill: 'Grammar', score: 70 },
  { skill: 'Vocabulary', score: 65 },
]

export default function StudentDashboard() {
  const { user } = useAuth()
  const [profile, setProfile] = useState(null)
  const [enrollments, setEnrollments] = useState([])
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      api.get('/students/profile/').catch(() => null),
      api.get('/courses/enrollments/my/').catch(() => null),
      api.get('/scheduling/bookings/').catch(() => null),
    ]).then(([profileRes, enrollRes, bookingRes]) => {
      if (profileRes) setProfile(profileRes.data)
      if (enrollRes) setEnrollments(enrollRes.data)
      if (bookingRes) setBookings(bookingRes.data.filter(b => b.status === 'confirmed'))
    }).finally(() => setLoading(false))
  }, [])

  const upcomingClasses = bookings.slice(0, 3)

  return (
    <DashboardLayout>
      <div className="space-y-6">

        {/* Profile incomplete banner */}
        {!loading && !profile && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-amber-800">Complete your profile</p>
              <p className="text-xs text-amber-600 mt-0.5">Tell us your German level to get personalized recommendations</p>
            </div>
            <Link
              to="/student/profile"
              className="px-4 py-2 bg-amber-800 text-white rounded-xl text-xs font-semibold hover:bg-amber-900 transition-all shrink-0"
            >
              Complete now
            </Link>
          </div>
        )}

        {/* Stat cards row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard
            label="Current CEFR"
            value={profile?.cefr_level || '—'}
            subtitle="Upper intermediate"
            badge="+1 sub-level"
            icon={
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/>
                <polyline points="16 7 22 7 22 13"/>
              </svg>
            }
          />
          <StatCard
            label="Learning Streak"
            value="0 days"
            subtitle="Start your streak today"
            badge="Active today"
            icon={
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/>
                <path d="M12 6v6l4 2"/>
              </svg>
            }
          />
          <StatCard
            label="Weekly Goal"
            value="0 / 8 hrs"
            subtitle="Hours studied this week"
            icon={
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <polyline points="12 6 12 12 16 14"/>
              </svg>
            }
          />
          <StatCard
            label="Mock Exam Avg."
            value="— / 100"
            subtitle="Take your first exam"
            icon={
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 11l3 3L22 4"/>
                <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
              </svg>
            }
          />
        </div>

        {/* Charts row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

          {/* CEFR progression — takes 2/3 width */}
          <div className="md:col-span-2 bg-white border border-[var(--border-color)] rounded-2xl p-6">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="font-semibold text-[var(--charcoal)]">CEFR Progression</h2>
                <p className="text-xs text-[var(--warm-gray)] mt-0.5">Composite score across all skills</p>
              </div>
              <span className="text-xs font-semibold bg-[var(--charcoal)] text-white px-3 py-1.5 rounded-lg">
                Last 7 months
              </span>
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={cefrProgressData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F0EDE8" />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 11, fill: '#8A8580' }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: '#8A8580' }}
                  axisLine={false}
                  tickLine={false}
                  domain={[0, 100]}
                />
                <Tooltip
                  contentStyle={{
                    background: '#1C1C1E',
                    border: 'none',
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="#1C1C1E"
                  strokeWidth={2.5}
                  dot={false}
                  activeDot={{ r: 5, fill: '#1C1C1E' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Skill analytics radar — takes 1/3 width */}
          <div className="bg-white border border-[var(--border-color)] rounded-2xl p-6">
            <div className="mb-4">
              <h2 className="font-semibold text-[var(--charcoal)]">Skill Analytics</h2>
              <p className="text-xs text-[var(--warm-gray)] mt-0.5">Your four-skill profile</p>
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <RadarChart data={skillData}>
                <PolarGrid stroke="#F0EDE8" />
                <PolarAngleAxis
                  dataKey="skill"
                  tick={{ fontSize: 10, fill: '#8A8580' }}
                />
                <PolarRadiusAxis
                  angle={30}
                  domain={[0, 100]}
                  tick={false}
                  axisLine={false}
                />
                <Radar
                  dataKey="score"
                  stroke="#1C1C1E"
                  fill="#1C1C1E"
                  fillOpacity={0.15}
                  strokeWidth={2}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bottom row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

          {/* Upcoming classes */}
          <div className="bg-white border border-[var(--border-color)] rounded-2xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-semibold text-[var(--charcoal)]">Upcoming Classes</h2>
              <Link to="/scheduling/bookings" className="text-xs text-[var(--warm-gray)] hover:text-[var(--charcoal)]">
                See all →
              </Link>
            </div>
            {upcomingClasses.length === 0 ? (
              <div className="text-center py-6">
                <p className="text-xs text-[var(--warm-gray)]">No upcoming classes</p>
                <Link
                  to="/scheduling/book"
                  className="inline-block mt-3 text-xs font-semibold text-[var(--charcoal)] hover:underline"
                >
                  Book a class →
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {upcomingClasses.map(b => (
                  <div key={b.id} className="flex justify-between items-start p-3 bg-[var(--cream)] rounded-xl">
                    <div>
                      <p className="text-xs font-semibold text-[var(--charcoal)]">{b.teacher_name}</p>
                      <p className="text-xs text-[var(--warm-gray)] mt-0.5">{b.date}</p>
                    </div>
                    <span className="text-xs text-[var(--warm-gray)]">{b.start_time}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Goal tracking */}
          <div className="bg-white border border-[var(--border-color)] rounded-2xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-semibold text-[var(--charcoal)]">Goal Tracking</h2>
            </div>
            <p className="text-xs text-[var(--warm-gray)] mb-4">
              Reach {profile?.cefr_level === 'B1' ? 'B2' : 'B1'} by end of year
            </p>
            {/* Progress bar */}
            <div className="space-y-3">
              {[
                { label: 'Reading', pct: 75 },
                { label: 'Listening', pct: 80 },
                { label: 'Writing', pct: 60 },
                { label: 'Speaking', pct: 55 },
              ].map(skill => (
                <div key={skill.label}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-[var(--warm-gray)]">{skill.label}</span>
                    <span className="font-semibold text-[var(--charcoal)]">{skill.pct}%</span>
                  </div>
                  <div className="h-1.5 bg-[var(--cream)] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[var(--charcoal)] rounded-full transition-all duration-500"
                      style={{ width: `${skill.pct}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recommended for you */}
          <div className="bg-white border border-[var(--border-color)] rounded-2xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-semibold text-[var(--charcoal)]">Recommended</h2>
              <Link to="/courses" className="text-xs text-[var(--warm-gray)] hover:text-[var(--charcoal)]">
                See all →
              </Link>
            </div>
            <div className="space-y-3">
              {[
                { title: 'Passiv & Modalverben', level: 'B1', type: 'Lesson' },
                { title: 'Goethe B1 Mock Test', level: 'B1', type: 'Exam' },
                { title: 'Vocabulary: Daily Life', level: 'A2', type: 'Flashcard' },
              ].map(item => (
                <div key={item.title} className="flex items-center justify-between p-3 bg-[var(--cream)] rounded-xl">
                  <div>
                    <p className="text-xs font-semibold text-[var(--charcoal)]">{item.title}</p>
                    <p className="text-xs text-[var(--warm-gray)] mt-0.5">{item.type}</p>
                  </div>
                  <span className="text-xs font-semibold bg-white border border-[var(--border-color)] px-2 py-1 rounded-lg">
                    {item.level}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </DashboardLayout>
  )
}