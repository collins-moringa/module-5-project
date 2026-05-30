# CareTrack CLI – Patient Appointment Management System

## Overview

CareTrack CLI is a command-line application designed to manage hospital records efficiently.
It allows users to manage patients, doctors, and appointment scheduling through a simple interactive interface.

The system demonstrates core software engineering concepts such as:

* Object-Oriented Programming (OOP)
* Data relationships
* CRUD operations
* Command-line interaction

---

## How the System Works

The application is built around three main entities:

### Patients

Stores patient information such as:

* Patient ID
* Name
* Age
* Contact details
* List of appointments

### Doctors

Stores doctor information such as:

* Doctor ID
* Name
* Specialization
* List of appointments

### Appointments

Represents a scheduled meeting between:

* One patient
* One doctor
* At a specific date and time

Appointments act as the link between patients and doctors.

---

## Object Relationships

* A patient can have multiple appointments
* A doctor can have multiple appointments
* An appointment links:

  * One patient
  * One doctor

Appointments are also stored in lists within both patient and doctor objects to maintain relationships.

---

## Data Storage

The system uses in-memory storage with Python dictionaries and lists:

```python
patients = {}
doctors = {}
appointments = {}
```

* Dictionaries store entities using unique IDs as keys
* Lists are used to track appointment relationships within patients and doctors

Note: Data is not persisted and will be lost when the program exits.

---

## Features

### Patient Management

* Add patient
* Update patient details
* Delete patient

### Doctor Management

* Add doctor
* Update doctor details
* Delete doctor

### Appointment Management

* Schedule appointment
* Cancel appointment
* Link patients and doctors
* Validate existence before scheduling

### Viewing Records

* View all scheduled appointments

---

## CLI Menu

When the program runs, users interact with the following menu:

```
=== CareTrack CLI ===
1. Add Patient
2. Add Doctor
3. Schedule Appointment
4. View Appointments
5. Update Patient
6. Delete Patient
7. Update Doctor
8. Delete Doctor
9. Cancel Appointment
10. Exit
```

Users select an option by entering the corresponding number.

---

## How to Run the Project

### 1. Navigate to Project Directory

```bash
cd project
```

### 2. Create Virtual Environment

```bash
python3 -m venv venv
```

### 3. Activate Virtual Environment

```bash
source venv/bin/activate
```

### 4. Install Dependencies

```bash
pip install -r requirements.txt
```

### 5. Run the Application

```bash
python main.py
```

---

## Validation Logic

The system ensures:

* A patient must exist before scheduling an appointment
* A doctor must exist before scheduling an appointment
* Records must exist before update or deletion

If validation fails, appropriate error messages are displayed.

---

## Limitations

* No data persistence (no database or file storage)
* No authentication system
* No prevention of duplicate IDs
* No scheduling conflict checks

---

## Future Improvements

* Add JSON or SQLite database for persistence
* Implement search functionality
* Prevent double-booking of doctors
* Add reporting features
* Introduce user authentication

---

## Author

Developed by [Collins Kiptoo](https://github.com/collinskandie) as a CLI-based system to demonstrate Python fundamentals and data relationships. :smile:
