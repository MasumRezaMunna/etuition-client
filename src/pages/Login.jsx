import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'
import { FaGoogle, FaGraduationCap, FaEye, FaEyeSlash } from 'react-icons/fa'

export default function Login() {
  const { login, googleLogin, dbUser } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname || getDashboardFromUser()
  const [form, setForm] = useState({ email: '', password: '' })
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)

  function getDashboardFromUser() {
    if (dbUser?.role === 'admin') return '/dashboard/admin/users'
    if (dbUser?.role === 'tutor') return '/dashboard/tutor/applications'
    return '/dashboard/student/my-tuitions'
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    try {
      await login(form.email, form.password)
      toast.success('Welcome back!')
      navigate(from, { replace: true })
    } catch (err) {
      toast.error(err.message?.replace('Firebase: ', '') || 'Login failed')
    }
    setLoading(false)
  }

  async function handleGoogle() {
    setLoading(true)
    try {
      await googleLogin()
      toast.success('Logged in with Google!')
      navigate('/dashboard/student/my-tuitions', { replace: true })
    } catch (err) {
      toast.error('Google login failed')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-base-100 to-secondary/10 flex items-center justify-center px-4 py-10">
      <div className="card bg-base-100 shadow-2xl w-full max-w-md">
        <div className="card-body p-8">
          <div className="text-center mb-6">
            <FaGraduationCap className="text-primary text-5xl mx-auto mb-3" />
            <h1 className="text-3xl font-extrabold">Welcome Back</h1>
            <p className="text-base-content/60 mt-1">Sign in to your eTuitionBd account</p>
          </div>

          <button onClick={handleGoogle} disabled={loading} className="btn btn-outline btn-lg w-full gap-3 mb-6">
            <FaGoogle className="text-red-500" /> Continue with Google
          </button>

          <div className="divider text-base-content/40 text-sm">or sign in with email</div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="form-control">
              <label className="label"><span className="label-text font-medium">Email</span></label>
              <input
                type="email"
                className="input input-bordered"
                placeholder="you@example.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>
            <div className="form-control">
              <label className="label"><span className="label-text font-medium">Password</span></label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  className="input input-bordered w-full pr-12"
                  placeholder="Your password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  required
                />
                <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-base-content/40" onClick={() => setShowPass(!showPass)}>
                  {showPass ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading} className="btn btn-primary w-full btn-lg">
              {loading ? <span className="loading loading-spinner loading-sm"></span> : 'Sign In'}
            </button>
          </form>

          <p className="text-center mt-6 text-base-content/60">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary font-semibold hover:underline">Register here</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
