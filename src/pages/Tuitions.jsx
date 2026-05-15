import { useEffect, useState, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import api from '../config/axios'
import TuitionCard from '../components/shared/TuitionCard'
import { FaSearch, FaFilter, FaSortAmountDown } from 'react-icons/fa'

const CLASS_LEVELS = ['1','2','3','4','5','6','7','8','9','10','SSC','HSC','O-Level','A-Level','University']
const SUBJECTS = ['Math','Physics','Chemistry','Biology','English','Bangla','ICT','Accounting','Economics','General Science']

export default function Tuitions() {
  const [tuitions, setTuitions] = useState([])
  const [loading, setLoading] = useState(false)
  const [totalPages, setTotalPages] = useState(1)
  const [searchParams, setSearchParams] = useSearchParams()

  const search = searchParams.get('search') || ''
  const subject = searchParams.get('subject') || ''
  const location = searchParams.get('location') || ''
  const classLevel = searchParams.get('classLevel') || ''
  const sortBy = searchParams.get('sortBy') || 'date_desc'
  const page = parseInt(searchParams.get('page') || '1')

  const [localSearch, setLocalSearch] = useState(search)

  const fetchTuitions = useCallback(async () => {
    setLoading(true)
    try {
      const params = { page, limit: 9 }
      if (search) params.search = search
      if (subject) params.subject = subject
      if (location) params.location = location
      if (classLevel) params.classLevel = classLevel
      if (sortBy) params.sortBy = sortBy
      const res = await api.get('/tuitions', { params })
      setTuitions(res.data.tuitions)
      setTotalPages(res.data.totalPages)
    } catch {}
    setLoading(false)
  }, [search, subject, location, classLevel, sortBy, page])

  useEffect(() => { fetchTuitions() }, [fetchTuitions])

  function setParam(key, value) {
    const p = Object.fromEntries(searchParams.entries())
    if (value) p[key] = value; else delete p[key]
    p.page = '1'
    setSearchParams(p)
  }

  function handleSearch(e) {
    e.preventDefault()
    setParam('search', localSearch)
  }

  return (
    <div className="min-h-screen bg-base-200 py-10">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold mb-3">Browse Tuitions</h1>
          <p className="text-base-content/60">Find the perfect tuition opportunity that matches your needs</p>
        </div>

        {/* Search & Filter Bar */}
        <div className="bg-base-100 rounded-2xl shadow-md p-6 mb-8">
          <form onSubmit={handleSearch} className="flex gap-3 mb-4">
            <div className="relative flex-1">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40" />
              <input
                type="text"
                className="input input-bordered w-full pl-10"
                placeholder="Search by subject or location..."
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
              />
            </div>
            <button type="submit" className="btn btn-primary gap-2">
              <FaSearch /> Search
            </button>
          </form>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <select className="select select-bordered" value={subject} onChange={(e) => setParam('subject', e.target.value)}>
              <option value="">All Subjects</option>
              {SUBJECTS.map((s) => <option key={s}>{s}</option>)}
            </select>
            <select className="select select-bordered" value={classLevel} onChange={(e) => setParam('classLevel', e.target.value)}>
              <option value="">All Classes</option>
              {CLASS_LEVELS.map((c) => <option key={c}>Class {c}</option>)}
            </select>
            <input
              type="text"
              className="input input-bordered"
              placeholder="Location..."
              value={location}
              onChange={(e) => setParam('location', e.target.value)}
            />
            <select className="select select-bordered" value={sortBy} onChange={(e) => setParam('sortBy', e.target.value)}>
              <option value="date_desc">Newest First</option>
              <option value="date_asc">Oldest First</option>
              <option value="budget_desc">Budget: High to Low</option>
              <option value="budget_asc">Budget: Low to High</option>
            </select>
          </div>

          {(search || subject || classLevel || location) && (
            <div className="flex gap-2 mt-3 flex-wrap">
              <span className="text-sm text-base-content/60">Active filters:</span>
              {search && <div className="badge badge-primary gap-1">{search} <button onClick={() => { setLocalSearch(''); setParam('search', '') }}>✕</button></div>}
              {subject && <div className="badge badge-secondary gap-1">{subject} <button onClick={() => setParam('subject', '')}>✕</button></div>}
              {classLevel && <div className="badge badge-accent gap-1">{classLevel} <button onClick={() => setParam('classLevel', '')}>✕</button></div>}
              {location && <div className="badge badge-info gap-1">{location} <button onClick={() => setParam('location', '')}>✕</button></div>}
            </div>
          )}
        </div>

        {/* Results */}
        {loading ? (
          <div className="flex justify-center py-20"><span className="loading loading-ring loading-lg text-primary"></span></div>
        ) : tuitions.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold mb-2">No tuitions found</h3>
            <p className="text-base-content/60">Try adjusting your filters or search terms</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tuitions.map((t) => <TuitionCard key={t._id} tuition={t} />)}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-10">
            <div className="join">
              <button
                className="join-item btn"
                disabled={page === 1}
                onClick={() => setParam('page', String(page - 1))}
              >«</button>
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i + 1}
                  className={`join-item btn ${page === i + 1 ? 'btn-primary' : ''}`}
                  onClick={() => setParam('page', String(i + 1))}
                >{i + 1}</button>
              ))}
              <button
                className="join-item btn"
                disabled={page === totalPages}
                onClick={() => setParam('page', String(page + 1))}
              >»</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
