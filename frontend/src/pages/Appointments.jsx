import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { appointmentsAPI } from '../services/api'

const STATUS_OPTIONS = ['', 'scheduled', 'completed', 'cancelled']

export default function Appointments() {
  const [appointments, setAppointments] = useState([])
  const [statusFilter, setStatusFilter] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchAppointments = async (status = '') => {
    setLoading(true)
    try {
      const params = status ? { status } : {}
      const res = await appointmentsAPI.getAll(params)
      setAppointments(res.data.appointments)
    } catch {
      setError('Failed to load appointments.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchAppointments(statusFilter) }, [statusFilter])

  const handleDelete = async (id) => {
    if (!window.confirm('Cancel this appointment?')) return
    try {
      await appointmentsAPI.delete(id)
      setAppointments((prev) => prev.filter((a) => a.id !== id))
    } catch {
      alert('Failed to cancel appointment.')
    }
  }

  const statusBadge = (status) => (
    <span className={`badge badge-${status}`}>{status}</span>
  )

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Appointments</h1>
          <p className="page-subtitle">{appointments.length} appointment{appointments.length !== 1 ? 's' : ''}</p>
        </div>
        <Link to="/appointments/new" className="btn btn-primary">+ Schedule Appointment</Link>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <div className="card">
        <div className="card-header">
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <label htmlFor="statusFilter" style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--gray-600)', marginBottom: 0 }}>
              Filter by status:
            </label>
            <select
              id="statusFilter"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{ width: 'auto', padding: '6px 12px' }}
            >
              <option value="">All</option>
              <option value="scheduled">Scheduled</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        <div className="table-wrapper">
          {loading ? (
            <div className="loading"><div className="spinner" /></div>
          ) : appointments.length === 0 ? (
            <div className="empty-state">
              <div className="icon">📅</div>
              <h3>No appointments found</h3>
              <p>Schedule the first appointment to get started.</p>
              <Link to="/appointments/new" className="btn btn-primary" style={{ marginTop: 12 }}>
                Schedule Appointment
              </Link>
            </div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Patient</th>
                  <th>Doctor</th>
                  <th>Specialization</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Reason</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map((a) => (
                  <tr key={a.id}>
                    <td style={{ color: 'var(--gray-400)' }}>{a.id}</td>
                    <td><strong>{a.patient_name}</strong></td>
                    <td>{a.doctor_name}</td>
                    <td>
                      <span style={{ background: 'var(--primary-light)', color: 'var(--primary-dark)', padding: '2px 8px', borderRadius: 999, fontSize: '0.75rem', fontWeight: 500 }}>
                        {a.doctor_specialization}
                      </span>
                    </td>
                    <td>{a.date}</td>
                    <td>{a.time}</td>
                    <td style={{ maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {a.reason}
                    </td>
                    <td>{statusBadge(a.status)}</td>
                    <td>
                      <div className="table-actions">
                        <Link to={`/appointments/${a.id}/edit`} className="btn btn-ghost btn-sm">Edit</Link>
                        <button className="btn btn-danger btn-sm" onClick={() => handleDelete(a.id)}>Cancel</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}
