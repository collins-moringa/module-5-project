import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { doctorsAPI } from '../services/api'

export default function Doctors() {
  const [doctors, setDoctors] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchDoctors = async (q = '') => {
    setLoading(true)
    try {
      const res = await doctorsAPI.getAll(q)
      setDoctors(res.data.doctors)
    } catch {
      setError('Failed to load doctors.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchDoctors() }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    fetchDoctors(search)
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Remove this doctor from the system?')) return
    try {
      await doctorsAPI.delete(id)
      setDoctors((prev) => prev.filter((d) => d.id !== id))
    } catch {
      alert('Failed to delete doctor.')
    }
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Doctors</h1>
          <p className="page-subtitle">{doctors.length} registered doctor{doctors.length !== 1 ? 's' : ''}</p>
        </div>
        <Link to="/doctors/new" className="btn btn-primary">+ Add Doctor</Link>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <div className="card">
        <div className="card-header">
          <form className="search-bar" onSubmit={handleSearch} style={{ margin: 0 }}>
            <input
              type="text"
              placeholder="Search by name or specialization..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button type="submit" className="btn btn-ghost">Search</button>
            {search && (
              <button type="button" className="btn btn-ghost" onClick={() => { setSearch(''); fetchDoctors('') }}>
                Clear
              </button>
            )}
          </form>
        </div>

        <div className="table-wrapper">
          {loading ? (
            <div className="loading"><div className="spinner" /></div>
          ) : doctors.length === 0 ? (
            <div className="empty-state">
              <div className="icon">🩺</div>
              <h3>No doctors found</h3>
              <p>Add the first doctor to the system.</p>
              <Link to="/doctors/new" className="btn btn-primary" style={{ marginTop: 12 }}>Add Doctor</Link>
            </div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Specialization</th>
                  <th>Contact</th>
                  <th>Email</th>
                  <th>Appointments</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {doctors.map((d) => (
                  <tr key={d.id}>
                    <td style={{ color: 'var(--gray-400)' }}>{d.id}</td>
                    <td><strong>{d.name}</strong></td>
                    <td>
                      <span style={{ background: 'var(--primary-light)', color: 'var(--primary-dark)', padding: '2px 8px', borderRadius: 999, fontSize: '0.8rem', fontWeight: 500 }}>
                        {d.specialization}
                      </span>
                    </td>
                    <td>{d.contact}</td>
                    <td>{d.email || '—'}</td>
                    <td><span className="badge badge-scheduled">{d.appointment_count}</span></td>
                    <td>
                      <div className="table-actions">
                        <Link to={`/doctors/${d.id}/edit`} className="btn btn-ghost btn-sm">Edit</Link>
                        <button className="btn btn-danger btn-sm" onClick={() => handleDelete(d.id)}>Delete</button>
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
