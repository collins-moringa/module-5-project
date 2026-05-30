import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { patientsAPI, doctorsAPI, appointmentsAPI } from '../services/api'
import { useAuth } from '../context/AuthContext'

export default function Dashboard() {
  const { user } = useAuth()
  const [stats, setStats] = useState({ patients: 0, doctors: 0, appointments: 0, scheduled: 0 })
  const [recentAppointments, setRecentAppointments] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      patientsAPI.getAll(),
      doctorsAPI.getAll(),
      appointmentsAPI.getAll(),
      appointmentsAPI.getAll({ status: 'scheduled' }),
    ]).then(([p, d, a, s]) => {
      setStats({
        patients: p.data.patients.length,
        doctors: d.data.doctors.length,
        appointments: a.data.appointments.length,
        scheduled: s.data.appointments.length,
      })
      setRecentAppointments(a.data.appointments.slice(0, 5))
    }).finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="loading"><div className="spinner" /></div>

  const statusBadge = (status) => (
    <span className={`badge badge-${status}`}>{status}</span>
  )

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">Welcome back, {user?.username} 👋</p>
        </div>
        <Link to="/appointments/new" className="btn btn-primary">
          + New Appointment
        </Link>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon blue">👥</div>
          <div className="stat-info">
            <h3>{stats.patients}</h3>
            <p>Total Patients</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon green">🩺</div>
          <div className="stat-info">
            <h3>{stats.doctors}</h3>
            <p>Total Doctors</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon yellow">📅</div>
          <div className="stat-info">
            <h3>{stats.appointments}</h3>
            <p>Total Appointments</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon blue">⏰</div>
          <div className="stat-info">
            <h3>{stats.scheduled}</h3>
            <p>Scheduled</p>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h2>Recent Appointments</h2>
          <Link to="/appointments" className="btn btn-ghost btn-sm">View All</Link>
        </div>
        <div className="table-wrapper">
          {recentAppointments.length === 0 ? (
            <div className="empty-state">
              <div className="icon">📅</div>
              <h3>No appointments yet</h3>
              <p>Schedule the first appointment to see it here.</p>
            </div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Patient</th>
                  <th>Doctor</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Reason</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentAppointments.map((a) => (
                  <tr key={a.id}>
                    <td><strong>{a.patient_name}</strong></td>
                    <td>{a.doctor_name}</td>
                    <td>{a.date}</td>
                    <td>{a.time}</td>
                    <td style={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{a.reason}</td>
                    <td>{statusBadge(a.status)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 16 }}>
        <div className="card" style={{ padding: 20 }}>
          <h3 style={{ marginBottom: 12, fontSize: '0.9rem', fontWeight: 600 }}>Quick Actions</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <Link to="/patients/new" className="btn btn-ghost">+ Register Patient</Link>
            <Link to="/doctors/new" className="btn btn-ghost">+ Add Doctor</Link>
            <Link to="/appointments/new" className="btn btn-ghost">+ Schedule Appointment</Link>
          </div>
        </div>
        <div className="card" style={{ padding: 20 }}>
          <h3 style={{ marginBottom: 12, fontSize: '0.9rem', fontWeight: 600 }}>System Info</h3>
          <div style={{ fontSize: '0.875rem', color: 'var(--gray-600)', display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div>Logged in as: <strong>{user?.username}</strong></div>
            <div>Role: <strong>{user?.role}</strong></div>
            <div>Email: <strong>{user?.email}</strong></div>
          </div>
        </div>
      </div>
    </div>
  )
}
