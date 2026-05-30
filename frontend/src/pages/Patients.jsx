import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { patientsAPI } from '../services/api'

export default function Patients() {
  const [patients, setPatients] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [deleteId, setDeleteId] = useState(null)
  const [error, setError] = useState('')

  const fetchPatients = async (q = '') => {
    setLoading(true)
    try {
      const res = await patientsAPI.getAll(q)
      setPatients(res.data.patients)
    } catch {
      setError('Failed to load patients.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchPatients() }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    fetchPatients(search)
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Remove this patient from the system?')) return
    try {
      await patientsAPI.delete(id)
      setPatients((prev) => prev.filter((p) => p.id !== id))
    } catch {
      alert('Failed to delete patient.')
    }
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Patients</h1>
          <p className="page-subtitle">{patients.length} registered patient{patients.length !== 1 ? 's' : ''}</p>
        </div>
        <Link to="/patients/new" className="btn btn-primary">+ Register Patient</Link>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <div className="card">
        <div className="card-header">
          <form className="search-bar" onSubmit={handleSearch} style={{ margin: 0 }}>
            <input
              type="text"
              placeholder="Search by name..."
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
            <div className="loading"><div className="spinner" /></div>
          ) : patients.length === 0 ? (
            <div className="empty-state">
              <div className="icon">👥</div>
              <h3>No patients found</h3>
              <p>Register the first patient to get started.</p>
              <Link to="/patients/new" className="btn btn-primary" style={{ marginTop: 12 }}>Register Patient</Link>
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
                    <td style={{ color: 'var(--gray-400)' }}>{p.id}</td>
                    <td><strong>{p.name}</strong></td>
                    <td>{p.age}</td>
                    <td>{p.gender}</td>
                    <td>{p.contact}</td>
                    <td>{p.email || '—'}</td>
                    <td>
                      <span className="badge badge-scheduled">{p.appointment_count}</span>
                    </td>
                    <td>
                      <div className="table-actions">
                        <Link to={`/patients/${p.id}/edit`} className="btn btn-ghost btn-sm">Edit</Link>
                        <button className="btn btn-danger btn-sm" onClick={() => handleDelete(p.id)}>Delete</button>
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
