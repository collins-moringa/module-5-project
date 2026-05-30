from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from .. import db
from ..models import Appointment, Patient, Doctor

appointments_bp = Blueprint('appointments', __name__)


@appointments_bp.route('/appointments', methods=['GET'])
@jwt_required()
def get_appointments():
    status = request.args.get('status', '').strip()
    patient_id = request.args.get('patient_id')
    doctor_id = request.args.get('doctor_id')

    query = Appointment.query
    if status:
        query = query.filter_by(status=status)
    if patient_id:
        query = query.filter_by(patient_id=int(patient_id))
    if doctor_id:
        query = query.filter_by(doctor_id=int(doctor_id))

    appointments = query.order_by(Appointment.date.desc()).all()
    return jsonify({'appointments': [a.to_dict() for a in appointments]}), 200


@appointments_bp.route('/appointments', methods=['POST'])
@jwt_required()
def create_appointment():
    data = request.get_json()
    if not data:
        return jsonify({'error': 'No data provided'}), 400

    for field in ('patient_id', 'doctor_id', 'date', 'time', 'reason'):
        if not data.get(field):
            return jsonify({'error': f'{field} is required'}), 400

    if not Patient.query.get(data['patient_id']):
        return jsonify({'error': 'Patient not found'}), 404
    if not Doctor.query.get(data['doctor_id']):
        return jsonify({'error': 'Doctor not found'}), 404

    appointment = Appointment(
        patient_id=int(data['patient_id']),
        doctor_id=int(data['doctor_id']),
        date=data['date'],
        time=data['time'],
        reason=data['reason'].strip(),
        status=data.get('status', 'scheduled'),
    )
    db.session.add(appointment)
    db.session.commit()
    return jsonify({'message': 'Appointment scheduled', 'appointment': appointment.to_dict()}), 201


@appointments_bp.route('/appointments/<int:appointment_id>', methods=['GET'])
@jwt_required()
def get_appointment(appointment_id):
    appointment = Appointment.query.get_or_404(appointment_id)
    return jsonify({'appointment': appointment.to_dict()}), 200


@appointments_bp.route('/appointments/<int:appointment_id>', methods=['PATCH'])
@jwt_required()
def update_appointment(appointment_id):
    appointment = Appointment.query.get_or_404(appointment_id)
    data = request.get_json() or {}

    if 'patient_id' in data:
        if not Patient.query.get(data['patient_id']):
            return jsonify({'error': 'Patient not found'}), 404
        appointment.patient_id = int(data['patient_id'])
    if 'doctor_id' in data:
        if not Doctor.query.get(data['doctor_id']):
            return jsonify({'error': 'Doctor not found'}), 404
        appointment.doctor_id = int(data['doctor_id'])
    if 'date' in data:
        appointment.date = data['date']
    if 'time' in data:
        appointment.time = data['time']
    if 'reason' in data:
        appointment.reason = data['reason'].strip()
    if 'status' in data:
        appointment.status = data['status']

    db.session.commit()
    return jsonify({'message': 'Appointment updated', 'appointment': appointment.to_dict()}), 200


@appointments_bp.route('/appointments/<int:appointment_id>', methods=['DELETE'])
@jwt_required()
def delete_appointment(appointment_id):
    appointment = Appointment.query.get_or_404(appointment_id)
    db.session.delete(appointment)
    db.session.commit()
    return jsonify({'message': 'Appointment cancelled'}), 200
