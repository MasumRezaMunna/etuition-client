import { useEffect, useState } from 'react'
import api from '../../../config/axios'
import toast from 'react-hot-toast'

const ROLES = ['student', 'tutor', 'admin']

export default function AdminUsers() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [editTarget, setEditTarget] = useState(null)
  const [editForm, setEditForm] = useState({})
  const [search, setSearch] = useState('')

  const fetchUsers = () => {
    api.get('/users').then(r => setUsers(r.data)).finally(() => setLoading(false))
  }
  useEffect(() => { fetchUsers() }, [])

  async function handleUpdate(e) {
    e.preventDefault()
    try {
      await api.put(`/users/${editTarget._id}`, editForm)
      toast.success('User updated')
      setEditTarget(null)
      fetchUsers()
    } catch { toast.error('Update failed') }
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this user permanently?')) return
    try {
      await api.delete(`/users/${id}`)
      toast.success('User deleted')
      fetchUsers()
    } catch { toast.error('Delete failed') }
  }

  const roleBadge = { admin: 'badge-error', tutor: 'badge-secondary', student: 'badge-primary' }

  const filtered = users.filter(u =>
    u.name?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">User Management</h1>
        <p className="text-base-content/60 mt-1">View, edit roles, and manage all platform users</p>
      </div>

      {/* Stats */}
      <div className="stats shadow mb-8 w-full">
        {['student', 'tutor', 'admin'].map(role => (
          <div key={role} className="stat">
            <div className="stat-title capitalize">{role}s</div>
            <div className="stat-value text-2xl">{users.filter(u => u.role === role).length}</div>
          </div>
        ))}
      </div>

      {/* Search */}
      <input
        type="text"
        className="input input-bordered w-full max-w-sm mb-6"
        placeholder="Search by name or email..."
        value={search}
        onChange={e => setSearch(e.target.value)}
      />

      {loading ? (
        <div className="flex justify-center py-20"><span className="loading loading-ring loading-lg text-primary"></span></div>
      ) : (
        <div className="card bg-base-100 shadow-md overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th>User</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Joined</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(u => (
                <tr key={u._id} className="hover">
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="avatar">
                        <div className="w-9 rounded-full">
                          <img src={u.photoURL || `https://api.dicebear.com/7.x/initials/svg?seed=${u.name}`} alt="" />
                        </div>
                      </div>
                      <span className="font-medium">{u.name}</span>
                    </div>
                  </td>
                  <td className="text-sm text-base-content/60">{u.email}</td>
                  <td><div className={`badge ${roleBadge[u.role]} badge-sm`}>{u.role}</div></td>
                  <td>
                    <div className={`badge badge-sm ${u.status === 'active' ? 'badge-success' : 'badge-error'}`}>
                      {u.status || 'active'}
                    </div>
                  </td>
                  <td className="text-sm text-base-content/50">{new Date(u.createdAt).toLocaleDateString()}</td>
                  <td>
                    <div className="flex gap-2">
                      <button
                        className="btn btn-xs btn-outline btn-info"
                        onClick={() => {
                          setEditTarget(u)
                          setEditForm({ name: u.name, phone: u.phone || '', photoURL: u.photoURL || '', role: u.role, status: u.status || 'active' })
                          document.getElementById('edit_user_modal').showModal()
                        }}
                      >
                        Edit
                      </button>
                      <button className="btn btn-xs btn-outline btn-error" onClick={() => handleDelete(u._id)}>
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Edit Modal */}
      <dialog id="edit_user_modal" className="modal">
        <div className="modal-box w-11/12 max-w-md">
          <h3 className="font-bold text-xl mb-4">Edit User</h3>
          <form onSubmit={handleUpdate} className="space-y-3">
            <div className="form-control">
              <label className="label"><span className="label-text">Name</span></label>
              <input className="input input-bordered" value={editForm.name || ''} onChange={e => setEditForm({ ...editForm, name: e.target.value })} required />
            </div>
            <div className="form-control">
              <label className="label"><span className="label-text">Phone</span></label>
              <input className="input input-bordered" value={editForm.phone || ''} onChange={e => setEditForm({ ...editForm, phone: e.target.value })} />
            </div>
            <div className="form-control">
              <label className="label"><span className="label-text">Photo URL</span></label>
              <input className="input input-bordered" value={editForm.photoURL || ''} onChange={e => setEditForm({ ...editForm, photoURL: e.target.value })} />
            </div>
            <div className="form-control">
              <label className="label"><span className="label-text">Role</span></label>
              <select className="select select-bordered" value={editForm.role || 'student'} onChange={e => setEditForm({ ...editForm, role: e.target.value })}>
                {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
            <div className="form-control">
              <label className="label"><span className="label-text">Status</span></label>
              <select className="select select-bordered" value={editForm.status || 'active'} onChange={e => setEditForm({ ...editForm, status: e.target.value })}>
                <option value="active">Active</option>
                <option value="suspended">Suspended</option>
              </select>
            </div>
            <div className="modal-action">
              <button type="button" className="btn btn-ghost" onClick={() => document.getElementById('edit_user_modal').close()}>Cancel</button>
              <button type="submit" className="btn btn-primary">Save Changes</button>
            </div>
          </form>
        </div>
        <form method="dialog" className="modal-backdrop"><button>close</button></form>
      </dialog>
    </div>
  )
}
