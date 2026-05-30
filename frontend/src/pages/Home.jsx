import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Home() {
  const { user } = useAuth()

  return (
    <div>
      <div className="hero">
        <h1>
          Smart Hospital Management<br />
          <span>Powered by CareTrack</span>
        </h1>
        <p>
          Streamline patient registration, doctor management, and appointment
          scheduling in one unified platform built for modern healthcare.
        </p>
        <div className="hero-actions">
          {user ? (
            <Link to="/dashboard" className="btn btn-primary btn-lg">Go to Dashboard →</Link>
          ) : (
            <>
              <Link to="/register" className="btn btn-primary btn-lg">Get Started</Link>
              <Link to="/login" className="btn btn-ghost btn-lg">Sign In</Link>
            </>
          )}
        </div>
      </div>

      <div className="features-grid">
        <div className="feature-card">
          <div className="feature-icon">👥</div>
          <h3>Patient Management</h3>
          <p>Register patients, track their records, and manage their full appointment history.</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">🩺</div>
          <h3>Doctor Directory</h3>
          <p>Maintain a complete directory of doctors with their specializations and contact info.</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">📅</div>
          <h3>Appointment Scheduling</h3>
          <p>Schedule, update, and cancel appointments with real-time status tracking.</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">🔒</div>
          <h3>Secure Access</h3>
          <p>JWT-protected authentication ensures only authorized staff can access records.</p>
        </div>
      </div>
    </div>
  )
}
