import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import api from '../../api/axios'

const CEFR_LEVELS = ['', 'A1', 'A2', 'B1', 'B2', 'C1', 'C2']

export default function CoursesPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeLevel, setActiveLevel] = useState('')

  useEffect(() => {
    fetchCourses()
  }, [activeLevel])

  function fetchCourses() {
    setLoading(true)
    const params = activeLevel ? `?cefr_level=${activeLevel}` : ''
    api.get(`/courses/${params}`)
      .then(res => setCourses(res.data))
      .catch(() => setCourses([]))
      .finally(() => setLoading(false))
  }

  return (
    <div className="min-h-screen bg-[var(--cream)] px-4 py-12">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="font-display text-2xl font-black text-[var(--charcoal)]">
              Courses
            </h1>
            <p className="text-sm text-[var(--warm-gray)] mt-1">
              Structured German learning paths
            </p>
          </div>
          {user?.role === 'teacher' && (
            <Link
              to="/courses/create"
              className="px-5 py-2.5 bg-[var(--charcoal)] text-white rounded-xl text-sm font-semibold hover:bg-zinc-800 transition-all"
            >
              + Create Course
            </Link>
          )}
        </div>

        {/* CEFR filter */}
        <div className="flex gap-2 flex-wrap mb-8">
          {CEFR_LEVELS.map(level => (
            <button
              key={level}
              onClick={() => setActiveLevel(level)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all ${
                activeLevel === level
                  ? 'bg-[var(--charcoal)] text-white border-[var(--charcoal)]'
                  : 'bg-white text-[var(--warm-gray)] border-[var(--border-color)] hover:border-zinc-400'
              }`}
            >
              {level || 'All Levels'}
            </button>
          ))}
        </div>

        {loading && <p className="text-sm text-[var(--warm-gray)]">Loading...</p>}

        {!loading && courses.length === 0 && (
          <div className="text-center py-16">
            <div className="text-4xl mb-4">📭</div>
            <p className="text-sm text-[var(--warm-gray)]">No courses found.</p>
          </div>
        )}

        {/* Course grid */}
        {!loading && courses.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {courses.map(course => (
              <div
                key={course.id}
                onClick={() => navigate(`/courses/${course.id}`)}
                className="bg-white border border-[var(--border-color)] rounded-2xl overflow-hidden hover:-translate-y-1 hover:shadow-lg transition-all duration-200 cursor-pointer"
              >
                {/* Thumbnail */}
                {course.thumbnail_url ? (
                  <img
                    src={course.thumbnail_url}
                    alt={course.title}
                    className="w-full h-36 object-cover"
                  />
                ) : (
                  <div className="w-full h-36 bg-[var(--cream)] flex items-center justify-center text-4xl">
                    🇩🇪
                  </div>
                )}

                <div className="p-5">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs font-semibold bg-[var(--cream)] px-2 py-1 rounded-lg">
                      {course.cefr_level}
                    </span>
                    <span className="text-xs text-[var(--warm-gray)]">
                      {course.lesson_count} lessons
                    </span>
                  </div>
                  <h3 className="font-semibold text-[var(--charcoal)] mb-1">{course.title}</h3>
                  <p className="text-xs text-[var(--warm-gray)] mb-3 line-clamp-2">
                    {course.description || 'No description'}
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-[var(--warm-gray)]">
                      By <strong>{course.teacher_name}</strong>
                    </span>
                    <span className="font-bold text-[var(--charcoal)] text-sm">
                      {course.price === '0.00' ? 'Free' : `$${course.price}`}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}