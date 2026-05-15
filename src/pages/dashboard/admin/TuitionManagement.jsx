import { useEffect, useState } from 'react'
import api from '../../../config/axios'
import toast from 'react-hot-toast'

export default function AdminTuitions() {
  const [tuitions, setTuitions] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  const fetchTuitions = () => {
    api.get('/tuitions/all-admin').then(r => setTuitions(r.data)).finally(() => setLoading(false))
  }
  useEffect(() => { fetchTuitions() }, [])

  async function handleStatus(id, status) {
    try {
      await api.patch(`/tuitions/${id}/status`, { status })
      toast.success(`Tuition ${status}`)
      fetchTuitions()
    } catch { toast.error('Action failed') }
  }

  const statusBadge = { approved: 'badge-success', pending: 'badge-warning', rejected: 'badge-error' }

  const filtered = filter === 'all' ? tuitions : tuitions.filter(t => t.status === filter)

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Tuition Management</h1>
        <p className="text-base-content/60 mt-1">Review, approve, or reject student tuition posts</p>
      </div>

      {/* Stats */}
      <div className="stats shadow mb-8 w-full">
        {['pending', 'approved', 'rejected'].map(s => (
          <div key={s} className="stat">
            <div className="stat-title capitalize">{s}</div>
            <div className="stat-value text-2xl">{tuitions.filter(t => t.status === s).length}</div>
          </div>
        ))}
      </div>

      {/* Filter tabs */}
      <div className="tabs tabs-boxed mb-6 w-fit">
        {['all', 'pending', 'approved', 'rejected'].map(f => (
          <button
            key={f}
            className={`tab capitalize ${filter === f ? 'tab-active' : ''}`}
            onClick={() => setFilter(f)}
          >
            {f}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><span className="loading loading-ring loading-lg text-primary"></span></div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 bg-base-100 rounded-2xl">
          <div className="text-6xl mb-4">📭</div>
          <p className="text-base-content/60">No tuitions in this category</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {filtered.map(t => (
            <div key={t._id} className="card bg-base-100 shadow-md">
              <div className="card-body p-6">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <h3 className="font-bold text-lg">{t.subject} — Class {t.classLevel}</h3>
                      <div className={`badge ${statusBadge[t.status]}`}>{t.status}</div>
                    </div>
                    <div className="text-sm text-base-content/60 space-y-0.5">
                      <p>📍 {t.location} &nbsp;|&nbsp; 💰 ৳{t.budget}/mo &nbsp;|&nbsp; 🕐 {t.schedule}</p>
                      <p>👤 Posted by: {t.postedBy}</p>
                      <p>📅 {new Date(t.createdAt).toLocaleDateString()}</p>
                    </div>
                    {t.description && (
                      <p className="text-sm text-base-content/50 mt-2 line-clamp-2">{t.description}</p>
                    )}
                  </div>
                  <div className="flex flex-col gap-2">
                    {t.status !== 'approved' && (
                      <button
                        className="btn btn-success btn-sm gap-1"
                        onClick={() => handleStatus(t._id, 'approved')}
                      >
                        ✅ Approve
                      </button>
                    )}
                    {t.status !== 'rejected' && (
                      <button
                        className="btn btn-error btn-sm btn-outline gap-1"
                        onClick={() => handleStatus(t._id, 'rejected')}
                      >
                        ❌ Reject
                      </button>
                    )}
                    {t.status !== 'pending' && (
                      <button
                        className="btn btn-warning btn-sm btn-outline gap-1"
                        onClick={() => handleStatus(t._id, 'pending')}
                      >
                        ⏳ Reset
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
