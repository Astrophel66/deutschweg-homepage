import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import api from '../../api/axios'

const RESOURCE_TYPES = [
  { key: '', label: 'All' },
  { key: 'pdf', label: 'PDF Notes' },
  { key: 'text', label: 'Text Notes' },
  { key: 'audio', label: 'Audio' },
  { key: 'image', label: 'Images' },
  { key: 'vocabulary', label: 'Vocabulary' },
  { key: 'practice_test', label: 'Practice Tests' },
]

const TYPE_ICONS = {
  pdf: '📄',
  text: '📝',
  audio: '🎧',
  image: '🖼️',
  vocabulary: '📚',
  practice_test: '✏️',
}

export default function ResourcesPage() {
  const { user } = useAuth()
  const [resources, setResources] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeType, setActiveType] = useState('')

  useEffect(() => {
    fetchResources()
  }, [activeType])

  function fetchResources() {
    setLoading(true)
    const params = activeType ? `?type=${activeType}` : ''
    api.get(`/resources/${params}`)
      .then(res => setResources(res.data))
      .catch(() => setResources([]))
      .finally(() => setLoading(false))
  }

  const isTeacherOrAdmin = user?.role === 'teacher' || user?.role === 'admin'

  return (
    <div className="min-h-screen bg-[var(--cream)] px-4 py-12">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="font-display text-2xl font-black text-[var(--charcoal)]">
              Learning Resources
            </h1>
            <p className="text-sm text-[var(--warm-gray)] mt-1">
              Browse all learning materials
            </p>
          </div>
          {/* Only teachers and admins can upload */}
          {isTeacherOrAdmin && (
            <Link
              to="/resources/upload"
              className="px-5 py-2.5 bg-[var(--charcoal)] text-white rounded-xl text-sm font-semibold hover:bg-zinc-800 transition-all"
            >
              + Upload
            </Link>
          )}
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 flex-wrap mb-8">
          {RESOURCE_TYPES.map(type => (
            <button
              key={type.key}
              onClick={() => setActiveType(type.key)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all ${
                activeType === type.key
                  ? 'bg-[var(--charcoal)] text-white border-[var(--charcoal)]'
                  : 'bg-white text-[var(--warm-gray)] border-[var(--border-color)] hover:border-zinc-400'
              }`}
            >
              {type.label}
            </button>
          ))}
        </div>

        {/* Loading */}
        {loading && (
          <p className="text-sm text-[var(--warm-gray)]">Loading...</p>
        )}

        {/* Empty state */}
        {!loading && resources.length === 0 && (
          <div className="text-center py-16">
            <div className="text-4xl mb-4">📭</div>
            <p className="text-sm text-[var(--warm-gray)]">No resources found.</p>
          </div>
        )}

        {/* Resource grid */}
        {!loading && resources.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {resources.map(r => (
              <div
                key={r.id}
                className="bg-white border border-[var(--border-color)] rounded-2xl p-5 hover:-translate-y-1 hover:shadow-lg transition-all duration-200"
              >
                <div className="flex items-start justify-between mb-3">
                  <span className="text-2xl">{TYPE_ICONS[r.resource_type] || '📁'}</span>
                  {r.cefr_level && (
                    <span className="text-xs font-semibold bg-[var(--cream)] px-2 py-1 rounded-lg">
                      {r.cefr_level}
                    </span>
                  )}
                </div>
                <h3 className="font-semibold text-[var(--charcoal)] mb-1 text-sm">{r.title}</h3>
                <p className="text-xs text-[var(--warm-gray)] mb-3 line-clamp-2">
                  {r.description || 'No description'}
                </p>
                <p className="text-xs text-[var(--warm-gray)] mb-4">
                  By <strong>{r.uploaded_by_name}</strong>
                </p>

                {/* File link or text preview */}
                {r.file_url ? (
                  <a
                    href={r.file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-center py-2 bg-[var(--cream)] border border-[var(--border-color)] rounded-xl text-xs font-semibold text-[var(--charcoal)] hover:border-[var(--charcoal)] transition-all"
                  >
                    Open {r.resource_type.toUpperCase()}
                  </a>
                ) : (
                  <div className="py-2 px-3 bg-[var(--cream)] rounded-xl text-xs text-[var(--warm-gray)] line-clamp-3">
                    {r.text_content || '—'}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}