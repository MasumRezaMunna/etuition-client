import { useEffect, useState } from 'react'
import api from '../../../config/axios'

export default function OngoingTuitions() {
  const [apps, setApps] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/applications/approved/tutor').then(r => setApps(r.data)).finally(() => setLoading(false))
  }, [])

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Ongoing Tuitions</h1>
        <p className="text-base-content/60 mt-1">All your currently active tuitions</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><span className="loading loading-ring loading-lg text-primary"></span></div>
      ) : apps.length === 0 ? (
        <div className="text-center py-20 bg-base-100 rounded-2xl">
          <div className="text-6xl mb-4">🎓</div>
          <p className="text-base-content/60">No active tuitions yet. Apply to tuitions to get started!</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {apps.map(app => (
            <div key={app._id} className="card bg-base-100 shadow-md">
              <div className="card-body p-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-xl">{app.tuitionSubject}</h3>
                  <div className="badge badge-success">Active</div>
                </div>
                <div className="space-y-2 text-sm text-base-content/70">
                  <p>💰 Salary: <span className="font-bold text-success">৳{app.expectedSalary?.toLocaleString()}/month</span></p>
                  <p>📅 Since: {app.paidAt ? new Date(app.paidAt).toLocaleDateString() : 'N/A'}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
