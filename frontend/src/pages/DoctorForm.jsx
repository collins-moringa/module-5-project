import { useState, useEffect } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { doctorsAPI } from '../services/api'

const EMPTY = { name: '', specialization: '', contact: '', email: '' }

export default function DoctorForm() {
  const { id } = useParams()
  const isEdit = Boolean(id)
  const navigate = useNavigate()
  const [form, setForm] = useState(EMPTY)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(isEdit)

  const SPECIALIZATIONS = [
    'Cardiology', 'Orthopedics', 'Pediatrics', 'General Practice',
    'Neurology', 'Dermatology', 'Psychiatry', 'Oncology',
    'Radiology', 'Surgery', 'Gynecology', 'Ophthalmology',
    'ENT', 'Urology', 'Anesthesiology', 'Emergency Medicine',
  ]

  useEffect(() => {
    if (!isEdit) return
    doctorsAPI.getOne(id)
      .then((res) => {
        const { name, specialization, contact, email } = res.data.doctor
        setForm({ name, specialization, contact, email: email || '' })
      })
      .catch(() => setError('Failed to load doctor.'))
      .finally(() => setFetching(false))
  }, [id, isEdit])

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      if (isEdit) {
        await doctorsAPI.update(id, form)
      } else {
        await doctorsAPI.create(form)
      }
      navigate('/doctors')
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save doctor.')
    } finally {
      setLoading(false)
    }
  }

  if (fetching) return <div className="loading"><div className="spinner" /></div>

  return (
    <div style={{ maxWidth: 600 }}>
      <div className="page-header">
        <div>
          <h1 className="page-title">{isEdit ? 'Edit Doctor' : 'Add Doctor'}</h1>
          <p className="page-subtitle">{isEdit ? 'Update doctor information' : 'Register a new doctor in the system'}</p>
        </div>
        <Link to="/doctors" className="btn btn-ghost">← Back</Link>
      </div>

      <div className="card">
        <div className="card-body">
          {error && <div className="alert alert-error">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Full Name *</label>
              <input
                id="name" name="name" type="text"
                placeholder="e.g. Dr. John Kamau"
                value={form.name} onChange={handleChange} required
              />
            </div>

            <div className="form-group">
              <label htmlFor="specialization">Specialization *</label>
              <select id="specialization" name="specialization" value={form.specialization} onChange={handleChange} required>
                <option value="">Select specialization</option>
                {SPECIALIZATIONS.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="contact">Contact / Phone *</label>
                <input
                  id="contact" name="contact" type="tel"
                  placeholder="e.g. 0755678901"
                  value={form.contact} onChange={handleChange} required
                />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input
                  id="email" name="email" type="email"
                  placeholder="doctor@hospital.com"
                  value={form.email} onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-actions">
              <Link to="/doctors" className="btn btn-ghost">Cancel</Link>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Saving...' : isEdit ? 'Update Doctor' : 'Add Doctor'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
