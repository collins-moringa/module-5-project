from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash
from . import db


class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    role = db.Column(db.String(20), default='staff')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def to_dict(self):
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email,
            'role': self.role,
            'created_at': self.created_at.isoformat(),
        }


class Patient(db.Model):
    """One-to-Many: One Patient has many Appointments."""
    __tablename__ = 'patients'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    age = db.Column(db.Integer, nullable=False)
    gender = db.Column(db.String(10), nullable=False)
    contact = db.Column(db.String(20), nullable=False)
    email = db.Column(db.String(120), default='')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    appointments = db.relationship(
        'Appointment',
        back_populates='patient',
        lazy='dynamic',
        cascade='all, delete-orphan',
    )

    def to_dict(self, include_appointments=False):
        data = {
            'id': self.id,
            'name': self.name,
            'age': self.age,
            'gender': self.gender,
            'contact': self.contact,
            'email': self.email,
            'created_at': self.created_at.isoformat(),
            'appointment_count': self.appointments.count(),
        }
        if include_appointments:
            data['appointments'] = [a.to_dict() for a in self.appointments]
        return data


class Doctor(db.Model):
    """One-to-Many: One Doctor has many Appointments."""
    __tablename__ = 'doctors'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    specialization = db.Column(db.String(100), nullable=False)
    contact = db.Column(db.String(20), nullable=False)
    email = db.Column(db.String(120), default='')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    appointments = db.relationship(
        'Appointment',
        back_populates='doctor',
        lazy='dynamic',
        cascade='all, delete-orphan',
    )

    def to_dict(self, include_appointments=False):
        data = {
            'id': self.id,
            'name': self.name,
            'specialization': self.specialization,
            'contact': self.contact,
            'email': self.email,
            'created_at': self.created_at.isoformat(),
            'appointment_count': self.appointments.count(),
        }
        if include_appointments:
            data['appointments'] = [a.to_dict() for a in self.appointments]
        return data


class Appointment(db.Model):
    """
    Many-to-Many join model: Patients <-> Doctors via Appointments.
    Each appointment carries extra data: date, time, reason, status.
    """
    __tablename__ = 'appointments'

    id = db.Column(db.Integer, primary_key=True)
    patient_id = db.Column(db.Integer, db.ForeignKey('patients.id'), nullable=False)
    doctor_id = db.Column(db.Integer, db.ForeignKey('doctors.id'), nullable=False)
    date = db.Column(db.String(20), nullable=False)
    time = db.Column(db.String(10), nullable=False)
    reason = db.Column(db.Text, nullable=False)
    status = db.Column(db.String(20), default='scheduled')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    patient = db.relationship('Patient', back_populates='appointments')
    doctor = db.relationship('Doctor', back_populates='appointments')

    def to_dict(self):
        return {
            'id': self.id,
            'patient_id': self.patient_id,
            'doctor_id': self.doctor_id,
            'patient_name': self.patient.name if self.patient else None,
            'doctor_name': self.doctor.name if self.doctor else None,
            'doctor_specialization': self.doctor.specialization if self.doctor else None,
            'date': self.date,
            'time': self.time,
            'reason': self.reason,
            'status': self.status,
            'created_at': self.created_at.isoformat(),
        }
