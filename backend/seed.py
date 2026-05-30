from app import create_app, db
from app.models import User, Patient, Doctor, Appointment

app = create_app()

with app.app_context():
    db.drop_all()
    db.create_all()

    admin = User(username='admin', email='admin@caretrack.com')
    admin.set_password('admin123')
    staff = User(username='staff', email='staff@caretrack.com')
    staff.set_password('staff123')
    db.session.add_all([admin, staff])
    db.session.commit()

    patients = [
        Patient(name='John Doe', age=35, gender='Male', contact='0700123456', email='john@example.com'),
        Patient(name='Jane Smith', age=28, gender='Female', contact='0711234567', email='jane@example.com'),
        Patient(name='Bob Johnson', age=52, gender='Male', contact='0722345678', email='bob@example.com'),
        Patient(name='Alice Brown', age=45, gender='Female', contact='0733456789', email='alice@example.com'),
        Patient(name='Charlie Wilson', age=67, gender='Male', contact='0744567890', email='charlie@example.com'),
    ]
    db.session.add_all(patients)

    doctors = [
        Doctor(name='Dr. Sarah Njoroge', specialization='Cardiology', contact='0755678901', email='sarah@hospital.com'),
        Doctor(name='Dr. James Mwangi', specialization='Orthopedics', contact='0766789012', email='james@hospital.com'),
        Doctor(name='Dr. Emma Wanjiku', specialization='Pediatrics', contact='0777890123', email='emma@hospital.com'),
        Doctor(name='Dr. Peter Kamau', specialization='General Practice', contact='0788901234', email='peter@hospital.com'),
    ]
    db.session.add_all(doctors)
    db.session.commit()

    appointments = [
        Appointment(patient_id=1, doctor_id=1, date='2024-03-15', time='09:00', reason='Chest pain evaluation', status='completed'),
        Appointment(patient_id=2, doctor_id=3, date='2024-03-16', time='10:30', reason='Child wellness check', status='completed'),
        Appointment(patient_id=3, doctor_id=2, date='2024-03-20', time='14:00', reason='Knee pain assessment', status='scheduled'),
        Appointment(patient_id=4, doctor_id=4, date='2024-03-22', time='11:00', reason='Annual checkup', status='scheduled'),
        Appointment(patient_id=5, doctor_id=1, date='2024-03-25', time='15:30', reason='Heart palpitations', status='cancelled'),
        Appointment(patient_id=1, doctor_id=4, date='2024-04-01', time='09:30', reason='Follow-up consultation', status='scheduled'),
    ]
    db.session.add_all(appointments)
    db.session.commit()

    print("Database seeded successfully!")
    print(f"  Users: {User.query.count()}")
    print(f"  Patients: {Patient.query.count()}")
    print(f"  Doctors: {Doctor.query.count()}")
    print(f"  Appointments: {Appointment.query.count()}")
    print("\nLogin credentials:")
    print("  admin / admin123")
    print("  staff / staff123")
