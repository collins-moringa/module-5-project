# CareTrack — Patient Appointment Management System

A full-stack web application for managing hospital records, including patient registration, doctor management, and appointment scheduling.

---

## Tech Stack

| Layer      | Technology                                      |
|------------|-------------------------------------------------|
| Frontend   | React 18, React Router v6, Axios, Vite          |
| Backend    | Flask, Flask-SQLAlchemy, Flask-JWT-Extended      |
| Database   | SQLite (via SQLAlchemy ORM)                     |
| Migrations | Flask-Migrate (Alembic)                         |
| Auth       | JSON Web Tokens (JWT)                           |

---

## Project Structure

```
project M5/
├── backend/
│   ├── app/
│   │   ├── __init__.py        # Flask app factory
│   │   ├── config.py          # Environment configuration
│   │   ├── models.py          # SQLAlchemy models
│   │   └── routes/
│   │       ├── auth.py        # Register, login, logout
│   │       ├── patients.py    # Patient CRUD
│   │       ├── doctors.py     # Doctor CRUD
│   │       └── appointments.py # Appointment CRUD
│   ├── run.py                 # Flask entry point
│   ├── seed.py                # Database seed script
│   ├── requirements.txt
│   └── .env
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── Navbar.jsx
    │   │   └── ProtectedRoute.jsx
    │   ├── context/
    │   │   └── AuthContext.jsx    # JWT state management
    │   ├── pages/
    │   │   ├── Home.jsx
    │   │   ├── Login.jsx
    │   │   ├── Register.jsx
    │   │   ├── Dashboard.jsx
    │   │   ├── Patients.jsx
    │   │   ├── PatientForm.jsx
    │   │   ├── Doctors.jsx
    │   │   ├── DoctorForm.jsx
    │   │   ├── Appointments.jsx
    │   │   └── AppointmentForm.jsx
    │   ├── services/
    │   │   └── api.js             # Axios API service
    │   └── App.jsx                # Router setup
    ├── package.json
    └── vite.config.js
```

---

## Database Relationships

**One-to-Many**
- One `Patient` can have many `Appointments`
- One `Doctor` can have many `Appointments`

**Many-to-Many**
- `Patient` and `Doctor` are linked through `Appointment`, which acts as the join model and carries extra data: date, time, reason, and status.

---

## API Endpoints

All endpoints under `/api` require a valid JWT token in the `Authorization: Bearer <token>` header, except register and login.

### Auth (public)
| Method | Endpoint              | Description          |
|--------|-----------------------|----------------------|
| POST   | `/api/auth/register`  | Create a new account |
| POST   | `/api/auth/login`     | Login and get token  |
| GET    | `/api/auth/me`        | Get current user     |
| POST   | `/api/auth/logout`    | Logout               |

### Patients (protected)
| Method | Endpoint                  | Description          |
|--------|---------------------------|----------------------|
| GET    | `/api/patients`           | List all patients    |
| POST   | `/api/patients`           | Register a patient   |
| GET    | `/api/patients/<id>`      | Get patient details  |
| PATCH  | `/api/patients/<id>`      | Update patient       |
| DELETE | `/api/patients/<id>`      | Delete patient       |

### Doctors (protected)
| Method | Endpoint                  | Description          |
|--------|---------------------------|----------------------|
| GET    | `/api/doctors`            | List all doctors     |
| POST   | `/api/doctors`            | Add a doctor         |
| GET    | `/api/doctors/<id>`       | Get doctor details   |
| PATCH  | `/api/doctors/<id>`       | Update doctor        |
| DELETE | `/api/doctors/<id>`       | Delete doctor        |

### Appointments (protected)
| Method | Endpoint                       | Description              |
|--------|--------------------------------|--------------------------|
| GET    | `/api/appointments`            | List all appointments    |
| POST   | `/api/appointments`            | Schedule appointment     |
| GET    | `/api/appointments/<id>`       | Get appointment details  |
| PATCH  | `/api/appointments/<id>`       | Update appointment       |
| DELETE | `/api/appointments/<id>`       | Cancel appointment       |

---

## Getting Started

### Prerequisites

- Python 3.10+
- Node.js 18+
- npm

---

### 1. Clone the repository

```bash
git clone <repo-url>
cd "project M5"
```

---

### 2. Set up the Backend

```bash
cd backend
python3 -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

#### Seed the database

```bash
python seed.py
```

This creates the SQLite database and populates it with sample Kenyan patients, doctors, and appointments.

#### Start the Flask server

```bash
python run.py
```

The API will be available at `http://localhost:5001`.

---

### 3. Set up the Frontend

Open a second terminal:

```bash
cd frontend
npm install
npm run dev
```

The app will be available at `http://localhost:5173`.

---

### 4. Login

| Username       | Password   |
|----------------|------------|
| admin          | admin123   |
| nurse_wanjiku  | nurse123   |

---

## Environment Variables

The backend reads from `backend/.env`:

```
SECRET_KEY=your_secret_key
JWT_SECRET_KEY=your_jwt_secret
DATABASE_URL=sqlite:///caretrack.db
```

---

## Features

- JWT authentication — register, login, logout, protected routes
- Patient management — register, search, update, delete
- Doctor management — add by specialization, update, delete
- Appointment scheduling — link patients to doctors with date, time, reason, and status
- Dashboard with live stats and recent appointments
- Fully responsive UI
