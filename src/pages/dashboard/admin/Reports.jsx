import { useEffect, useState } from 'react'
import api from '../../../config/axios'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, LineChart, Line,
} from 'recharts'

const COLORS = ['#6366f1', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444']

export default function AdminReports() {
  const [payments, setPayments] = useState([])
  const [users, setUsers] = useState([])
  const [tuitions, setTuitions] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      api.get('/payments/all'),
      api.get('/users'),
      api.get('/tuitions/all-admin'),
    ]).then(([p, u, t]) => {
      setPayments(p.data.payments || [])
      setUsers(u.data || [])
      setTuitions(t.data || [])
    }).finally(() => setLoading(false))
  }, [])

  const totalRevenue = payments.reduce((s, p) => s + p.amount, 0)

  // Monthly revenue chart data
  const monthlyRevenue = payments.reduce((acc, p) => {
    const month = new Date(p.date).toLocaleDateString('en-US', { month: 'short', year: '2-digit' })
    const ex = acc.find(a => a.month === month)
    if (ex) ex.revenue += p.amount
    else acc.push({ month, revenue: p.amount })
    return acc
  }, [])

  // User role distribution for pie
  const roleData = ['student', 'tutor', 'admin'].map(role => ({
    name: role.charAt(0).toUpperCase() + role.slice(1) + 's',
    value: users.filter(u => u.role === role).length,
  })).filter(d => d.value > 0)

  // Tuition status distribution
  const tuitionStatusData = ['pending', 'approved', 'rejected'].map(s => ({
    name: s.charAt(0).toUpperCase() + s.slice(1),
    value: tuitions.filter(t => t.status === s).length,
  })).filter(d => d.value > 0)

  if (loading) return <div className="flex justify-center py-20"><span className="loading loading-ring loading-lg text-primary"></span></div>

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Reports & Analytics</h1>
        <p className="text-base-content/60 mt-1">Platform performance and financial overview</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Revenue', value: `৳${totalRevenue.toLocaleString()}`, icon: '💰', color: 'text-success' },
          { label: 'Total Users', value: users.length, icon: '👥', color: 'text-primary' },
          { label: 'Total Tuitions', value: tuitions.length, icon: '📚', color: 'text-secondary' },
          { label: 'Transactions', value: payments.length, icon: '💳', color: 'text-warning' },
        ].map(kpi => (
          <div key={kpi.label} className="card bg-base-100 shadow-md p-5">
            <div className="text-3xl mb-2">{kpi.icon}</div>
            <div className={`text-2xl font-black ${kpi.color}`}>{kpi.value}</div>
            <div className="text-xs text-base-content/50 mt-1">{kpi.label}</div>
          </div>
        ))}
      </div>

      {/* Charts Row 1 */}
      <div className="grid md:grid-cols-2 gap-6 mb-6">
        {/* Monthly Revenue */}
        <div className="card bg-base-100 shadow-md p-6">
          <h3 className="font-bold text-lg mb-4">Monthly Revenue (৳)</h3>
          {monthlyRevenue.length === 0 ? (
            <div className="text-center py-10 text-base-content/40">No transaction data yet</div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={monthlyRevenue}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip formatter={v => `৳${v.toLocaleString()}`} />
                <Bar dataKey="revenue" fill="#6366f1" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* User Distribution */}
        <div className="card bg-base-100 shadow-md p-6">
          <h3 className="font-bold text-lg mb-4">User Distribution</h3>
          {roleData.length === 0 ? (
            <div className="text-center py-10 text-base-content/40">No user data</div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={roleData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label={({ name, value }) => `${name}: ${value}`}>
                  {roleData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Legend />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {/* Tuition Status */}
        <div className="card bg-base-100 shadow-md p-6">
          <h3 className="font-bold text-lg mb-4">Tuition Status Breakdown</h3>
          {tuitionStatusData.length === 0 ? (
            <div className="text-center py-10 text-base-content/40">No tuition data</div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={tuitionStatusData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                  {tuitionStatusData.map((_, i) => <Cell key={i} fill={['#f59e0b', '#10b981', '#ef4444'][i]} />)}
                </Pie>
                <Legend />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Recent Transactions */}
        <div className="card bg-base-100 shadow-md p-6">
          <h3 className="font-bold text-lg mb-4">Recent Transactions</h3>
          {payments.length === 0 ? (
            <div className="text-center py-10 text-base-content/40">No transactions yet</div>
          ) : (
            <div className="space-y-3 max-h-52 overflow-y-auto pr-1">
              {payments.slice(0, 8).map(p => (
                <div key={p._id} className="flex items-center justify-between py-2 border-b border-base-200 last:border-0">
                  <div>
                    <p className="text-sm font-medium truncate max-w-[160px]">{p.studentEmail}</p>
                    <p className="text-xs text-base-content/50">{new Date(p.date).toLocaleDateString()}</p>
                  </div>
                  <div className="text-success font-bold text-sm">+৳{p.amount?.toLocaleString()}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Full Transaction Table */}
      <div className="card bg-base-100 shadow-md">
        <div className="card-body p-6">
          <h3 className="font-bold text-lg mb-4">All Transactions</h3>
          {payments.length === 0 ? (
            <div className="text-center py-10 text-base-content/40">No transactions yet</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="table table-sm">
                <thead>
                  <tr>
                    <th>Transaction ID</th>
                    <th>Student</th>
                    <th>Tutor</th>
                    <th>Amount</th>
                    <th>Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.map(p => (
                    <tr key={p._id} className="hover">
                      <td className="font-mono text-xs truncate max-w-[100px]">{p.transactionId}</td>
                      <td className="text-sm truncate max-w-[120px]">{p.studentEmail}</td>
                      <td className="text-sm truncate max-w-[120px]">{p.tutorEmail}</td>
                      <td className="font-bold text-success">৳{p.amount?.toLocaleString()}</td>
                      <td className="text-sm text-base-content/60">{new Date(p.date).toLocaleDateString()}</td>
                      <td><div className="badge badge-success badge-xs">{p.status}</div></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
