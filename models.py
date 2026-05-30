class Patient:
    def __init__(self, patient_id, name, age, contact):
        self.patient_id = patient_id
        self.name = name
        self.age = age
        self.contact = contact

class Doctor:
    def __init__(self, doctor_id, name, specialization):
        self.doctor_id = doctor_id
        self.name = name
        self.specialization = specialization
        
class Appointment:
    def __init__(self, appointment_id, patient_id, doctor_id, datetime):
        self.appointment_id = appointment_id
        self.patient_id = patient_id
        self.doctor_id = doctor_id
        self.datetime = datetime
        