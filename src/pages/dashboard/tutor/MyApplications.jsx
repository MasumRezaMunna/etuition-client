import { useEffect, useState } from 'react'
import api from '../../../config/axios'
import toast from 'react-hot-toast'

export default function TutorApplications() {
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchApps = () => {
    api.get('/applications/tutor').then(r => setApplications(r.data)).finally(() => setLoading(false))
  }
  useEffect(() => { fetchApps() }, [])

  async function handleDelete(id) {
    try {
      await api.delete(`/applications/${id}`)
      toast.success('Application withdrawn')
      fetchApps()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Cannot delete this application')
    }
  }

  const statusBadge = { approved: 'badge-success', pending: 'badge-warning', rejected: 'badge-error' }
  const statusIcon = { approved: '✅', pending: '⏳', rejected: '❌' }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">My Applications</h1>
        <p className="text-base-content/60 mt-1">Track all your tuition applications</p>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-8">
        {['pending', 'approved', 'rejected'].map(s => (
          <div key={s} className={`stat bg-base-100 shadow rounded-2xl`}>
            <div className="stat-title capitalize">{s}</div>
            <div className="stat-value text-2xl">{applications.filter(a => a.status === s).length}</div>
          </div>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><span className="loading loading-ring loading-lg text-primary"></span></div>
      ) : applications.length === 0 ? (
        <div className="text-center py-20 bg-base-100 rounded-2xl">
          <div className="text-6xl mb-4">📝</div>
          <p className="text-base-content/60">You haven't applied to any tuitions yet.</p>
          <a href="/tuitions" className="btn btn-primary mt-4">Browse Tuitions</a>
        </div>
      ) : (
        <div className="grid gap-4">
          {applications.map(app => (
            <div key={app._id} className="card bg-base-100 shadow-md">
              <div className="card-body p-6">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-lg">{app.tuitionSubject}</h3>
                      <span className={`badge ${statusBadge[app.status]}`}>{statusIcon[app.status]} {app.status}</span>
                    </div>
                    <p className="text-sm text-base-content/60">Applied {new Date(app.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-success">৳{app.expectedSalary?.toLocaleString()}</p>
                    <p className="text-xs text-base-content/50">your ask</p>
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-3 mt-3">
                  <div className="bg-base-200 rounded-xl p-3 text-sm">
                    <p className="text-xs text-base-content/50 mb-1">Qualifications</p>
                    {app.qualifications}
                  </div>
                  <div className="bg-base-200 rounded-xl p-3 text-sm">
                    <p className="text-xs text-base-content/50 mb-1">Experience</p>
                    {app.experience}
                  </div>
                </div>
                {app.status === 'pending' && (
                  <div className="mt-4">
                    <button className="btn btn-error btn-sm btn-outline" onClick={() => handleDelete(app._id)}>
                      Withdraw Application
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
