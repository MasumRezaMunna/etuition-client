import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'
import { FaGraduationCap, FaEye, FaEyeSlash } from 'react-icons/fa'

export default function Register() {
  const { register, googleLogin } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'student', phone: '' })
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)

  const passwordStrength = form.password.length >= 8 && /[A-Z]/.test(form.password) && /[0-9]/.test(form.password)

  async function handleSubmit(e) {
    e.preventDefault()
    if (!passwordStrength) {
      return toast.error('Password must be 8+ chars with uppercase and number')
    }
    setLoading(true)
    try {
      await register(form)
      toast.success('Account created successfully!')
      const redirect = form.role === 'tutor' ? '/dashboard/tutor/applications' : '/dashboard/student/my-tuitions'
      navigate(redirect, { replace: true })
    } catch (err) {
      toast.error(err.response?.data?.message || err.message?.replace('Firebase: ', '') || 'Registration failed')
    }
    setLoading(false)
  }

  async function handleGoogle() {
    setLoading(true)
    try {
      await googleLogin()
      toast.success('Registered with Google!')
      navigate('/dashboard/student/my-tuitions', { replace: true })
    } catch {
      toast.error('Google registration failed')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-base-100 to-secondary/10 flex items-center justify-center px-4 py-10">
      <div className="card bg-base-100 shadow-2xl w-full max-w-md">
        <div className="card-body p-8">
          <div className="text-center mb-6">
            <FaGraduationCap className="text-primary text-5xl mx-auto mb-3" />
            <h1 className="text-3xl font-extrabold">Create Account</h1>
            <p className="text-base-content/60 mt-1">Join eTuitionBd today</p>
          </div>

          <button onClick={handleGoogle} disabled={loading} className="btn btn-outline btn-lg w-full gap-3 mb-4">
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-5" alt="" /> Continue with Google
          </button>

          <div className="divider text-base-content/40 text-sm">or register with email</div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="form-control">
              <label className="label"><span className="label-text font-medium">Full Name *</span></label>
              <input type="text" className="input input-bordered" placeholder="Your full name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            </div>
            <div className="form-control">
              <label className="label"><span className="label-text font-medium">Email *</span></label>
              <input type="email" className="input input-bordered" placeholder="you@example.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
            </div>
            <div className="form-control">
              <label className="label"><span className="label-text font-medium">Phone</span></label>
              <input type="tel" className="input input-bordered" placeholder="+880 1700-000000" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            </div>
            <div className="form-control">
              <label className="label"><span className="label-text font-medium">Register As *</span></label>
              <div className="grid grid-cols-2 gap-3">
                {['student', 'tutor'].map((role) => (
                  <label key={role} className={`flex items-center gap-3 p-3 border-2 rounded-xl cursor-pointer transition-all ${form.role === role ? 'border-primary bg-primary/10' : 'border-base-300'}`}>
                    <input type="radio" name="role" value={role} checked={form.role === role} onChange={(e) => setForm({ ...form, role: e.target.value })} className="radio radio-primary radio-sm" />
                    <span className="font-medium capitalize">{role === 'student' ? '🎓 Student' : '👨‍🏫 Tutor'}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="form-control">
              <label className="label"><span className="label-text font-medium">Password *</span></label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  className="input input-bordered w-full pr-12"
                  placeholder="Min 8 chars, uppercase & number"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  required
                />
                <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-base-content/40" onClick={() => setShowPass(!showPass)}>
                  {showPass ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {form.password && (
                <div className="mt-2">
                  <progress className={`progress w-full ${passwordStrength ? 'progress-success' : 'progress-error'}`} value={passwordStrength ? 100 : 40} max="100"></progress>
                  <p className={`text-xs mt-1 ${passwordStrength ? 'text-success' : 'text-error'}`}>
                    {passwordStrength ? '✓ Strong password' : 'Use 8+ chars, uppercase & number'}
                  </p>
                </div>
              )}
            </div>
            <button type="submit" disabled={loading} className="btn btn-primary w-full btn-lg">
              {loading ? <span className="loading loading-spinner loading-sm"></span> : 'Create Account'}
            </button>
          </form>

          <p className="text-center mt-6 text-base-content/60">
            Already have an account?{' '}
            <Link to="/login" className="text-primary font-semibold hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
