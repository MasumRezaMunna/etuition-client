import { useEffect, useState } from 'react'
import api from '../../../config/axios'
import toast from 'react-hot-toast'
import { Link } from 'react-router-dom'

export default function MyTuitions() {
  const [tuitions, setTuitions] = useState([])
  const [loading, setLoading] = useState(true)
  const [editTarget, setEditTarget] = useState(null)
  const [editForm, setEditForm] = useState({})
  const [deleteTarget, setDeleteTarget] = useState(null)

  const fetchTuitions = () => {
    api.get('/tuitions/my').then((r) => setTuitions(r.data)).finally(() => setLoading(false))
  }
  useEffect(() => { fetchTuitions() }, [])

  async function handleDelete() {
    try {
      await api.delete(`/tuitions/${deleteTarget}`)
      toast.success('Tuition deleted')
      setDeleteTarget(null)
      fetchTuitions()
    } catch { toast.error('Delete failed') }
  }

  async function handleEdit(e) {
    e.preventDefault()
    try {
      await api.put(`/tuitions/${editTarget._id}`, editForm)
      toast.success('Tuition updated')
      setEditTarget(null)
      fetchTuitions()
    } catch { toast.error('Update failed') }
  }

  const statusBadge = { approved: 'badge-success', pending: 'badge-warning', rejected: 'badge-error' }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">My Tuitions</h1>
          <p className="text-base-content/60 mt-1">Manage your posted tuition requests</p>
        </div>
        <Link to="/dashboard/student/post-tuition" className="btn btn-primary gap-2">
          + Post New
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><span className="loading loading-ring loading-lg text-primary"></span></div>
      ) : tuitions.length === 0 ? (
        <div className="text-center py-20 bg-base-100 rounded-2xl">
          <div className="text-6xl mb-4">📋</div>
          <h3 className="text-xl font-semibold mb-2">No tuitions posted yet</h3>
          <Link to="/dashboard/student/post-tuition" className="btn btn-primary mt-4">Post Your First Tuition</Link>
        </div>
      ) : (
        <div className="grid gap-4">
          {tuitions.map((t) => (
            <div key={t._id} className="card bg-base-100 shadow-md">
              <div className="card-body flex-row items-start justify-between flex-wrap gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-2">
                    <h3 className="font-bold text-lg">{t.subject} — Class {t.classLevel}</h3>
                    <div className={`badge ${statusBadge[t.status]}`}>{t.status}</div>
                  </div>
                  <p className="text-sm text-base-content/60">📍 {t.location} &nbsp;|&nbsp; 💰 ৳{t.budget}/mo &nbsp;|&nbsp; 🕐 {t.schedule}</p>
                </div>
                <div className="flex gap-2">
                  <button className="btn btn-sm btn-outline btn-info" onClick={() => { setEditTarget(t); setEditForm({ subject: t.subject, classLevel: t.classLevel, location: t.location, budget: t.budget, schedule: t.schedule, description: t.description || '', medium: t.medium || '' }); document.getElementById('edit_modal').showModal() }}>
                    Edit
                  </button>
                  <button className="btn btn-sm btn-outline btn-error" onClick={() => { setDeleteTarget(t._id); document.getElementById('delete_modal').showModal() }}>
                    Delete
                  </button>
                  <Link to={`/dashboard/student/applied-tutors?tuitionId=${t._id}`} className="btn btn-sm btn-outline btn-primary">
                    Applications
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Modal */}
      <dialog id="edit_modal" className="modal">
        <div className="modal-box w-11/12 max-w-lg">
          <h3 className="font-bold text-xl mb-4">Edit Tuition</h3>
          <form onSubmit={handleEdit} className="space-y-3">
            {[['subject', 'Subject'], ['classLevel', 'Class Level'], ['location', 'Location'], ['schedule', 'Schedule'], ['medium', 'Medium']].map(([key, label]) => (
              <div key={key} className="form-control">
                <label className="label"><span className="label-text">{label}</span></label>
                <input className="input input-bordered" value={editForm[key] || ''} onChange={(e) => setEditForm({ ...editForm, [key]: e.target.value })} required={key !== 'medium'} />
              </div>
            ))}
            <div className="form-control">
              <label className="label"><span className="label-text">Budget (৳/month)</span></label>
              <input type="number" className="input input-bordered" value={editForm.budget || ''} onChange={(e) => setEditForm({ ...editForm, budget: e.target.value })} required />
            </div>
            <div className="form-control">
              <label className="label"><span className="label-text">Description</span></label>
              <textarea className="textarea textarea-bordered" value={editForm.description || ''} onChange={(e) => setEditForm({ ...editForm, description: e.target.value })} />
            </div>
            <div className="modal-action">
              <button type="button" className="btn btn-ghost" onClick={() => document.getElementById('edit_modal').close()}>Cancel</button>
              <button type="submit" className="btn btn-primary">Save Changes</button>
            </div>
          </form>
        </div>
        <form method="dialog" className="modal-backdrop"><button>close</button></form>
      </dialog>

      {/* Delete Confirm Modal */}
      <dialog id="delete_modal" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-xl mb-3">Confirm Delete</h3>
          <p className="text-base-content/70">Are you sure you want to delete this tuition post? This action cannot be undone.</p>
          <div className="modal-action">
            <button className="btn btn-ghost" onClick={() => document.getElementById('delete_modal').close()}>Cancel</button>
            <button className="btn btn-error" onClick={() => { handleDelete(); document.getElementById('delete_modal').close() }}>Delete</button>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop"><button>close</button></form>
      </dialog>
    </div>
  )
}
