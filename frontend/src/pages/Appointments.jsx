import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { appointmentsAPI } from '../services/api'

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
      setError('Could not load appointments. Is the server running?')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchAppointments(statusFilter) }, [statusFilter])

  const handleDelete = async (id) => {
    if (!window.confirm('Cancel this appointment? This action cannot be undone.')) return
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

  const filterBtns = [
    { value: '', label: 'All' },
    { value: 'scheduled', label: 'Scheduled' },
    { value: 'completed', label: 'Completed' },
    { value: 'cancelled', label: 'Cancelled' },
  ]

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Appointments</h1>
          <p className="page-subtitle">
            {appointments.length} appointment{appointments.length !== 1 ? 's' : ''}
            {statusFilter ? ` — ${statusFilter}` : ''}
          </p>
        </div>
        <Link to="/appointments/new" className="btn btn-primary">Schedule Appointment</Link>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <div className="card">
        <div className="card-header">
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {filterBtns.map((f) => (
              <button
                key={f.value}
                className={`btn btn-sm ${statusFilter === f.value ? 'btn-primary' : 'btn-ghost'}`}
                onClick={() => setStatusFilter(f.value)}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        <div className="table-wrapper">
          {loading ? (
            <div className="loading"><div className="spinner" /><p>Loading appointments...</p></div>
          ) : appointments.length === 0 ? (
            <div className="empty-state">
              <h3>{statusFilter ? `No ${statusFilter} appointments` : 'No appointments yet'}</h3>
              <p>{statusFilter ? 'Try a different filter.' : 'Schedule the first appointment to get started.'}</p>
              {!statusFilter && <Link to="/appointments/new" className="btn btn-primary">Schedule Now</Link>}
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
                    <td style={{ color: 'var(--gray-400)', fontWeight: 600 }}>#{a.id}</td>
                    <td><strong>{a.patient_name}</strong></td>
                    <td style={{ color: 'var(--gray-600)' }}>{a.doctor_name}</td>
                    <td><span className="specialty-pill">{a.doctor_specialization}</span></td>
                    <td style={{ fontWeight: 600 }}>{a.date}</td>
                    <td style={{ color: 'var(--gray-500)' }}>{a.time}</td>
                    <td style={{ maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: 'var(--gray-500)' }}>
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
