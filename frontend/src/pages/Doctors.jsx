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
      setError('Could not load doctors. Is the server running?')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchDoctors() }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    fetchDoctors(search)
  }

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Remove ${name} from the system? This cannot be undone.`)) return
    try {
      await doctorsAPI.delete(id)
      setDoctors((prev) => prev.filter((d) => d.id !== id))
    } catch {
      alert('Failed to remove doctor. They may have linked appointments.')
    }
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Doctors</h1>
          <p className="page-subtitle">
            {doctors.length} doctor{doctors.length !== 1 ? 's' : ''} in the system
          </p>
        </div>
        <Link to="/doctors/new" className="btn btn-primary">Add Doctor</Link>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <div className="card">
        <div className="card-header">
          <form className="search-bar" onSubmit={handleSearch}>
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
            <div className="loading"><div className="spinner" /><p>Loading doctors...</p></div>
          ) : doctors.length === 0 ? (
            <div className="empty-state">
              <h3>{search ? 'No doctors match your search' : 'No doctors yet'}</h3>
              <p>{search ? 'Try searching by name or specialization.' : 'Add the first doctor to get started.'}</p>
              {!search && <Link to="/doctors/new" className="btn btn-primary">Add First Doctor</Link>}
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
                    <td style={{ color: 'var(--gray-400)', fontWeight: 600 }}>#{d.id}</td>
                    <td><strong style={{ color: 'var(--gray-900)' }}>{d.name}</strong></td>
                    <td><span className="specialty-pill">{d.specialization}</span></td>
                    <td>{d.contact}</td>
                    <td style={{ color: 'var(--gray-500)' }}>{d.email || '—'}</td>
                    <td>
                      <span className="badge badge-count">
                        {d.appointment_count} appt{d.appointment_count !== 1 ? 's' : ''}
                      </span>
                    </td>
                    <td>
                      <div className="table-actions">
                        <Link to={`/doctors/${d.id}/edit`} className="btn btn-ghost btn-sm">Edit</Link>
                        <button className="btn btn-danger btn-sm" onClick={() => handleDelete(d.id, d.name)}>
                          Delete
                        </button>
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
