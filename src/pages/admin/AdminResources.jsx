import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import DashboardLayout from '../../components/layout/DashboardLayout'
import api from '../../api/axios'
import toast from 'react-hot-toast'

const TYPE_ICONS = {
  pdf: '📄', audio: '🎧', image: '🖼️',
  text: '📝', vocabulary: '📚', practice_test: '✏️',
}

export default function AdminResources() {
  const navigate = useNavigate()
  const [resources, setResources] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [grantModal, setGrantModal] = useState(null) // resource id
  const [email, setEmail] = useState('')

  useEffect(() => {
    api.get('/admin/resources/')
      .then(res => setResources(res.data))
      .catch(() => toast.error('Failed to load resources.'))
      .finally(() => setLoading(false))
  }, [])

  async function handleTogglePremium(resourceId) {
    try {
      const res = await api.patch(`/admin/resources/${resourceId}/toggle-premium/`)
      setResources(prev => prev.map(r =>
        r.id === resourceId ? { ...r, is_premium: res.data.is_premium } : r
      ))
      toast.success(res.data.is_premium ? 'Marked as premium 🔒' : 'Marked as free ✓')
    } catch {
      toast.error('Failed to update resource.')
    }
  }

  async function handleGrantAccess() {
    if (!email) { toast.error('Enter an email.'); return }
    try {
      await api.post(`/resources/${grantModal}/grant-access/`, { email })
      toast.success(`Access granted to ${email}`)
      setGrantModal(null)
      setEmail('')
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to grant access.')
    }
  }

  const filtered = resources.filter(r => {
    if (filter === 'premium') return r.is_premium
    if (filter === 'free') return !r.is_premium
    return true
  })

  return (
    <DashboardLayout>
      <div className="space-y-6">

        <div>
          <h1 className="font-display text-2xl font-black text-[var(--charcoal)]">Resources</h1>
          <p className="text-sm text-[var(--warm-gray)] mt-1">{resources.length} total resources</p>
        </div>

        {/* Filter */}
        <div className="flex gap-2">
          {[
            { key: 'all', label: `All (${resources.length})` },
            { key: 'free', label: `Free (${resources.filter(r => !r.is_premium).length})` },
            { key: 'premium', label: `Premium (${resources.filter(r => r.is_premium).length})` },
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
              <p className="text-sm text-[var(--warm-gray)]">No resources found.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[var(--border-color)] bg-[var(--cream)]">
                    <th className="text-left text-xs font-semibold text-[var(--warm-gray)] px-6 py-3">Resource</th>
                    <th className="text-left text-xs font-semibold text-[var(--warm-gray)] px-6 py-3">Type</th>
                    <th className="text-left text-xs font-semibold text-[var(--warm-gray)] px-6 py-3">Level</th>
                    <th className="text-left text-xs font-semibold text-[var(--warm-gray)] px-6 py-3">Uploaded By</th>
                    <th className="text-left text-xs font-semibold text-[var(--warm-gray)] px-6 py-3">Access</th>
                    <th className="text-left text-xs font-semibold text-[var(--warm-gray)] px-6 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(r => (
                    <tr key={r.id} className="border-b border-[var(--border-color)] last:border-0 hover:bg-[var(--cream)] transition-all">
                      <td className="px-6 py-4">
                        <p
                          className="text-sm font-semibold text-[var(--charcoal)] cursor-pointer hover:underline max-w-48 truncate"
                          onClick={() => navigate(`/resources/${r.id}`)}
                        >
                          {r.title}
                        </p>
                        <p className="text-xs text-[var(--warm-gray)] mt-0.5">
                          {new Date(r.created_at).toLocaleDateString()}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-lg">{TYPE_ICONS[r.resource_type] || '📁'}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-xs font-semibold bg-[var(--cream)] border border-[var(--border-color)] px-2 py-1 rounded-lg">
                          {r.cefr_level || '—'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-[var(--charcoal)]">{r.uploaded_by_name}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg ${
                          r.is_premium ? 'bg-zinc-100 text-zinc-500' : 'bg-green-50 text-green-700'
                        }`}>
                          {r.is_premium ? '🔒 Premium' : '✓ Free'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleTogglePremium(r.id)}
                            className={`text-xs font-semibold px-3 py-1.5 rounded-xl border transition-all ${
                              r.is_premium
                                ? 'border-green-200 text-green-600 hover:bg-green-50'
                                : 'border-zinc-200 text-zinc-600 hover:bg-zinc-50'
                            }`}
                          >
                            {r.is_premium ? 'Make Free' : 'Make Premium'}
                          </button>
                          {r.is_premium && (
                            <button
                              onClick={() => setGrantModal(r.id)}
                              className="text-xs font-semibold px-3 py-1.5 rounded-xl border border-blue-200 text-blue-600 hover:bg-blue-50 transition-all"
                            >
                              Grant Access
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Grant access modal */}
      {grantModal && (
        <>
          <div
            className="fixed inset-0 bg-black/40 z-40"
            onClick={() => { setGrantModal(null); setEmail('') }}
          />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-sm bg-white rounded-2xl border border-[var(--border-color)] shadow-xl z-50 p-6">
            <h2 className="font-semibold text-[var(--charcoal)] mb-4">Grant Resource Access</h2>
            <p className="text-xs text-[var(--warm-gray)] mb-4">
              Enter the student's email to grant access to this premium resource.
            </p>
            <input
              type="email"
              placeholder="student@example.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--border-color)] text-sm bg-[var(--cream)] text-[var(--charcoal)] outline-none focus:border-[var(--charcoal)] mb-4"
            />
            <div className="flex gap-2">
              <button
                onClick={handleGrantAccess}
                className="flex-1 py-2.5 bg-[var(--charcoal)] text-white rounded-xl text-sm font-semibold hover:bg-zinc-800 transition-all"
              >
                Grant Access
              </button>
              <button
                onClick={() => { setGrantModal(null); setEmail('') }}
                className="flex-1 py-2.5 bg-[var(--cream)] border border-[var(--border-color)] rounded-xl text-sm font-medium text-[var(--warm-gray)] hover:text-[var(--charcoal)] transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        </>
      )}
    </DashboardLayout>
  )
}