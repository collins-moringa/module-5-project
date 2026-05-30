from app import create_app, db
from app.models import User, Patient, Doctor, Appointment

app = create_app()

with app.app_context():
    db.drop_all()
    db.create_all()

    # Staff accounts
    admin = User(username='admin', email='admin@caretrack.co.ke')
    admin.set_password('admin123')
    nurse = User(username='nurse_wanjiku', email='wanjiku.nurse@caretrack.co.ke')
    nurse.set_password('nurse123')
    db.session.add_all([admin, nurse])
    db.session.commit()

    # Kenyan patients
    patients = [
        Patient(name='Wanjiku Kamau', age=32, gender='Female', contact='0712345678', email='wanjiku.kamau@gmail.com'),
        Patient(name='Brian Otieno', age=28, gender='Male', contact='0723456789', email='brian.otieno@gmail.com'),
        Patient(name='Fatuma Hassan', age=45, gender='Female', contact='0734567890', email='fatuma.hassan@gmail.com'),
        Patient(name='Kiplangat Ngetich', age=55, gender='Male', contact='0745678901', email='kiplangat@gmail.com'),
        Patient(name='Aisha Mwangi', age=23, gender='Female', contact='0756789012', email='aisha.mwangi@gmail.com'),
        Patient(name='Mwangi Njoroge', age=67, gender='Male', contact='0767890123', email='mwangi.njoroge@gmail.com'),
        Patient(name='Njeri Githuku', age=38, gender='Female', contact='0778901234', email='njeri.githuku@gmail.com'),
    ]
    db.session.add_all(patients)

    # Kenyan doctors
    doctors = [
        Doctor(name='Dr. Amina Odhiambo', specialization='Cardiology', contact='0711222333', email='a.odhiambo@knh.go.ke'),
        Doctor(name='Dr. Samuel Kariuki', specialization='Orthopedics', contact='0722333444', email='s.kariuki@knh.go.ke'),
        Doctor(name='Dr. Grace Akinyi', specialization='Pediatrics', contact='0733444555', email='g.akinyi@knh.go.ke'),
        Doctor(name='Dr. Peter Kimani', specialization='General Practice', contact='0744555666', email='p.kimani@knh.go.ke'),
        Doctor(name='Dr. Joyce Waweru', specialization='Dermatology', contact='0755666777', email='j.waweru@knh.go.ke'),
    ]
    db.session.add_all(doctors)
    db.session.commit()

    # Appointments
    appointments = [
        Appointment(patient_id=1, doctor_id=1, date='2024-04-10', time='08:30', reason='Chest tightness and shortness of breath', status='completed'),
        Appointment(patient_id=2, doctor_id=4, date='2024-04-12', time='10:00', reason='Persistent cough and fever', status='completed'),
        Appointment(patient_id=3, doctor_id=5, date='2024-04-15', time='11:30', reason='Skin rash on arms and neck', status='scheduled'),
        Appointment(patient_id=4, doctor_id=2, date='2024-04-18', time='14:00', reason='Knee pain after running', status='scheduled'),
        Appointment(patient_id=5, doctor_id=3, date='2024-04-20', time='09:00', reason='Child wellness checkup', status='scheduled'),
        Appointment(patient_id=6, doctor_id=1, date='2024-04-22', time='15:30', reason='Routine heart checkup', status='cancelled'),
        Appointment(patient_id=7, doctor_id=4, date='2024-04-25', time='08:00', reason='Annual general checkup', status='scheduled'),
        Appointment(patient_id=1, doctor_id=4, date='2024-05-03', time='10:30', reason='Follow-up after cardiac review', status='scheduled'),
    ]
    db.session.add_all(appointments)
    db.session.commit()

    print("Database seeded with Kenyan names.")
    print(f"   Users: {User.query.count()}")
    print(f"   Patients: {Patient.query.count()}")
    print(f"   Doctors: {Doctor.query.count()}")
    print(f"   Appointments: {Appointment.query.count()}")
    print("\nLogin credentials:")
    print("   admin / admin123")
    print("   nurse_wanjiku / nurse123")
