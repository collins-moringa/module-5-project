import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { patientsAPI, doctorsAPI, appointmentsAPI } from '../services/api'
import { useAuth } from '../context/AuthContext'

export default function Dashboard() {
  const { user } = useAuth()
  const [stats, setStats] = useState({ patients: 0, doctors: 0, total: 0, scheduled: 0 })
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
        total: a.data.appointments.length,
        scheduled: s.data.appointments.length,
      })
      setRecentAppointments(a.data.appointments.slice(0, 6))
    }).finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner" />
        <p>Loading dashboard...</p>
      </div>
    )
  }

  const greet = () => {
    const h = new Date().getHours()
    if (h < 12) return 'Good morning'
    if (h < 17) return 'Good afternoon'
    return 'Good evening'
  }

  const statusBadge = (status) => (
    <span className={`badge badge-${status}`}>{status}</span>
  )

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">{greet()}, {user?.username}</h1>
          <p className="page-subtitle">Here is an overview of the hospital system</p>
        </div>
        <Link to="/appointments/new" className="btn btn-primary">
          New Appointment
        </Link>
      </div>

      <div className="stats-grid">
        <div className="stat-card blue">
          <div className="stat-icon-label">Patients</div>
          <div className="stat-info">
            <h3>{stats.patients}</h3>
            <p>Registered Patients</p>
          </div>
        </div>
        <div className="stat-card teal">
          <div className="stat-icon-label">Doctors</div>
          <div className="stat-info">
            <h3>{stats.doctors}</h3>
            <p>Active Doctors</p>
          </div>
        </div>
        <div className="stat-card amber">
          <div className="stat-icon-label">Total</div>
          <div className="stat-info">
            <h3>{stats.total}</h3>
            <p>Total Appointments</p>
          </div>
        </div>
        <div className="stat-card rose">
          <div className="stat-icon-label">Upcoming</div>
          <div className="stat-info">
            <h3>{stats.scheduled}</h3>
            <p>Scheduled</p>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 20 }}>
        <div className="card">
          <div className="card-header">
            <h2>Recent Appointments</h2>
            <Link to="/appointments" className="btn btn-ghost btn-sm">View All</Link>
          </div>
          <div className="table-wrapper">
            {recentAppointments.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">No appointments</div>
                <h3>Nothing scheduled yet</h3>
                <p>Schedule the first appointment to see it here.</p>
                <Link to="/appointments/new" className="btn btn-primary">Schedule Now</Link>
              </div>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>Patient</th>
                    <th>Doctor</th>
                    <th>Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentAppointments.map((a) => (
                    <tr key={a.id}>
                      <td><strong>{a.patient_name}</strong></td>
                      <td style={{ color: 'var(--gray-500)' }}>{a.doctor_name}</td>
                      <td>
                        {a.date}{' '}
                        <span style={{ color: 'var(--gray-400)', fontSize: '0.8rem' }}>{a.time}</span>
                      </td>
                      <td>{statusBadge(a.status)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="card card-body">
            <h3 style={{ fontWeight: 700, marginBottom: 14, fontSize: '0.95rem', color: 'var(--gray-700)' }}>
              Quick Actions
            </h3>
            <div className="quick-actions">
              <Link to="/patients/new" className="quick-action-btn">Register Patient</Link>
              <Link to="/doctors/new" className="quick-action-btn">Add Doctor</Link>
              <Link to="/appointments/new" className="quick-action-btn">Book Appointment</Link>
              <Link to="/appointments" className="quick-action-btn">View All Appointments</Link>
            </div>
          </div>

          <div className="card card-body info-card">
            <h3 style={{ fontWeight: 700, marginBottom: 12, fontSize: '0.9rem' }}>Your Account</h3>
            <div style={{ fontSize: '0.85rem', color: 'var(--gray-600)', display: 'flex', flexDirection: 'column', gap: 7 }}>
              <div>Username: <strong>{user?.username}</strong></div>
              <div>Role: <strong style={{ textTransform: 'capitalize' }}>{user?.role}</strong></div>
              <div>Email: <strong>{user?.email}</strong></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
