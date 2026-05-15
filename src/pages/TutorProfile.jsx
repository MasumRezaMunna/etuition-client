import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import api from '../config/axios'

export default function TutorProfile() {
  const { id } = useParams()
  const [tutor, setTutor] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get(`/users/${id}`).then((r) => setTutor(r.data)).finally(() => setLoading(false))
  }, [id])

  if (loading) return <div className="flex justify-center py-32"><span className="loading loading-ring loading-lg text-primary"></span></div>
  if (!tutor || tutor.role !== 'tutor') return <div className="text-center py-32"><h2 className="text-2xl">Tutor not found</h2></div>

  return (
    <div className="min-h-screen bg-base-200 py-10">
      <div className="max-w-2xl mx-auto px-4">
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body items-center text-center p-10">
            <div className="avatar mb-4">
              <div className="w-32 rounded-full ring ring-primary ring-offset-base-100 ring-offset-4">
                <img src={tutor.photoURL || `https://api.dicebear.com/7.x/initials/svg?seed=${tutor.name}`} alt={tutor.name} />
              </div>
            </div>
            <h1 className="text-3xl font-extrabold">{tutor.name}</h1>
            <div className="badge badge-primary badge-lg mt-1">Verified Tutor</div>
            <div className="divider"></div>
            <div className="w-full space-y-3 text-left">
              <div className="flex items-center gap-3 p-3 bg-base-200 rounded-xl">
                <span className="text-2xl">✉️</span>
                <div>
                  <p className="text-xs text-base-content/50">Email</p>
                  <p className="font-medium">{tutor.email}</p>
                </div>
              </div>
              {tutor.phone && (
                <div className="flex items-center gap-3 p-3 bg-base-200 rounded-xl">
                  <span className="text-2xl">📞</span>
                  <div>
                    <p className="text-xs text-base-content/50">Phone</p>
                    <p className="font-medium">{tutor.phone}</p>
                  </div>
                </div>
              )}
              <div className="flex items-center gap-3 p-3 bg-base-200 rounded-xl">
                <span className="text-2xl">📅</span>
                <div>
                  <p className="text-xs text-base-content/50">Member Since</p>
                  <p className="font-medium">{new Date(tutor.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
