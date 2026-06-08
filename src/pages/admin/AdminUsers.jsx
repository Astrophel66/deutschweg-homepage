import { useEffect, useState } from 'react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import api from '../../api/axios'
import toast from 'react-hot-toast'

const ROLES = [
  { key: '', label: 'All' },
  { key: 'student', label: 'Students' },
  { key: 'teacher', label: 'Teachers' },
  { key: 'admin', label: 'Admins' },
]

export default function AdminUsers() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeRole, setActiveRole] = useState('')
  const [search, setSearch] = useState('')
  const [searchInput, setSearchInput] = useState('')

  useEffect(() => {
    fetchUsers()
  }, [activeRole, search])

  function fetchUsers() {
    setLoading(true)
    const params = new URLSearchParams()
    if (activeRole) params.append('role', activeRole)
    if (search) params.append('search', search)

    api.get(`/admin/users/?${params.toString()}`)
      .then(res => setUsers(res.data))
      .catch(() => toast.error('Failed to load users.'))
      .finally(() => setLoading(false))
  }

  async function handleToggleActive(userId, currentState) {
    try {
      const res = await api.patch(`/admin/users/${userId}/toggle-active/`)
      setUsers(prev => prev.map(u =>
        u.id === userId ? { ...u, is_active: res.data.is_active } : u
      ))
      toast.success(res.data.is_active ? 'User activated' : 'User deactivated')
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to update user.')
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">

        <div className="flex justify-between items-center">
          <div>
            <h1 className="font-display text-2xl font-black text-[var(--charcoal)]">Users</h1>
            <p className="text-sm text-[var(--warm-gray)] mt-1">{users.length} total users</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white border border-[var(--border-color)] rounded-2xl p-4 space-y-3">
          <form
            onSubmit={e => { e.preventDefault(); setSearch(searchInput) }}
            className="flex gap-2"
          >
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchInput}
              onChange={e => setSearchInput(e.target.value)}
              className="flex-1 px-3.5 py-2.5 rounded-xl border border-[var(--border-color)] text-sm bg-[var(--cream)] text-[var(--charcoal)] placeholder:text-[var(--warm-gray)] outline-none focus:border-[var(--charcoal)]"
            />
            <button
              type="submit"
              className="px-4 py-2.5 bg-[var(--charcoal)] text-white rounded-xl text-sm font-semibold"
            >
              Search
            </button>
            {search && (
              <button
                type="button"
                onClick={() => { setSearch(''); setSearchInput('') }}
                className="px-4 py-2.5 bg-[var(--cream)] border border-[var(--border-color)] rounded-xl text-sm text-[var(--warm-gray)]"
              >
                Clear
              </button>
            )}
          </form>

          <div className="flex gap-2">
            {ROLES.map(role => (
              <button
                key={role.key}
                onClick={() => setActiveRole(role.key)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                  activeRole === role.key
                    ? 'bg-[var(--charcoal)] text-white border-[var(--charcoal)]'
                    : 'bg-white text-[var(--warm-gray)] border-[var(--border-color)] hover:border-zinc-400'
                }`}
              >
                {role.label}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="bg-white border border-[var(--border-color)] rounded-2xl overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center h-40">
              <p className="text-sm text-[var(--warm-gray)]">Loading...</p>
            </div>
          ) : users.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-sm text-[var(--warm-gray)]">No users found.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[var(--border-color)] bg-[var(--cream)]">
                    <th className="text-left text-xs font-semibold text-[var(--warm-gray)] px-6 py-3">User</th>
                    <th className="text-left text-xs font-semibold text-[var(--warm-gray)] px-6 py-3">Role</th>
                    <th className="text-left text-xs font-semibold text-[var(--warm-gray)] px-6 py-3">Verified</th>
                    <th className="text-left text-xs font-semibold text-[var(--warm-gray)] px-6 py-3">Joined</th>
                    <th className="text-left text-xs font-semibold text-[var(--warm-gray)] px-6 py-3">Status</th>
                    <th className="text-left text-xs font-semibold text-[var(--warm-gray)] px-6 py-3">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u.id} className="border-b border-[var(--border-color)] last:border-0 hover:bg-[var(--cream)] transition-all">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-[var(--charcoal)] text-white flex items-center justify-center text-xs font-bold shrink-0">
                            {u.full_name?.charAt(0)}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-[var(--charcoal)]">{u.full_name}</p>
                            <p className="text-xs text-[var(--warm-gray)]">{u.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg capitalize ${
                          u.role === 'admin' ? 'bg-purple-50 text-purple-700' :
                          u.role === 'teacher' ? 'bg-blue-50 text-blue-700' :
                          'bg-green-50 text-green-700'
                        }`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-xs font-semibold ${u.is_email_verified ? 'text-green-600' : 'text-amber-500'}`}>
                          {u.is_email_verified ? '✓ Verified' : '⏳ Pending'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-xs text-[var(--warm-gray)]">
                          {new Date(u.date_joined).toLocaleDateString()}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg ${
                          u.is_active ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'
                        }`}>
                          {u.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {u.role !== 'admin' && (
                          <button
                            onClick={() => handleToggleActive(u.id, u.is_active)}
                            className={`text-xs font-semibold px-3 py-1.5 rounded-xl border transition-all ${
                              u.is_active
                                ? 'border-red-200 text-red-600 hover:bg-red-50'
                                : 'border-green-200 text-green-600 hover:bg-green-50'
                            }`}
                          >
                            {u.is_active ? 'Deactivate' : 'Activate'}
                          </button>
                        )}
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