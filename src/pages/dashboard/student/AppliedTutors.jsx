import { useEffect, useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import api from '../../../config/axios'
import toast from 'react-hot-toast'

export default function AppliedTutors() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const tuitionId = searchParams.get('tuitionId')

  const [myTuitions, setMyTuitions] = useState([])
  const [selectedId, setSelectedId] = useState(tuitionId || '')
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    api.get('/tuitions/my').then(r => setMyTuitions(r.data)).catch(() => {})
  }, [])

  useEffect(() => {
    if (!selectedId) return
    setLoading(true)
    api.get(`/applications/tuition/${selectedId}`)
      .then(r => setApplications(r.data))
      .catch(() => toast.error('Failed to load applications'))
      .finally(() => setLoading(false))
  }, [selectedId])

  async function handleApprove(app) {
    navigate(`/dashboard/student/checkout/${app._id}?amount=${app.expectedSalary}&tutorEmail=${app.tutorEmail}&tuitionId=${selectedId}`)
  }

  async function handleReject(id) {
    try {
      await api.patch(`/applications/${id}/status`, { status: 'rejected' })
      toast.success('Application rejected')
      setApplications(prev => prev.map(a => a._id === id ? { ...a, status: 'rejected' } : a))
    } catch { toast.error('Failed to reject') }
  }

  const statusBadge = { approved: 'badge-success', pending: 'badge-warning', rejected: 'badge-error' }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Applied Tutors</h1>
        <p className="text-base-content/60 mt-1">Review tutor applications for your posted tuitions</p>
      </div>

      <div className="form-control mb-6 max-w-md">
        <label className="label"><span className="label-text font-medium">Select Tuition Post</span></label>
        <select className="select select-bordered" value={selectedId} onChange={e => setSelectedId(e.target.value)}>
          <option value="">-- Choose a tuition --</option>
          {myTuitions.map(t => (
            <option key={t._id} value={t._id}>{t.subject} — Class {t.classLevel} ({t.location})</option>
          ))}
        </select>
      </div>

      {!selectedId ? (
        <div className="text-center py-20 bg-base-100 rounded-2xl">
          <div className="text-6xl mb-4">👆</div>
          <p className="text-base-content/60">Select a tuition post to view its applications</p>
        </div>
      ) : loading ? (
        <div className="flex justify-center py-20"><span className="loading loading-ring loading-lg text-primary"></span></div>
      ) : applications.length === 0 ? (
        <div className="text-center py-20 bg-base-100 rounded-2xl">
          <div className="text-6xl mb-4">📭</div>
          <p className="text-base-content/60">No applications yet for this tuition</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {applications.map(app => (
            <div key={app._id} className="card bg-base-100 shadow-md">
              <div className="card-body p-6">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="avatar">
                      <div className="w-14 rounded-full bg-primary/10 flex items-center justify-center">
                        <img src={`https://api.dicebear.com/7.x/initials/svg?seed=${app.tutorName}`} alt="" />
                      </div>
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">{app.tutorName}</h3>
                      <p className="text-sm text-base-content/60">{app.tutorEmail}</p>
                      <div className={`badge ${statusBadge[app.status]} badge-sm mt-1`}>{app.status}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-black text-success">৳{app.expectedSalary?.toLocaleString()}</p>
                    <p className="text-xs text-base-content/50">expected/month</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-3 mt-4">
                  <div className="bg-base-200 rounded-xl p-3">
                    <p className="text-xs text-base-content/50 uppercase tracking-wider mb-1">Qualifications</p>
                    <p className="text-sm">{app.qualifications}</p>
                  </div>
                  <div className="bg-base-200 rounded-xl p-3">
                    <p className="text-xs text-base-content/50 uppercase tracking-wider mb-1">Experience</p>
                    <p className="text-sm">{app.experience}</p>
                  </div>
                </div>

                {app.status === 'pending' && (
                  <div className="flex gap-3 mt-4">
                    <button className="btn btn-success btn-sm flex-1" onClick={() => handleApprove(app)}>
                      ✅ Accept & Pay
                    </button>
                    <button className="btn btn-error btn-sm btn-outline flex-1" onClick={() => handleReject(app._id)}>
                      ❌ Reject
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
