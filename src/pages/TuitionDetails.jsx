import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../config/axios'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'
import { FaMapMarkerAlt, FaMoneyBillWave, FaClock, FaBook, FaUser } from 'react-icons/fa'

export default function TuitionDetails() {
  const { id } = useParams()
  const { dbUser } = useAuth()
  const navigate = useNavigate()
  const [tuition, setTuition] = useState(null)
  const [loading, setLoading] = useState(true)
  const [applying, setApplying] = useState(false)
  const [form, setForm] = useState({ qualifications: '', experience: '', expectedSalary: '' })

  useEffect(() => {
    api.get(`/tuitions/${id}`).then((r) => setTuition(r.data)).catch(() => toast.error('Not found')).finally(() => setLoading(false))
  }, [id])

  async function handleApply(e) {
    e.preventDefault()
    if (!dbUser) return navigate('/login')
    setApplying(true)
    try {
      await api.post('/applications', {
        tuitionId: id,
        tuitionSubject: tuition.subject,
        tutorName: dbUser.name,
        tutorEmail: dbUser.email,
        ...form,
      })
      toast.success('Application submitted successfully!')
      document.getElementById('apply_modal').close()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to apply')
    }
    setApplying(false)
  }

  if (loading) return <div className="flex justify-center py-32"><span className="loading loading-ring loading-lg text-primary"></span></div>
  if (!tuition) return <div className="text-center py-32"><h2 className="text-2xl">Tuition not found</h2></div>

  return (
    <div className="min-h-screen bg-base-200 py-10">
      <div className="max-w-4xl mx-auto px-4">
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body p-8">
            <div className="flex flex-wrap justify-between items-start gap-4 mb-6">
              <div>
                <div className="badge badge-primary badge-outline mb-2">{tuition.medium || 'Any Medium'}</div>
                <h1 className="text-3xl font-extrabold">{tuition.subject}</h1>
                <p className="text-base-content/60 mt-1">Class {tuition.classLevel}</p>
              </div>
              <div className="badge badge-lg badge-success font-semibold text-lg px-6 py-4">
                ৳{tuition.budget?.toLocaleString()}/mo
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4 mb-6">
              {[
                { icon: <FaMapMarkerAlt className="text-primary" />, label: 'Location', value: tuition.location },
                { icon: <FaClock className="text-warning" />, label: 'Schedule', value: tuition.schedule },
                { icon: <FaBook className="text-info" />, label: 'Subject', value: tuition.subject },
                { icon: <FaUser className="text-secondary" />, label: 'Posted By', value: tuition.postedBy },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3 p-4 bg-base-200 rounded-xl">
                  <div className="mt-0.5">{item.icon}</div>
                  <div>
                    <p className="text-xs text-base-content/50 uppercase tracking-wider">{item.label}</p>
                    <p className="font-semibold">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>

            {tuition.description && (
              <div className="mb-6">
                <h3 className="font-bold text-lg mb-2">Description</h3>
                <p className="text-base-content/70 leading-relaxed">{tuition.description}</p>
              </div>
            )}

            <div className="card-actions justify-end mt-4">
              {dbUser?.role === 'tutor' ? (
                <button
                  className="btn btn-primary btn-lg gap-2"
                  onClick={() => document.getElementById('apply_modal').showModal()}
                >
                  Apply for This Tuition
                </button>
              ) : !dbUser ? (
                <button className="btn btn-primary btn-lg" onClick={() => navigate('/login')}>
                  Login to Apply
                </button>
              ) : null}
            </div>
          </div>
        </div>
      </div>

      {/* Apply Modal */}
      <dialog id="apply_modal" className="modal">
        <div className="modal-box w-11/12 max-w-lg">
          <h3 className="font-bold text-xl mb-6">Apply for {tuition.subject}</h3>
          <form onSubmit={handleApply} className="space-y-4">
            <div className="form-control">
              <label className="label"><span className="label-text font-medium">Name</span></label>
              <input className="input input-bordered" value={dbUser?.name || ''} readOnly />
            </div>
            <div className="form-control">
              <label className="label"><span className="label-text font-medium">Email</span></label>
              <input className="input input-bordered" value={dbUser?.email || ''} readOnly />
            </div>
            <div className="form-control">
              <label className="label"><span className="label-text font-medium">Qualifications *</span></label>
              <textarea
                className="textarea textarea-bordered h-24"
                placeholder="e.g. BSc in Physics, Dhaka University (2020)"
                value={form.qualifications}
                onChange={(e) => setForm({ ...form, qualifications: e.target.value })}
                required
              />
            </div>
            <div className="form-control">
              <label className="label"><span className="label-text font-medium">Experience *</span></label>
              <textarea
                className="textarea textarea-bordered h-24"
                placeholder="e.g. 3 years teaching Class 9-10 Math..."
                value={form.experience}
                onChange={(e) => setForm({ ...form, experience: e.target.value })}
                required
              />
            </div>
            <div className="form-control">
              <label className="label"><span className="label-text font-medium">Expected Salary (৳/month) *</span></label>
              <input
                type="number"
                className="input input-bordered"
                placeholder="e.g. 5000"
                value={form.expectedSalary}
                onChange={(e) => setForm({ ...form, expectedSalary: e.target.value })}
                required
                min="500"
              />
            </div>
            <div className="modal-action">
              <button type="button" className="btn btn-ghost" onClick={() => document.getElementById('apply_modal').close()}>Cancel</button>
              <button type="submit" className="btn btn-primary" disabled={applying}>
                {applying ? <span className="loading loading-spinner loading-sm"></span> : 'Submit Application'}
              </button>
            </div>
          </form>
        </div>
        <form method="dialog" className="modal-backdrop"><button>close</button></form>
      </dialog>
    </div>
  )
}
