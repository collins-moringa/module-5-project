import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <nav className="navbar">
      <NavLink to="/" className="navbar-brand">
        🏥 <span>CareTrack</span>
      </NavLink>

      {user && (
        <div className="navbar-nav">
          <NavLink to="/dashboard" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
            Dashboard
          </NavLink>
          <NavLink to="/patients" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
            Patients
          </NavLink>
          <NavLink to="/doctors" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
            Doctors
          </NavLink>
          <NavLink to="/appointments" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
            Appointments
          </NavLink>

          <div className="nav-divider" />

          <div className="nav-user">
            <span className="nav-username">👤 {user.username}</span>
            <button className="btn btn-ghost btn-sm" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
      )}
    </nav>
  )
}
