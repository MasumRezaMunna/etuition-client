import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../config/axios'

export default function Tutors() {
  const [tutors, setTutors] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/users/tutors').then((r) => setTutors(r.data)).finally(() => setLoading(false))
  }, [])

  return (
    <div className="min-h-screen bg-base-200 py-10">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold mb-3">Our Tutors</h1>
          <p className="text-base-content/60">Verified, passionate educators ready to help you learn</p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20"><span className="loading loading-ring loading-lg text-primary"></span></div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tutors.map((tutor) => (
              <div key={tutor._id} className="card bg-base-100 shadow-md card-hover">
                <div className="card-body items-center text-center p-6">
                  <div className="avatar mb-3">
                    <div className="w-24 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                      <img src={tutor.photoURL || `https://api.dicebear.com/7.x/initials/svg?seed=${tutor.name}`} alt={tutor.name} />
                    </div>
                  </div>
                  <h3 className="font-bold text-xl">{tutor.name}</h3>
                  <div className="badge badge-primary badge-outline">Tutor</div>
                  <p className="text-sm text-base-content/60 mt-2">{tutor.email}</p>
                  {tutor.phone && <p className="text-sm text-base-content/60">📞 {tutor.phone}</p>}
                  <Link to={`/tutors/${tutor._id}`} className="btn btn-primary btn-sm btn-outline mt-4 w-full">
                    View Profile
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
