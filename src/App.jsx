import { Routes, Route } from 'react-router-dom'
import MainLayout from './components/shared/MainLayout'
import DashboardLayout from './components/shared/DashboardLayout'
import PrivateRoute from './components/shared/PrivateRoute'
import RoleRoute from './components/shared/RoleRoute'

import Home from './pages/Home'
import Tuitions from './pages/Tuitions'
import TuitionDetails from './pages/TuitionDetails'
import Tutors from './pages/Tutors'
import TutorProfile from './pages/TutorProfile'
import About from './pages/About'
import Contact from './pages/Contact'
import Login from './pages/Login'
import Register from './pages/Register'
import ErrorPage from './pages/ErrorPage'

// Student Dashboard
import StudentMyTuitions from './pages/dashboard/student/MyTuitions'
import StudentPostTuition from './pages/dashboard/student/PostTuition'
import StudentAppliedTutors from './pages/dashboard/student/AppliedTutors'
import StudentPayments from './pages/dashboard/student/Payments'
import StudentProfile from './pages/dashboard/student/Profile'
import CheckoutPage from './pages/dashboard/student/Checkout'

// Tutor Dashboard
import TutorApplications from './pages/dashboard/tutor/MyApplications'
import TutorOngoing from './pages/dashboard/tutor/OngoingTuitions'
import TutorRevenue from './pages/dashboard/tutor/Revenue'
import TutorProfileSettings from './pages/dashboard/tutor/TutorProfile'

// Admin Dashboard
import AdminUsers from './pages/dashboard/admin/UserManagement'
import AdminTuitions from './pages/dashboard/admin/TuitionManagement'
import AdminReports from './pages/dashboard/admin/Reports'

export default function App() {
  return (
    <Routes>
      {/* Public */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/tuitions" element={<Tuitions />} />
        <Route path="/tuitions/:id" element={<TuitionDetails />} />
        <Route path="/tutors" element={<Tutors />} />
        <Route path="/tutors/:id" element={<TutorProfile />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      {/* Dashboard - protected */}
      <Route element={<PrivateRoute><DashboardLayout /></PrivateRoute>}>
        {/* Student */}
        <Route path="/dashboard/student/my-tuitions" element={<RoleRoute roles={['student']}><StudentMyTuitions /></RoleRoute>} />
        <Route path="/dashboard/student/post-tuition" element={<RoleRoute roles={['student']}><StudentPostTuition /></RoleRoute>} />
        <Route path="/dashboard/student/applied-tutors" element={<RoleRoute roles={['student']}><StudentAppliedTutors /></RoleRoute>} />
        <Route path="/dashboard/student/payments" element={<RoleRoute roles={['student']}><StudentPayments /></RoleRoute>} />
        <Route path="/dashboard/student/profile" element={<RoleRoute roles={['student']}><StudentProfile /></RoleRoute>} />
        <Route path="/dashboard/student/checkout/:applicationId" element={<RoleRoute roles={['student']}><CheckoutPage /></RoleRoute>} />

        {/* Tutor */}
        <Route path="/dashboard/tutor/applications" element={<RoleRoute roles={['tutor']}><TutorApplications /></RoleRoute>} />
        <Route path="/dashboard/tutor/ongoing" element={<RoleRoute roles={['tutor']}><TutorOngoing /></RoleRoute>} />
        <Route path="/dashboard/tutor/revenue" element={<RoleRoute roles={['tutor']}><TutorRevenue /></RoleRoute>} />
        <Route path="/dashboard/tutor/profile" element={<RoleRoute roles={['tutor']}><TutorProfileSettings /></RoleRoute>} />

        {/* Admin */}
        <Route path="/dashboard/admin/users" element={<RoleRoute roles={['admin']}><AdminUsers /></RoleRoute>} />
        <Route path="/dashboard/admin/tuitions" element={<RoleRoute roles={['admin']}><AdminTuitions /></RoleRoute>} />
        <Route path="/dashboard/admin/reports" element={<RoleRoute roles={['admin']}><AdminReports /></RoleRoute>} />
      </Route>

      <Route path="*" element={<ErrorPage />} />
    </Routes>
  )
}
