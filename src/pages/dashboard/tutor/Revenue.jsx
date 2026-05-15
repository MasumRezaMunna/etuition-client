import { useEffect, useState } from 'react'
import api from '../../../config/axios'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

export default function TutorRevenue() {
  const [payments, setPayments] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/payments/tutor').then(r => setPayments(r.data)).finally(() => setLoading(false))
  }, [])

  const total = payments.reduce((s, p) => s + p.amount, 0)

  // Group by month for chart
  const chartData = payments.reduce((acc, p) => {
    const month = new Date(p.date).toLocaleDateString('en-US', { month: 'short', year: '2-digit' })
    const existing = acc.find(a => a.month === month)
    if (existing) existing.amount += p.amount
    else acc.push({ month, amount: p.amount })
    return acc
  }, [])

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Revenue History</h1>
        <p className="text-base-content/60 mt-1">Your total earnings and transaction history</p>
      </div>

      <div className="stats shadow mb-8 w-full">
        <div className="stat">
          <div className="stat-title">Total Earned</div>
          <div className="stat-value text-success">৳{total.toLocaleString()}</div>
          <div className="stat-desc">{payments.length} payment{payments.length !== 1 ? 's' : ''}</div>
        </div>
      </div>

      {chartData.length > 0 && (
        <div className="card bg-base-100 shadow-md p-6 mb-8">
          <h3 className="font-bold text-lg mb-4">Monthly Earnings</h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={v => `৳${v.toLocaleString()}`} />
              <Bar dataKey="amount" fill="#6366f1" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-10"><span className="loading loading-ring loading-lg text-primary"></span></div>
      ) : payments.length === 0 ? (
        <div className="text-center py-20 bg-base-100 rounded-2xl">
          <div className="text-6xl mb-4">💰</div>
          <p className="text-base-content/60">No earnings yet</p>
        </div>
      ) : (
        <div className="card bg-base-100 shadow-md overflow-x-auto">
          <table className="table">
            <thead>
              <tr><th>Transaction ID</th><th>Student</th><th>Amount</th><th>Date</th></tr>
            </thead>
            <tbody>
              {payments.map(p => (
                <tr key={p._id} className="hover">
                  <td className="font-mono text-xs text-base-content/60 truncate max-w-[120px]">{p.transactionId}</td>
                  <td>{p.studentEmail}</td>
                  <td className="font-bold text-success">৳{p.amount?.toLocaleString()}</td>
                  <td className="text-sm">{new Date(p.date).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
