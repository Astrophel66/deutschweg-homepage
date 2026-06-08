import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import DashboardLayout from '../../components/layout/DashboardLayout'
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

const CEFR_LEVELS = ['', 'A1', 'A2', 'B1', 'B2', 'C1', 'C2']

const TYPE_CONFIG = {
  pdf: { icon: '📄', color: 'bg-red-50', text: 'text-red-600', border: 'border-red-100' },
  audio: { icon: '🎧', color: 'bg-purple-50', text: 'text-purple-600', border: 'border-purple-100' },
  image: { icon: '🖼️', color: 'bg-green-50', text: 'text-green-600', border: 'border-green-100' },
  text: { icon: '📝', color: 'bg-orange-50', text: 'text-orange-600', border: 'border-orange-100' },
  vocabulary: { icon: '📚', color: 'bg-teal-50', text: 'text-teal-600', border: 'border-teal-100' },
  practice_test: { icon: '✏️', color: 'bg-indigo-50', text: 'text-indigo-600', border: 'border-indigo-100' },
}

export default function ResourcesPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [resources, setResources] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeType, setActiveType] = useState('')
  const [activeLevel, setActiveLevel] = useState('')
  const [search, setSearch] = useState('')
  const [searchInput, setSearchInput] = useState('')

  useEffect(() => {
    fetchResources()
  }, [activeType, activeLevel, search])

  function fetchResources() {
    setLoading(true)
    const params = new URLSearchParams()
    if (activeType) params.append('type', activeType)
    if (activeLevel) params.append('cefr_level', activeLevel)
    if (search) params.append('search', search)

    api.get(`/resources/?${params.toString()}`)
      .then(res => setResources(res.data))
      .catch(() => setResources([]))
      .finally(() => setLoading(false))
  }

  function handleSearch(e) {
    e.preventDefault()
    setSearch(searchInput)
  }

  const isTeacherOrAdmin = user?.role === 'teacher' || user?.role === 'admin'

  // Separate free and premium
  const freeResources = resources.filter(r => !r.is_premium)
  const premiumResources = resources.filter(r => r.is_premium)

  return (
    <DashboardLayout>
      <div className="space-y-6">

        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="font-display text-2xl font-black text-[var(--charcoal)]">
              Resources
            </h1>
            <p className="text-sm text-[var(--warm-gray)] mt-1">
              {resources.length} learning materials available
            </p>
          </div>
          {isTeacherOrAdmin && (
            <button
              onClick={() => navigate('/resources/upload')}
              className="px-5 py-2.5 bg-[var(--charcoal)] text-white rounded-xl text-sm font-semibold hover:bg-zinc-800 transition-all"
            >
              + Upload
            </button>
          )}
        </div>

        {/* Search + filters */}
        <div className="bg-white border border-[var(--border-color)] rounded-2xl p-4 space-y-4">

          {/* Search bar */}
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="flex-1 flex items-center gap-2 bg-[var(--cream)] border border-[var(--border-color)] rounded-xl px-3 py-2.5">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-[var(--warm-gray)] shrink-0">
                <circle cx="11" cy="11" r="8"/>
                <line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
              <input
                type="text"
                placeholder="Search resources..."
                value={searchInput}
                onChange={e => setSearchInput(e.target.value)}
                className="bg-transparent text-sm text-[var(--charcoal)] placeholder:text-[var(--warm-gray)] outline-none w-full"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2.5 bg-[var(--charcoal)] text-white rounded-xl text-sm font-semibold hover:bg-zinc-800 transition-all"
            >
              Search
            </button>
            {search && (
              <button
                type="button"
                onClick={() => { setSearch(''); setSearchInput('') }}
                className="px-4 py-2.5 bg-[var(--cream)] border border-[var(--border-color)] rounded-xl text-sm font-medium text-[var(--warm-gray)] hover:text-[var(--charcoal)] transition-all"
              >
                Clear
              </button>
            )}
          </form>

          {/* Type filter */}
          <div className="flex gap-2 flex-wrap">
            {RESOURCE_TYPES.map(type => (
              <button
                key={type.key}
                onClick={() => setActiveType(type.key)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                  activeType === type.key
                    ? 'bg-[var(--charcoal)] text-white border-[var(--charcoal)]'
                    : 'bg-white text-[var(--warm-gray)] border-[var(--border-color)] hover:border-zinc-400'
                }`}
              >
                {type.label}
              </button>
            ))}
          </div>

          {/* CEFR filter */}
          <div className="flex gap-2 flex-wrap">
            {CEFR_LEVELS.map(level => (
              <button
                key={level}
                onClick={() => setActiveLevel(level)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                  activeLevel === level
                    ? 'bg-[var(--charcoal)] text-white border-[var(--charcoal)]'
                    : 'bg-white text-[var(--warm-gray)] border-[var(--border-color)] hover:border-zinc-400'
                }`}
              >
                {level || 'All Levels'}
              </button>
            ))}
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center h-40">
            <p className="text-sm text-[var(--warm-gray)]">Loading...</p>
          </div>
        )}

        {/* Empty state */}
        {!loading && resources.length === 0 && (
          <div className="text-center py-16 bg-white border border-[var(--border-color)] rounded-2xl">
            <div className="text-4xl mb-4">📭</div>
            <p className="text-sm text-[var(--warm-gray)]">No resources found.</p>
            {search && (
              <button
                onClick={() => { setSearch(''); setSearchInput('') }}
                className="mt-3 text-xs font-semibold text-[var(--charcoal)] hover:underline"
              >
                Clear search
              </button>
            )}
          </div>
        )}

        {/* Free resources */}
        {!loading && freeResources.length > 0 && (
          <div>
            <h2 className="text-sm font-semibold text-[var(--warm-gray)] uppercase tracking-wider mb-3">
              Free Resources ({freeResources.length})
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {freeResources.map(r => (
                <ResourceCard key={r.id} resource={r} onClick={() => navigate(`/resources/${r.id}`)} />
              ))}
            </div>
          </div>
        )}

        {/* Premium resources */}
        {!loading && premiumResources.length > 0 && (
          <div>
            <h2 className="text-sm font-semibold text-[var(--warm-gray)] uppercase tracking-wider mb-3">
              Premium Resources ({premiumResources.length})
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {premiumResources.map(r => (
                <ResourceCard key={r.id} resource={r} onClick={() => navigate(`/resources/${r.id}`)} />
              ))}
            </div>
          </div>
        )}

      </div>
    </DashboardLayout>
  )
}

