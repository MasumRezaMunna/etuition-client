import { Link } from 'react-router-dom'
import { FaMapMarkerAlt, FaMoneyBillWave, FaBook, FaClock } from 'react-icons/fa'

export default function TuitionCard({ tuition }) {
  const statusColor = {
    approved: 'badge-success',
    pending: 'badge-warning',
    rejected: 'badge-error',
  }

  return (
    <div className="card bg-base-100 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-base-200">
      <div className="card-body p-5">
        <div className="flex justify-between items-start mb-3">
          <div className="badge badge-primary badge-outline">{tuition.medium || 'Any Medium'}</div>
          <div className={`badge ${statusColor[tuition.status] || 'badge-ghost'} badge-sm`}>{tuition.status}</div>
        </div>

        <h3 className="card-title text-lg font-bold line-clamp-1">
          {tuition.subject} — Class {tuition.classLevel}
        </h3>

        <div className="space-y-2 mt-2 text-sm text-base-content/70">
          <div className="flex items-center gap-2">
            <FaMapMarkerAlt className="text-primary shrink-0" />
            <span className="truncate">{tuition.location}</span>
          </div>
          <div className="flex items-center gap-2">
            <FaMoneyBillWave className="text-success shrink-0" />
            <span>৳{tuition.budget?.toLocaleString()} / month</span>
          </div>
          <div className="flex items-center gap-2">
            <FaClock className="text-warning shrink-0" />
            <span className="truncate">{tuition.schedule}</span>
          </div>
          <div className="flex items-center gap-2">
            <FaBook className="text-info shrink-0" />
            <span className="truncate line-clamp-1">{tuition.description || 'No description provided'}</span>
          </div>
        </div>

        <div className="card-actions justify-end mt-4">
          <Link to={`/tuitions/${tuition._id}`} className="btn btn-primary btn-sm">
            View Details
          </Link>
        </div>
      </div>
    </div>
  )
}
