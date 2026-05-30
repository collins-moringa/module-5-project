import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { patientsAPI } from '../services/api'

export default function Patients() {
  const [patients, setPatients] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchPatients = async (q = '') => {
    setLoading(true)
    try {
      const res = await patientsAPI.getAll(q)
      setPatients(res.data.patients)
    } catch {
      setError('Could not load patients. Is the server running?')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchPatients() }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    fetchPatients(search)
  }

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Remove ${name} from the system? This cannot be undone.`)) return
    try {
      await patientsAPI.delete(id)
      setPatients((prev) => prev.filter((p) => p.id !== id))
    } catch {
      alert('Failed to delete patient. They may have linked appointments.')
    }
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Patients</h1>
          <p className="page-subtitle">
            {patients.length} patient{patients.length !== 1 ? 's' : ''} registered in the system
          </p>
        </div>
        <Link to="/patients/new" className="btn btn-primary">Register Patient</Link>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <div className="card">
        <div className="card-header">
          <form className="search-bar" onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Search by patient name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button type="submit" className="btn btn-ghost">Search</button>
            {search && (
              <button type="button" className="btn btn-ghost" onClick={() => { setSearch(''); fetchPatients('') }}>
                Clear
              </button>
            )}
          </form>
        </div>

        <div className="table-wrapper">
          {loading ? (
            <div className="loading"><div className="spinner" /><p>Loading patients...</p></div>
          ) : patients.length === 0 ? (
            <div className="empty-state">
              <h3>{search ? 'No patients match your search' : 'No patients yet'}</h3>
              <p>{search ? 'Try a different name.' : 'Register the first patient to get started.'}</p>
              {!search && <Link to="/patients/new" className="btn btn-primary">Register First Patient</Link>}
            </div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Age</th>
                  <th>Gender</th>
                  <th>Contact</th>
                  <th>Email</th>
                  <th>Appointments</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {patients.map((p) => (
                  <tr key={p.id}>
                    <td style={{ color: 'var(--gray-400)', fontWeight: 600 }}>#{p.id}</td>
                    <td><strong style={{ color: 'var(--gray-900)' }}>{p.name}</strong></td>
                    <td>{p.age} yrs</td>
                    <td>{p.gender}</td>
                    <td>{p.contact}</td>
                    <td style={{ color: 'var(--gray-500)' }}>{p.email || '—'}</td>
                    <td>
                      <span className="badge badge-count">
                        {p.appointment_count} appt{p.appointment_count !== 1 ? 's' : ''}
                      </span>
                    </td>
                    <td>
                      <div className="table-actions">
                        <Link to={`/patients/${p.id}/edit`} className="btn btn-ghost btn-sm">Edit</Link>
                        <button className="btn btn-danger btn-sm" onClick={() => handleDelete(p.id, p.name)}>
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
