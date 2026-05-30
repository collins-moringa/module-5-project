import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Home() {
  const { user } = useAuth()

  return (
    <div>
      <div className="hero">
        <div className="hero-badge">Built for Kenyan Healthcare</div>
        <h1>
          Manage Hospital Records<br />
          <span>The Easy Way</span>
        </h1>
        <p>
          CareTrack helps you register patients, manage doctors, and schedule
          appointments — all in one simple place. No paperwork, no hassle.
        </p>
        <div className="hero-actions">
          {user ? (
            <Link to="/dashboard" className="btn btn-primary btn-lg">
              Go to Dashboard
            </Link>
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
          <div className="feature-icon-box blue">P</div>
          <h3>Patient Records</h3>
          <p>Register and manage patient details with ease. Find anyone in seconds using search.</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon-box teal">D</div>
          <h3>Doctor Profiles</h3>
          <p>Keep a full directory of doctors with their specializations and contact information.</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon-box amber">A</div>
          <h3>Appointments</h3>
          <p>Book, update, and cancel appointments. Track status from scheduled to completed.</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon-box rose">S</div>
          <h3>Secure Access</h3>
          <p>Only authorized staff can access the system. Data stays safe with JWT authentication.</p>
        </div>
      </div>
    </div>
  )
}