// ── Resource Card ─────────────────────────────────────────────────────────────
function ResourceCard({ resource, onClick }) {
  const config = TYPE_CONFIG[resource.resource_type] || {
    icon: '📁', color: 'bg-zinc-50', text: 'text-zinc-500', border: 'border-zinc-100'
  }
  const hasAccess = resource.has_access
  const isPremium = resource.is_premium

  return (
    <div
      onClick={onClick}
      className="bg-white border border-[var(--border-color)] rounded-2xl overflow-hidden hover:-translate-y-1 hover:shadow-lg transition-all duration-200 cursor-pointer"
    >
      {/* Colored header */}
      <div className={`${config.color} ${config.border} border-b px-5 pt-5 pb-4 flex items-start justify-between`}>
        <span className="text-3xl">{config.icon}</span>
        <div className="flex items-center gap-1.5">
          {resource.cefr_level && (
            <span className="text-xs font-semibold bg-white/70 px-2 py-0.5 rounded-lg">
              {resource.cefr_level}
            </span>
          )}
          {isPremium ? (
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-lg ${
              hasAccess ? 'bg-green-100 text-green-700' : 'bg-zinc-100 text-zinc-500'
            }`}>
              {hasAccess ? '🔓' : '🔒'}
            </span>
          ) : (
            <span className="text-xs font-semibold bg-green-100 text-green-700 px-2 py-0.5 rounded-lg">
              Free
            </span>
          )}
        </div>
      </div>

      {/* Card body */}
      <div className="p-5">
        <h3 className="font-semibold text-[var(--charcoal)] text-sm mb-1 line-clamp-1">
          {resource.title}
        </h3>
        <p className="text-xs text-[var(--warm-gray)] mb-2 line-clamp-2">
          {resource.description || 'No description'}
        </p>
        <p className="text-xs text-[var(--warm-gray)]">
          By <strong>{resource.uploaded_by_name}</strong>
        </p>

        {/* Preview text for text resources */}
        {resource.content?.type === 'preview' && resource.content?.text && (
          <p className="text-xs text-[var(--warm-gray)] mt-2 line-clamp-2 italic">
            "{resource.content.text.slice(0, 80)}..."
          </p>
        )}

        {/* Action */}
        <div className="mt-4">
          <span className={`text-xs font-semibold px-3 py-1.5 rounded-xl border transition-all ${config.color} ${config.text} ${config.border}`}>
            {isPremium && !hasAccess ? 'Preview →' : 'Open →'}
          </span>
        </div>
      </div>
    </div>
  )
}