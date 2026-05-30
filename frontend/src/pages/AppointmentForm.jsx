import { useState, useEffect } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { appointmentsAPI, patientsAPI, doctorsAPI } from '../services/api'

const EMPTY = { patient_id: '', doctor_id: '', date: '', time: '', reason: '', status: 'scheduled' }

export default function AppointmentForm() {
  const { id } = useParams()
  const isEdit = Boolean(id)
  const navigate = useNavigate()

  const [form, setForm] = useState(EMPTY)
  const [patients, setPatients] = useState([])
  const [doctors, setDoctors] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)

  useEffect(() => {
    const fetchDropdowns = Promise.all([patientsAPI.getAll(), doctorsAPI.getAll()])

    if (isEdit) {
      Promise.all([fetchDropdowns, appointmentsAPI.getOne(id)])
        .then(([[pRes, dRes], aRes]) => {
          setPatients(pRes.data.patients)
          setDoctors(dRes.data.doctors)
          const { patient_id, doctor_id, date, time, reason, status } = aRes.data.appointment
          setForm({ patient_id: String(patient_id), doctor_id: String(doctor_id), date, time, reason, status })
        })
        .catch(() => setError('Failed to load appointment data.'))
        .finally(() => setFetching(false))
    } else {
      fetchDropdowns
        .then(([pRes, dRes]) => {
          setPatients(pRes.data.patients)
          setDoctors(dRes.data.doctors)
        })
        .catch(() => setError('Failed to load patients and doctors. Make sure the server is running.'))
        .finally(() => setFetching(false))
    }
  }, [id, isEdit])

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const payload = { ...form, patient_id: parseInt(form.patient_id), doctor_id: parseInt(form.doctor_id) }
      if (isEdit) {
        await appointmentsAPI.update(id, payload)
      } else {
        await appointmentsAPI.create(payload)
      }
      navigate('/appointments')
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save appointment.')
    } finally {
      setLoading(false)
    }
  }

  if (fetching) return <div className="loading"><div className="spinner" /><p>Loading...</p></div>

  return (
    <div style={{ maxWidth: 660 }}>
      <div className="page-header">
        <div>
          <h1 className="page-title">{isEdit ? 'Edit Appointment' : 'Schedule Appointment'}</h1>
          <p className="page-subtitle">
            {isEdit ? 'Update appointment details below' : 'Book a new appointment between a patient and a doctor'}
          </p>
        </div>
        <Link to="/appointments" className="btn btn-ghost">Back</Link>
      </div>

      <div className="card">
        <div className="card-body">
          {error && <div className="alert alert-error">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="patient_id">Patient *</label>
                <select id="patient_id" name="patient_id" value={form.patient_id} onChange={handleChange} required>
                  <option value="">Choose a patient</option>
                  {patients.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.age} yrs, {p.gender})
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="doctor_id">Doctor *</label>
                <select id="doctor_id" name="doctor_id" value={form.doctor_id} onChange={handleChange} required>
                  <option value="">Choose a doctor</option>
                  {doctors.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name} — {d.specialization}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="date">Appointment Date *</label>
                <input
                  id="date" name="date" type="date"
                  value={form.date} onChange={handleChange} required
                />
              </div>
              <div className="form-group">
                <label htmlFor="time">Appointment Time *</label>
                <input
                  id="time" name="time" type="time"
                  value={form.time} onChange={handleChange} required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="reason">Reason for Visit *</label>
              <textarea
                id="reason" name="reason"
                placeholder="Describe why the patient is visiting (e.g. chest pain, follow-up, routine checkup)..."
                value={form.reason} onChange={handleChange} required
              />
            </div>

            {isEdit && (
              <div className="form-group">
                <label htmlFor="status">Status *</label>
                <select id="status" name="status" value={form.status} onChange={handleChange} required>
                  <option value="scheduled">Scheduled</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            )}

            <div className="form-actions">
              <Link to="/appointments" className="btn btn-ghost">Cancel</Link>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Saving...' : isEdit ? 'Update Appointment' : 'Schedule Appointment'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
