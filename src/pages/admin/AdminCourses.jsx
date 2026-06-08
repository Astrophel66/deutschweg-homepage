import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import DashboardLayout from '../../components/layout/DashboardLayout'
import api from '../../api/axios'
import toast from 'react-hot-toast'

export default function AdminCourses() {
  const navigate = useNavigate()
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    api.get('/admin/courses/')
      .then(res => setCourses(res.data))
      .catch(() => toast.error('Failed to load courses.'))
      .finally(() => setLoading(false))
  }, [])

  async function handleToggleStatus(courseId, current) {
    try {
      const res = await api.patch(`/admin/courses/${courseId}/toggle-status/`)
      setCourses(prev => prev.map(c =>
        c.id === courseId ? { ...c, status: res.data.status } : c
      ))
      toast.success(res.data.status === 'published' ? 'Course published ✓' : 'Course unpublished')
    } catch (err) {
      toast.error('Failed to update course.')
    }
  }

  const filtered = courses.filter(c => {
    if (filter === 'published') return c.status === 'published'
    if (filter === 'draft') return c.status === 'draft'
    return true
  })

  return (
    <DashboardLayout>
      <div className="space-y-6">

        <div>
          <h1 className="font-display text-2xl font-black text-[var(--charcoal)]">Courses</h1>
          <p className="text-sm text-[var(--warm-gray)] mt-1">{courses.length} total courses</p>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2">
          {[
            { key: 'all', label: `All (${courses.length})` },
            { key: 'published', label: `Published (${courses.filter(c => c.status === 'published').length})` },
            { key: 'draft', label: `Draft (${courses.filter(c => c.status === 'draft').length})` },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all ${
                filter === tab.key
                  ? 'bg-[var(--charcoal)] text-white border-[var(--charcoal)]'
                  : 'bg-white text-[var(--warm-gray)] border-[var(--border-color)] hover:border-zinc-400'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Table */}
        <div className="bg-white border border-[var(--border-color)] rounded-2xl overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center h-40">
              <p className="text-sm text-[var(--warm-gray)]">Loading...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-sm text-[var(--warm-gray)]">No courses found.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[var(--border-color)] bg-[var(--cream)]">
                    <th className="text-left text-xs font-semibold text-[var(--warm-gray)] px-6 py-3">Course</th>
                    <th className="text-left text-xs font-semibold text-[var(--warm-gray)] px-6 py-3">Teacher</th>
                    <th className="text-left text-xs font-semibold text-[var(--warm-gray)] px-6 py-3">Level</th>
                    <th className="text-left text-xs font-semibold text-[var(--warm-gray)] px-6 py-3">Lessons</th>
                    <th className="text-left text-xs font-semibold text-[var(--warm-gray)] px-6 py-3">Students</th>
                    <th className="text-left text-xs font-semibold text-[var(--warm-gray)] px-6 py-3">Price</th>
                    <th className="text-left text-xs font-semibold text-[var(--warm-gray)] px-6 py-3">Status</th>
                    <th className="text-left text-xs font-semibold text-[var(--warm-gray)] px-6 py-3">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(c => (
                    <tr key={c.id} className="border-b border-[var(--border-color)] last:border-0 hover:bg-[var(--cream)] transition-all">
                      <td className="px-6 py-4">
                        <p
                          className="text-sm font-semibold text-[var(--charcoal)] cursor-pointer hover:underline max-w-48 truncate"
                          onClick={() => navigate(`/courses/${c.id}`)}
                        >
                          {c.title}
                        </p>
                        <p className="text-xs text-[var(--warm-gray)] mt-0.5">
                          {new Date(c.created_at).toLocaleDateString()}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-[var(--charcoal)]">{c.teacher_name}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-xs font-semibold bg-[var(--cream)] border border-[var(--border-color)] px-2 py-1 rounded-lg">
                          {c.cefr_level}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-[var(--charcoal)]">{c.lesson_count}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-[var(--charcoal)]">{c.enrollment_count}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-[var(--charcoal)]">
                          {c.price === '0.00' ? 'Free' : `$${c.price}`}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg capitalize ${
                          c.status === 'published'
                            ? 'bg-green-50 text-green-700'
                            : 'bg-zinc-100 text-zinc-500'
                        }`}>
                          {c.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleToggleStatus(c.id, c.status)}
                          className={`text-xs font-semibold px-3 py-1.5 rounded-xl border transition-all ${
                            c.status === 'published'
                              ? 'border-red-200 text-red-600 hover:bg-red-50'
                              : 'border-green-200 text-green-600 hover:bg-green-50'
                          }`}
                        >
                          {c.status === 'published' ? 'Unpublish' : 'Publish'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}