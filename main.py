from models import Patient, Doctor, Appointment
def main():
    patients = {}
    doctors = {}
    appointments = {}

# loop the function based on the user input until the exit.
    while True:
        print("\n=== CareTrack CLI ===")
        print("1. Add Patient")
        print("2. Add Doctor")
        print("3. Schedule Appointment")
        print("4. View Appointments")
        print("5. Update Patient")
        print("6. Delete Patient")
        print("7. Update Doctor")
        print("8. Delete Doctor")
        print("9. Cancel Appointment")
        print("10. Exit")

        choice = input("Select option: ")

        if choice == "1":
            add_patient(patients)
        elif choice == "2":
            add_doctor(doctors)
        elif choice == "3":
            schedule_appointment(patients, doctors, appointments)
        elif choice == "4":
            view_appointments(appointments)
        elif choice == "5":
            update_patient(patients)
        elif choice == "6":
            delete_patient(patients)
        elif choice == "7":
            update_doctor(doctors)
        elif choice == "8":
            delete_doctor(doctors)
        elif choice == "9":
            cancel_appointment(appointments)
        elif choice == "10":
            break
        else:
            print("Invalid choice")
            
# Patient management functions
def add_patient(patients):
    patient_id = input("Enter patient ID: ")
    name = input("Enter name: ")
    age = int(input("Enter age: "))
    contact = input("Enter contact: ")

    patient = Patient(patient_id, name, age, contact)
    patient.appointments = []  # LIST usage

    patients[patient_id] = patient
    print("Patient added successfully!")

def update_patient(patients):
    patient_id = input("Enter patient ID to update: ")

    if patient_id not in patients:
        print("Patient not found!")
        return

    name = input("Enter new name: ")
    age = int(input("Enter new age: "))
    contact = input("Enter new contact: ")

    patient = patients[patient_id]
    patient.name = name
    patient.age = age
    patient.contact = contact

    print("Patient updated successfully!")


def delete_patient(patients):
    patient_id = input("Enter patient ID to delete: ")

    if patient_id in patients:
        del patients[patient_id]
        print("Patient deleted!")
    else:
        print("Patient not found!")
  
# Doctor management functions      
def add_doctor(doctors):
    doctor_id = input("Enter doctor ID: ")
    name = input("Enter name: ")
    specialization = input("Enter specialization: ")

    doctor = Doctor(doctor_id, name, specialization)
    doctor.appointments = []  # LIST usage

    doctors[doctor_id] = doctor
    print("Doctor added successfully!")


def update_doctor(doctors):
    doctor_id = input("Enter doctor ID to update: ")

    if doctor_id not in doctors:
        print("Doctor not found!")
        return

    name = input("Enter new name: ")
    specialization = input("Enter new specialization: ")

    doctor = doctors[doctor_id]
    doctor.name = name
    doctor.specialization = specialization

    print("Doctor updated successfully!")


def delete_doctor(doctors):
    doctor_id = input("Enter doctor ID to delete: ")

    if doctor_id in doctors:
        del doctors[doctor_id]
        print("Doctor deleted!")
    else:
        print("Doctor not found!")
      
# Appointment management functions
def schedule_appointment(patients, doctors, appointments):
    appointment_id = input("Enter appointment ID: ")
    patient_id = input("Enter patient ID: ")
    doctor_id = input("Enter doctor ID: ")
    datetime = input("Enter date & time: ")

    if patient_id not in patients:
        print("Patient not found!")
        return

    if doctor_id not in doctors:
        print("Doctor not found!")
        return

    appointment = Appointment(
        appointment_id, patient_id, doctor_id, datetime
    )

    appointments[appointment_id] = appointment
    patients[patient_id].appointments.append(appointment)
    doctors[doctor_id].appointments.append(appointment)

    print("Appointment scheduled!")

def cancel_appointment(appointments):
    appointment_id = input("Enter appointment ID to cancel: ")

    if appointment_id in appointments:
        del appointments[appointment_id]
        print("Appointment cancelled!")
    else:
        print("Appointment not found!")


def view_appointments(appointments):
    if not appointments:
        print("No appointments found.")
        return

    for appt in appointments.values():
        print(
            f"{appt.appointment_id} | Patient: {appt.patient_id} | "
            f"Doctor: {appt.doctor_id} | Time: {appt.datetime}"
        )

# Entry point
if __name__ == "__main__":
    main()