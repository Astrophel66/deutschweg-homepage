import { useEffect, useState, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import DashboardLayout from '../../components/layout/DashboardLayout'
import api from '../../api/axios'
import toast from 'react-hot-toast'

const TYPE_COLORS = {
  pdf: 'bg-red-50 text-red-600',
  audio: 'bg-purple-50 text-purple-600',
  image: 'bg-green-50 text-green-600',
  text: 'bg-orange-50 text-orange-600',
  vocabulary: 'bg-teal-50 text-teal-600',
  practice_test: 'bg-indigo-50 text-indigo-600',
}

const TYPE_ICONS = {
  pdf: '📄',
  audio: '🎧',
  image: '🖼️',
  text: '📝',
  vocabulary: '📚',
  practice_test: '✏️',
}

export default function ResourceDetailPage() {
  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const audioRef = useRef(null)

  const [resource, setResource] = useState(null)
  const [loading, setLoading] = useState(true)
  const [audioPlaying, setAudioPlaying] = useState(false)
  const [audioTime, setAudioTime] = useState(0)

  useEffect(() => {
    api.get(`/resources/${id}/`)
      .then(res => setResource(res.data))
      .catch(() => toast.error('Resource not found.'))
      .finally(() => setLoading(false))
  }, [id])

  // Audio preview — stop at preview_duration seconds
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const handleTimeUpdate = () => {
      setAudioTime(audio.currentTime)
      if (!resource?.has_access && audio.currentTime >= resource?.preview_duration) {
        audio.pause()
        audio.currentTime = 0
        setAudioPlaying(false)
        toast('Preview ended. Unlock for full access.', { icon: '🔒' })
      }
    }

    audio.addEventListener('timeupdate', handleTimeUpdate)
    return () => audio.removeEventListener('timeupdate', handleTimeUpdate)
  }, [resource])

  if (loading) return (
    <DashboardLayout>
      <div className="flex items-center justify-center h-64">
        <p className="text-sm text-[var(--warm-gray)]">Loading...</p>
      </div>
    </DashboardLayout>
  )

  if (!resource) return (
    <DashboardLayout>
      <div className="flex items-center justify-center h-64">
        <p className="text-sm text-[var(--red-brand)]">Resource not found.</p>
      </div>
    </DashboardLayout>
  )

  const hasAccess = resource.has_access
  const isPremium = resource.is_premium
  const content = resource.content

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto space-y-6">

        {/* Header */}
        <div className="bg-white border border-[var(--border-color)] rounded-2xl p-6">
          <div className="flex items-start gap-4">

            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shrink-0 ${TYPE_COLORS[resource.resource_type] || 'bg-zinc-50 text-zinc-500'}`}>
              {TYPE_ICONS[resource.resource_type] || '📁'}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                {resource.cefr_level && (
                  <span className="text-xs font-semibold bg-[var(--cream)] border border-[var(--border-color)] px-2 py-1 rounded-lg">
                    {resource.cefr_level}
                  </span>
                )}
                {isPremium ? (
                  <span className={`text-xs font-semibold px-2 py-1 rounded-lg ${hasAccess ? 'bg-green-50 text-green-700' : 'bg-zinc-100 text-zinc-500'}`}>
                    {hasAccess ? '🔓 Unlocked' : '🔒 Premium'}
                  </span>
                ) : (
                  <span className="text-xs font-semibold bg-green-50 text-green-700 px-2 py-1 rounded-lg">
                    ✓ Free
                  </span>
                )}
              </div>
              <h1 className="font-display text-xl font-black text-[var(--charcoal)]">{resource.title}</h1>
              <p className="text-xs text-[var(--warm-gray)] mt-1">
                By <strong>{resource.uploaded_by_name}</strong>
              </p>
              {resource.description && (
                <p className="text-sm text-[var(--warm-gray)] mt-2">{resource.description}</p>
              )}
            </div>
          </div>
        </div>

        {/* Content area */}
        <div className="bg-white border border-[var(--border-color)] rounded-2xl overflow-hidden">

          {/* IMAGE */}
          {resource.resource_type === 'image' && (
            <div className="relative">
              {resource.thumbnail_url && (
                <img
                  src={resource.thumbnail_url}
                  alt={resource.title}
                  className={`w-full object-cover ${!hasAccess ? 'blur-md' : ''}`}
                />
              )}
              {hasAccess && content?.file_url && (
                <a
                  href={content.file_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block m-4 text-center py-2.5 bg-[var(--charcoal)] text-white rounded-xl text-sm font-semibold hover:bg-zinc-800 transition-all"
                >
                  Open Full Image
                </a>
              )}
              {!hasAccess && <LockedOverlay />}
            </div>
          )}

          {/* PDF */}
          {resource.resource_type === 'pdf' && (
            <div className="p-6">
              {resource.thumbnail_url && (
                <div className="relative mb-4 rounded-xl overflow-hidden border border-[var(--border-color)]">
                  <img
                    src={resource.thumbnail_url}
                    alt="PDF preview"
                    className={`w-full object-cover max-h-64 ${!hasAccess ? 'blur-sm' : ''}`}
                  />
                  {!hasAccess && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                      <span className="text-4xl">🔒</span>
                    </div>
                  )}
                </div>
              )}
              {hasAccess ? (
                <a
                  href={content?.file_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-center py-3 bg-[var(--charcoal)] text-white rounded-xl text-sm font-semibold hover:bg-zinc-800 transition-all"
                >
                  📄 Open PDF
                </a>
              ) : (
                <LockedOverlay />
              )}
            </div>
          )}

          {/* AUDIO */}
          {resource.resource_type === 'audio' && (
            <div className="p-6">
              <div className="bg-[var(--cream)] rounded-2xl p-6 text-center mb-4">
                <div className="text-5xl mb-4">🎧</div>
                <p className="text-sm font-semibold text-[var(--charcoal)] mb-1">{resource.title}</p>
                {!hasAccess && (
                  <p className="text-xs text-[var(--warm-gray)] mb-4">
                    Preview: first {resource.preview_duration} seconds
                  </p>
                )}
                <audio
                  ref={audioRef}
                  src={content?.file_url}
                  onPlay={() => setAudioPlaying(true)}
                  onPause={() => setAudioPlaying(false)}
                  controls
                  controlsList={!hasAccess ? 'nodownload' : ''}
                  className="w-full mt-2"
                />
                {!hasAccess && (
                  <p className="text-xs text-[var(--warm-gray)] mt-2">
                    ⏱ Preview stops at {resource.preview_duration}s
                  </p>
                )}
              </div>
              {!hasAccess && <LockedOverlay />}
            </div>
          )}

          {/* TEXT / VOCABULARY / PRACTICE TEST */}
          {['text', 'vocabulary', 'practice_test'].includes(resource.resource_type) && (
            <div className="p-6">
              <div className="relative">
                <div className={`prose prose-sm max-w-none text-sm text-[var(--charcoal)] whitespace-pre-wrap leading-relaxed ${!hasAccess ? 'max-h-40 overflow-hidden' : ''}`}>
                  {content?.text}
                </div>
                {!hasAccess && (
                  <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent" />
                )}
              </div>
              {!hasAccess && <LockedOverlay />}
            </div>
          )}

        </div>

        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="text-xs text-[var(--warm-gray)] hover:text-[var(--charcoal)] font-medium transition-colors"
        >
          ← Back
        </button>

      </div>
    </DashboardLayout>
  )
}

function LockedOverlay() {
  return (
    <div className="mt-4 p-4 bg-zinc-50 border border-zinc-200 rounded-2xl text-center">
      <div className="text-3xl mb-2">🔒</div>
      <p className="text-sm font-semibold text-[var(--charcoal)] mb-1">Premium Resource</p>
      <p className="text-xs text-[var(--warm-gray)]">
        Contact us to get access to this resource.
      </p>
    </div>
  )
}