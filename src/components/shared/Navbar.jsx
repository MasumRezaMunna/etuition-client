import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import toast from 'react-hot-toast'
import { FaGraduationCap } from 'react-icons/fa'

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/tuitions', label: 'Tuitions' },
  { to: '/tutors', label: 'Tutors' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
]

function getDashboardPath(role) {
  if (role === 'admin') return '/dashboard/admin/users'
  if (role === 'tutor') return '/dashboard/tutor/applications'
  return '/dashboard/student/my-tuitions'
}

export default function Navbar() {
  const { user, dbUser, logout } = useAuth()
  const navigate = useNavigate()

  async function handleLogout() {
    await logout()
    toast.success('Logged out')
    navigate('/')
  }

  const links = (
    <>
      {navLinks.map((l) => (
        <li key={l.to}>
          <NavLink
            to={l.to}
            end={l.to === '/'}
            className={({ isActive }) => isActive ? 'text-primary font-semibold' : ''}
          >
            {l.label}
          </NavLink>
        </li>
      ))}
    </>
  )

  return (
    <div className="navbar bg-base-100 shadow-sm sticky top-0 z-50">
      <div className="navbar-start">
        <div className="dropdown">
          <label tabIndex={0} className="btn btn-ghost lg:hidden">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" />
            </svg>
          </label>
          <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
            {links}
          </ul>
        </div>
        <Link to="/" className="btn btn-ghost text-xl gap-2">
          <FaGraduationCap className="text-primary text-2xl" />
          <span className="font-bold text-primary">eTuitionBd</span>
        </Link>
      </div>

      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1 gap-1">{links}</ul>
      </div>

      <div className="navbar-end gap-2">
        {user && dbUser ? (
          <>
            <Link to={getDashboardPath(dbUser.role)} className="btn btn-primary btn-sm hidden sm:flex">
              Dashboard
            </Link>
            <div className="dropdown dropdown-end">
              <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
                <div className="w-9 rounded-full ring ring-primary ring-offset-base-100 ring-offset-1">
                  <img
                    src={dbUser.photoURL || `https://api.dicebear.com/7.x/initials/svg?seed=${dbUser.name}`}
                    alt={dbUser.name}
                  />
                </div>
              </label>
              <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
                <li className="menu-title px-4 py-2">
                  <p className="font-semibold text-base-content">{dbUser.name}</p>
                  <p className="text-xs text-base-content/50 capitalize">{dbUser.role}</p>
                </li>
                <div className="divider my-0" />
                <li><Link to={getDashboardPath(dbUser.role)}>Dashboard</Link></li>
                <li><button onClick={handleLogout} className="text-error">Logout</button></li>
              </ul>
            </div>
          </>
        ) : (
          <>
            <Link to="/login" className="btn btn-ghost btn-sm">Login</Link>
            <Link to="/register" className="btn btn-primary btn-sm">Register</Link>
          </>
        )}
      </div>
    </div>
  )
}
