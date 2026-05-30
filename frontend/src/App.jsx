import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Navbar from './components/Navbar'
import ProtectedRoute from './components/ProtectedRoute'

import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Patients from './pages/Patients'
import PatientForm from './pages/PatientForm'
import Doctors from './pages/Doctors'
import DoctorForm from './pages/DoctorForm'
import Appointments from './pages/Appointments'
import AppointmentForm from './pages/AppointmentForm'

function Layout({ children }) {
  return (
    <div className="layout">
      <Navbar />
      <main className="main-content">{children}</main>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Layout><Home /></Layout>} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="/dashboard" element={
            <Layout><ProtectedRoute><Dashboard /></ProtectedRoute></Layout>
          } />

          <Route path="/patients" element={
            <Layout><ProtectedRoute><Patients /></ProtectedRoute></Layout>
          } />
          <Route path="/patients/new" element={
            <Layout><ProtectedRoute><PatientForm /></ProtectedRoute></Layout>
          } />
          <Route path="/patients/:id/edit" element={
            <Layout><ProtectedRoute><PatientForm /></ProtectedRoute></Layout>
          } />

          <Route path="/doctors" element={
            <Layout><ProtectedRoute><Doctors /></ProtectedRoute></Layout>
          } />
          <Route path="/doctors/new" element={
            <Layout><ProtectedRoute><DoctorForm /></ProtectedRoute></Layout>
          } />
          <Route path="/doctors/:id/edit" element={
            <Layout><ProtectedRoute><DoctorForm /></ProtectedRoute></Layout>
          } />

          <Route path="/appointments" element={
            <Layout><ProtectedRoute><Appointments /></ProtectedRoute></Layout>
          } />
          <Route path="/appointments/new" element={
            <Layout><ProtectedRoute><AppointmentForm /></ProtectedRoute></Layout>
          } />
          <Route path="/appointments/:id/edit" element={
            <Layout><ProtectedRoute><AppointmentForm /></ProtectedRoute></Layout>
          } />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}
