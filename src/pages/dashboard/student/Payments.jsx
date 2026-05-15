import { useEffect, useState } from 'react'
import api from '../../../config/axios'

export default function Payments() {
  const [payments, setPayments] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/payments/my').then(r => setPayments(r.data)).finally(() => setLoading(false))
  }, [])

  const total = payments.reduce((s, p) => s + p.amount, 0)

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Payment History</h1>
        <p className="text-base-content/60 mt-1">All your tuition payment transactions</p>
      </div>

      <div className="stats shadow mb-8 w-full">
        <div className="stat">
          <div className="stat-title">Total Spent</div>
          <div className="stat-value text-primary">৳{total.toLocaleString()}</div>
          <div className="stat-desc">{payments.length} transaction{payments.length !== 1 ? 's' : ''}</div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><span className="loading loading-ring loading-lg text-primary"></span></div>
      ) : payments.length === 0 ? (
        <div className="text-center py-20 bg-base-100 rounded-2xl">
          <div className="text-6xl mb-4">💳</div>
          <p className="text-base-content/60">No payments yet</p>
        </div>
      ) : (
        <div className="card bg-base-100 shadow-md overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th>Transaction ID</th>
                <th>Tutor</th>
                <th>Amount</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {payments.map(p => (
                <tr key={p._id} className="hover">
                  <td className="font-mono text-xs text-base-content/60 truncate max-w-[120px]">{p.transactionId}</td>
                  <td>{p.tutorEmail}</td>
                  <td className="font-bold text-success">৳{p.amount?.toLocaleString()}</td>
                  <td className="text-sm text-base-content/60">{new Date(p.date).toLocaleDateString()}</td>
                  <td><div className="badge badge-success badge-sm">{p.status}</div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
