import { Navigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import LoadingSpinner from './LoadingSpinner'

export default function RoleRoute({ children, roles }) {
  const { dbUser, loading } = useAuth()

  if (loading) return <LoadingSpinner />
  if (!dbUser) return <LoadingSpinner />
  if (!roles.includes(dbUser.role)) {
    const redirect = {
      student: '/dashboard/student/my-tuitions',
      tutor: '/dashboard/tutor/applications',
      admin: '/dashboard/admin/users',
    }
    return <Navigate to={redirect[dbUser.role] || '/'} replace />
  }
  return children
}
