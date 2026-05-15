import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../../config/axios'
import toast from 'react-hot-toast'

const CLASS_LEVELS = ['1','2','3','4','5','6','7','8','9','10','SSC','HSC','O-Level','A-Level','University']
const SUBJECTS = ['Math','Physics','Chemistry','Biology','English','Bangla','ICT','Accounting','Economics','General Science','History','Geography','Other']
const MEDIUMS = ['Bangla Medium','English Medium','English Version','Madrasha']

export default function PostTuition() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    subject: '', classLevel: '', location: '', budget: '',
    schedule: '', description: '', medium: '',
  })

  function set(k, v) { setForm(f => ({ ...f, [k]: v })) }

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    try {
      await api.post('/tuitions', form)
      toast.success('Tuition posted! Awaiting admin approval.')
      navigate('/dashboard/student/my-tuitions')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to post')
    }
    setLoading(false)
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Post New Tuition</h1>
        <p className="text-base-content/60 mt-1">Fill in the details below. Your post will be reviewed by an admin before going live.</p>
      </div>

      <div className="card bg-base-100 shadow-xl">
        <div className="card-body p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid md:grid-cols-2 gap-5">
              <div className="form-control">
                <label className="label"><span className="label-text font-medium">Subject *</span></label>
                <select className="select select-bordered" value={form.subject} onChange={e => set('subject', e.target.value)} required>
                  <option value="">Select Subject</option>
                  {SUBJECTS.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div className="form-control">
                <label className="label"><span className="label-text font-medium">Class Level *</span></label>
                <select className="select select-bordered" value={form.classLevel} onChange={e => set('classLevel', e.target.value)} required>
                  <option value="">Select Class</option>
                  {CLASS_LEVELS.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-5">
              <div className="form-control">
                <label className="label"><span className="label-text font-medium">Medium *</span></label>
                <select className="select select-bordered" value={form.medium} onChange={e => set('medium', e.target.value)} required>
                  <option value="">Select Medium</option>
                  {MEDIUMS.map(m => <option key={m}>{m}</option>)}
                </select>
              </div>
              <div className="form-control">
                <label className="label"><span className="label-text font-medium">Budget (৳/month) *</span></label>
                <input type="number" className="input input-bordered" placeholder="e.g. 5000" value={form.budget} onChange={e => set('budget', e.target.value)} required min="500" />
              </div>
            </div>

            <div className="form-control">
              <label className="label"><span className="label-text font-medium">Location *</span></label>
              <input type="text" className="input input-bordered" placeholder="e.g. Dhanmondi, Dhaka" value={form.location} onChange={e => set('location', e.target.value)} required />
            </div>

            <div className="form-control">
              <label className="label"><span className="label-text font-medium">Schedule *</span></label>
              <input type="text" className="input input-bordered" placeholder="e.g. Sat & Mon, 5pm-7pm" value={form.schedule} onChange={e => set('schedule', e.target.value)} required />
            </div>

            <div className="form-control">
              <label className="label"><span className="label-text font-medium">Additional Details</span></label>
              <textarea className="textarea textarea-bordered h-28" placeholder="Any specific requirements, preferred gender, number of days per week, etc." value={form.description} onChange={e => set('description', e.target.value)} />
            </div>

            <div className="alert alert-info text-sm">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              Your post will be set to <strong>Pending</strong> and reviewed by an admin before tutors can see it.
            </div>

            <button type="submit" disabled={loading} className="btn btn-primary w-full btn-lg">
              {loading ? <span className="loading loading-spinner loading-sm"></span> : '🚀 Post Tuition'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
