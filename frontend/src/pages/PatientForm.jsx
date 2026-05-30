import { useState, useEffect } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { patientsAPI } from '../services/api'

const EMPTY = { name: '', age: '', gender: '', contact: '', email: '' }

export default function PatientForm() {
  const { id } = useParams()
  const isEdit = Boolean(id)
  const navigate = useNavigate()
  const [form, setForm] = useState(EMPTY)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(isEdit)

  useEffect(() => {
    if (!isEdit) return
    patientsAPI.getOne(id)
      .then((res) => {
        const { name, age, gender, contact, email } = res.data.patient
        setForm({ name, age: String(age), gender, contact, email: email || '' })
      })
      .catch(() => setError('Could not load patient details.'))
      .finally(() => setFetching(false))
  }, [id, isEdit])

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      if (isEdit) {
        await patientsAPI.update(id, { ...form, age: parseInt(form.age) })
      } else {
        await patientsAPI.create({ ...form, age: parseInt(form.age) })
      }
      navigate('/patients')
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save. Please check your inputs.')
    } finally {
      setLoading(false)
    }
  }

  if (fetching) return <div className="loading"><div className="spinner" /><p>Loading patient...</p></div>

  return (
    <div style={{ maxWidth: 620 }}>
      <div className="page-header">
        <div>
          <h1 className="page-title">{isEdit ? 'Edit Patient' : 'Register Patient'}</h1>
          <p className="page-subtitle">
            {isEdit ? 'Update patient information below' : 'Fill in the details to register a new patient'}
          </p>
        </div>
        <Link to="/patients" className="btn btn-ghost">Back to Patients</Link>
      </div>

      <div className="card">
        <div className="card-body">
          {error && <div className="alert alert-error">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Full Name *</label>
              <input
                id="name" name="name" type="text"
                placeholder="e.g. Wanjiku Kamau"
                value={form.name} onChange={handleChange} required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="age">Age *</label>
                <input
                  id="age" name="age" type="number" min="0" max="150"
                  placeholder="Age in years"
                  value={form.age} onChange={handleChange} required
                />
              </div>
              <div className="form-group">
                <label htmlFor="gender">Gender *</label>
                <select id="gender" name="gender" value={form.gender} onChange={handleChange} required>
                  <option value="">Select gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="contact">Phone Number *</label>
                <input
                  id="contact" name="contact" type="tel"
                  placeholder="e.g. 0712 345 678"
                  value={form.contact} onChange={handleChange} required
                />
              </div>
              <div className="form-group">
                <label htmlFor="email">
                  Email Address{' '}
                  <span style={{ color: 'var(--gray-400)', fontWeight: 400 }}>(optional)</span>
                </label>
                <input
                  id="email" name="email" type="email"
                  placeholder="patient@gmail.com"
                  value={form.email} onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-actions">
              <Link to="/patients" className="btn btn-ghost">Cancel</Link>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Saving...' : isEdit ? 'Update Patient' : 'Register Patient'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
