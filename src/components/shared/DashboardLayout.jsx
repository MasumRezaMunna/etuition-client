import { Outlet, NavLink, Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { FaGraduationCap, FaHome } from 'react-icons/fa'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

const studentLinks = [
  { to: '/dashboard/student/my-tuitions', label: 'My Tuitions', icon: '📋' },
  { to: '/dashboard/student/post-tuition', label: 'Post Tuition', icon: '✏️' },
  { to: '/dashboard/student/applied-tutors', label: 'Applied Tutors', icon: '👨‍🏫' },
  { to: '/dashboard/student/payments', label: 'Payments', icon: '💳' },
  { to: '/dashboard/student/profile', label: 'Profile Settings', icon: '⚙️' },
]
const tutorLinks = [
  { to: '/dashboard/tutor/applications', label: 'My Applications', icon: '📝' },
  { to: '/dashboard/tutor/ongoing', label: 'Ongoing Tuitions', icon: '🎓' },
  { to: '/dashboard/tutor/revenue', label: 'Revenue', icon: '💰' },
  { to: '/dashboard/tutor/profile', label: 'Profile Settings', icon: '⚙️' },
]
const adminLinks = [
  { to: '/dashboard/admin/users', label: 'User Management', icon: '👥' },
  { to: '/dashboard/admin/tuitions', label: 'Tuition Management', icon: '📚' },
  { to: '/dashboard/admin/reports', label: 'Reports & Analytics', icon: '📊' },
]

export default function DashboardLayout() {
  const { dbUser, logout } = useAuth()
  const navigate = useNavigate()

  const links = dbUser?.role === 'admin' ? adminLinks : dbUser?.role === 'tutor' ? tutorLinks : studentLinks

  async function handleLogout() {
    await logout()
    toast.success('Logged out')
    navigate('/')
  }

  return (
    <div className="drawer lg:drawer-open min-h-screen">
      <input id="dashboard-drawer" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content flex flex-col">
        {/* Mobile topbar */}
        <div className="navbar bg-base-100 shadow-sm lg:hidden">
          <label htmlFor="dashboard-drawer" className="btn btn-ghost drawer-button">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </label>
          <span className="font-bold text-primary">Dashboard</span>
        </div>
        <main className="flex-1 p-4 lg:p-8 bg-base-200 min-h-screen">
          <Outlet />
        </main>
      </div>

      <div className="drawer-side z-40">
        <label htmlFor="dashboard-drawer" className="drawer-overlay"></label>
        <aside className="bg-base-100 w-64 min-h-screen flex flex-col shadow-xl">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 p-6 border-b border-base-200">
            <FaGraduationCap className="text-primary text-2xl" />
            <span className="font-bold text-primary text-lg">eTuitionBd</span>
          </Link>

          {/* User info */}
          <div className="p-4 border-b border-base-200">
            <div className="flex items-center gap-3">
              <div className="avatar">
                <div className="w-10 rounded-full ring ring-primary ring-offset-base-100 ring-offset-1">
                  <img src={dbUser?.photoURL || `https://api.dicebear.com/7.x/initials/svg?seed=${dbUser?.name}`} alt="" />
                </div>
              </div>
              <div className="overflow-hidden">
                <p className="font-semibold text-sm truncate">{dbUser?.name}</p>
                <p className="text-xs text-base-content/50 capitalize badge badge-primary badge-outline badge-xs">{dbUser?.role}</p>
              </div>
            </div>
          </div>

          {/* Nav Links */}
          <ul className="menu flex-1 p-4 gap-1">
            {links.map((link) => (
              <li key={link.to}>
                <NavLink
                  to={link.to}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-lg ${isActive ? 'bg-primary text-primary-content font-semibold' : 'hover:bg-base-200'}`
                  }
                >
                  <span>{link.icon}</span>
                  {link.label}
                </NavLink>
              </li>
            ))}
            <div className="divider my-2"></div>
            <li>
              <Link to="/" className="flex items-center gap-3 hover:bg-base-200 rounded-lg">
                <FaHome /> Home
              </Link>
            </li>
            <li>
              <button onClick={handleLogout} className="flex items-center gap-3 hover:bg-error/10 text-error rounded-lg">
                🚪 Logout
              </button>
            </li>
          </ul>
        </aside>
      </div>
    </div>
  )
}
