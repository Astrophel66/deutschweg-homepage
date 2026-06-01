import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import api from '../../api/axios'

export default function CourseDetailPage() {
  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [course, setCourse] = useState(null)
  const [lessons, setLessons] = useState([])
  const [enrolled, setEnrolled] = useState(false)
  const [loading, setLoading] = useState(true)
  const [enrolling, setEnrolling] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    // Fetch course details
    api.get(`/courses/${id}/`)
      .then(res => {
        setCourse(res.data)
        // Check if student is enrolled — try fetching lessons
        if (user?.role === 'student') {
          return api.get(`/courses/${id}/lessons/`)
            .then(r => { setLessons(r.data); setEnrolled(true) })
            .catch(() => setEnrolled(false))
        }
        // Teacher sees lessons directly
        if (user?.role === 'teacher') {
          return api.get(`/courses/${id}/lessons/`)
            .then(r => setLessons(r.data))
            .catch(() => {})
        }
      })
      .catch(() => setError('Course not found.'))
      .finally(() => setLoading(false))
  }, [id])

  async function handleEnroll() {
    setEnrolling(true)
    try {
      await api.post(`/courses/${id}/enroll/`)
      setEnrolled(true)
      const r = await api.get(`/courses/${id}/lessons/`)
      setLessons(r.data)
    } catch (err) {
      setError(err.response?.data?.error || 'Enrollment failed.')
    } finally {
      setEnrolling(false)
    }
  }

  if (loading) return (
    <div className="min-h-screen bg-[var(--cream)] flex items-center justify-center">
      <p className="text-sm text-[var(--warm-gray)]">Loading...</p>
    </div>
  )

  if (error) return (
    <div className="min-h-screen bg-[var(--cream)] flex items-center justify-center">
      <p className="text-sm text-[var(--red-brand)]">{error}</p>
    </div>
  )

  const isOwner = user?.role === 'teacher' && course?.teacher_name === user?.full_name

  return (
    <div className="min-h-screen bg-[var(--cream)] px-4 py-12">
      <div className="max-w-3xl mx-auto">

        {/* Course header */}
        <div className="bg-white border border-[var(--border-color)] rounded-2xl overflow-hidden mb-6">
          {course.thumbnail_url ? (
            <img src={course.thumbnail_url} alt={course.title} className="w-full h-48 object-cover" />
          ) : (
            <div className="w-full h-48 bg-[var(--cream)] flex items-center justify-center text-6xl">🇩🇪</div>
          )}
          <div className="p-6">
            <div className="flex justify-between items-start mb-3">
              <span className="text-xs font-semibold bg-[var(--cream)] px-2 py-1 rounded-lg">
                {course.cefr_level}
              </span>
              <span className="font-bold text-lg text-[var(--charcoal)]">
                {course.price === '0.00' ? 'Free' : `$${course.price}`}
              </span>
            </div>
            <h1 className="font-display text-2xl font-black text-[var(--charcoal)] mb-2">
              {course.title}
            </h1>
            <p className="text-sm text-[var(--warm-gray)] mb-4">{course.description}</p>
            <div className="flex gap-4 text-xs text-[var(--warm-gray)] mb-6">
              <span>By <strong>{course.teacher_name}</strong></span>
              <span>{course.lesson_count} lessons</span>
              <span>{course.enrollment_count} students</span>
            </div>

            {/* Actions */}
            {user?.role === 'student' && !enrolled && (
              <button
                onClick={handleEnroll}
                disabled={enrolling}
                className="w-full py-3 bg-[var(--charcoal)] text-white rounded-xl text-sm font-semibold hover:bg-zinc-800 transition-all disabled:opacity-60"
              >
                {enrolling ? 'Enrolling…' : course.price === '0.00' ? 'Enroll for Free' : `Enroll for $${course.price}`}
              </button>
            )}

            {user?.role === 'student' && enrolled && (
              <div className="flex items-center gap-2 text-green-600 text-sm font-semibold">
                ✓ Enrolled
              </div>
            )}

            {isOwner && (
              <button
                onClick={() => navigate(`/courses/${id}/lessons/add`)}
                className="px-5 py-2.5 bg-[var(--charcoal)] text-white rounded-xl text-sm font-semibold hover:bg-zinc-800 transition-all"
              >
                + Add Lesson
              </button>
            )}
          </div>
        </div>

        {/* Lessons */}
        {lessons.length > 0 && (
          <div className="bg-white border border-[var(--border-color)] rounded-2xl p-6">
            <h2 className="font-semibold text-[var(--charcoal)] mb-4">
              Lessons ({lessons.length})
            </h2>
            <div className="space-y-3">
              {lessons.map((lesson, i) => (
                <div
                  key={lesson.id}
                  className="flex items-start gap-4 p-4 bg-[var(--cream)] rounded-xl"
                >
                  <span className="text-xs font-bold text-[var(--warm-gray)] w-6 shrink-0">
                    {i + 1}
                  </span>
                  <div className="flex-1">
                    <h3 className="text-sm font-semibold text-[var(--charcoal)]">{lesson.title}</h3>
                    <p className="text-xs text-[var(--warm-gray)] mt-0.5">{lesson.description}</p>
                    {lesson.resources?.length > 0 && (
                      <p className="text-xs text-[var(--warm-gray)] mt-1">
                        📎 {lesson.resources.length} resource{lesson.resources.length > 1 ? 's' : ''}
                      </p>
                    )}
                  </div>
                  {lesson.video_url && (
                    <a
                      href={lesson.video_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-semibold text-[var(--charcoal)] hover:underline shrink-0"
                    >
                      ▶ Watch
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* No lessons yet */}
        {lessons.length === 0 && (enrolled || isOwner) && (
          <div className="text-center py-10 bg-white border border-[var(--border-color)] rounded-2xl">
            <p className="text-sm text-[var(--warm-gray)]">No lessons added yet.</p>
          </div>
        )}

      </div>
    </div>
  )
}