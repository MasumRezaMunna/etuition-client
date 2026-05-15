import { useState } from 'react'
import { useAuth } from '../../../context/AuthContext'
import api from '../../../config/axios'
import toast from 'react-hot-toast'

export default function StudentProfile() {
  const { dbUser, refreshDBUser } = useAuth()
  const [form, setForm] = useState({ name: dbUser?.name || '', phone: dbUser?.phone || '', photoURL: dbUser?.photoURL || '' })
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    try {
      await api.put('/users/me', form)
      await refreshDBUser()
      toast.success('Profile updated!')
    } catch { toast.error('Update failed') }
    setLoading(false)
  }

  return (
    <div className="max-w-lg mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Profile Settings</h1>
        <p className="text-base-content/60 mt-1">Update your personal information</p>
      </div>

      <div className="card bg-base-100 shadow-xl">
        <div className="card-body p-8">
          <div className="flex justify-center mb-6">
            <div className="avatar">
              <div className="w-24 rounded-full ring ring-primary ring-offset-2">
                <img src={form.photoURL || `https://api.dicebear.com/7.x/initials/svg?seed=${form.name}`} alt="" />
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="form-control">
              <label className="label"><span className="label-text font-medium">Full Name</span></label>
              <input className="input input-bordered" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
            </div>
            <div className="form-control">
              <label className="label"><span className="label-text font-medium">Email</span></label>
              <input className="input input-bordered" value={dbUser?.email || ''} readOnly disabled />
            </div>
            <div className="form-control">
              <label className="label"><span className="label-text font-medium">Phone</span></label>
              <input className="input input-bordered" placeholder="+880 1700-000000" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
            </div>
            <div className="form-control">
              <label className="label"><span className="label-text font-medium">Photo URL</span></label>
              <input className="input input-bordered" placeholder="https://..." value={form.photoURL} onChange={e => setForm({ ...form, photoURL: e.target.value })} />
            </div>

            <div className="form-control">
              <label className="label"><span className="label-text font-medium">Role</span></label>
              <div className="badge badge-primary badge-lg capitalize">{dbUser?.role}</div>
            </div>

            <button type="submit" disabled={loading} className="btn btn-primary w-full mt-2">
              {loading ? <span className="loading loading-spinner loading-sm"></span> : 'Save Changes'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
