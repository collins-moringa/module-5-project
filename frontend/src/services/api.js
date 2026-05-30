import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('access_token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  logout: () => api.post('/auth/logout'),
  me: () => api.get('/auth/me'),
}

export const patientsAPI = {
  getAll: (search = '') => api.get(`/patients${search ? `?search=${search}` : ''}`),
  getOne: (id) => api.get(`/patients/${id}`),
  create: (data) => api.post('/patients', data),
  update: (id, data) => api.patch(`/patients/${id}`, data),
  delete: (id) => api.delete(`/patients/${id}`),
}

export const doctorsAPI = {
  getAll: (search = '') => api.get(`/doctors${search ? `?search=${search}` : ''}`),
  getOne: (id) => api.get(`/doctors/${id}`),
  create: (data) => api.post('/doctors', data),
  update: (id, data) => api.patch(`/doctors/${id}`, data),
  delete: (id) => api.delete(`/doctors/${id}`),
}

export const appointmentsAPI = {
  getAll: (params = {}) => {
    const q = new URLSearchParams(params).toString()
    return api.get(`/appointments${q ? `?${q}` : ''}`)
  },
  getOne: (id) => api.get(`/appointments/${id}`),
  create: (data) => api.post('/appointments', data),
  update: (id, data) => api.patch(`/appointments/${id}`, data),
  delete: (id) => api.delete(`/appointments/${id}`),
}

export default api
