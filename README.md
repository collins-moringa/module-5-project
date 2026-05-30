## How to Run the Project

Follow these steps to set up and run the CareTrack CLI application locally.

---

### Project Structure

```bash
project/
│
├── main.py
├── models.py
├── requirements.txt
├── .env
├── venv/
└── __pycache__/
```

---

### 1. Navigate to the Project Directory

```bash
cd project
```

---

### 2. Create a Virtual Environment (if not already created)

```bash
python3 -m venv venv
```

---

### 3. Activate the Virtual Environment

On macOS/Linux:

```bash
source venv/bin/activate
```

On Windows:

```bash
venv\Scripts\activate
```

You should see something like:

```bash
(venv) user@machine project %
```

---

### 4. Install Dependencies

```bash
pip install -r requirements.txt
```

Note: The project currently does not require external dependencies.

---

### 5. Run the Application

```bash
python main.py
```

---

### Expected Output

```bash
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

---

### 6. Exit the Application

Select:

```bash
10
```

---

### Deactivate Virtual Environment (Optional)

```bash
deactivate
```
---

## Notes

* Ensure the virtual environment is activated before running the application
* Data is stored in memory and will be lost when the program exits
* The `requirements.txt` file is currently empty because no external libraries are used
* The `venv/` and `__pycache__/` directories should not be tracked in version control

---
