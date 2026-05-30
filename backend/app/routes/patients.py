from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from .. import db
from ..models import Patient

patients_bp = Blueprint('patients', __name__)


@patients_bp.route('/patients', methods=['GET'])
@jwt_required()
def get_patients():
    search = request.args.get('search', '').strip()
    query = Patient.query
    if search:
        query = query.filter(Patient.name.ilike(f'%{search}%'))
    patients = query.order_by(Patient.created_at.desc()).all()
    return jsonify({'patients': [p.to_dict() for p in patients]}), 200


@patients_bp.route('/patients', methods=['POST'])
@jwt_required()
def create_patient():
    data = request.get_json()
    if not data:
        return jsonify({'error': 'No data provided'}), 400

    for field in ('name', 'age', 'gender', 'contact'):
        if not data.get(field):
            return jsonify({'error': f'{field} is required'}), 400

    patient = Patient(
        name=data['name'].strip(),
        age=int(data['age']),
        gender=data['gender'],
        contact=data['contact'].strip(),
        email=data.get('email', '').strip(),
    )
    db.session.add(patient)
    db.session.commit()
    return jsonify({'message': 'Patient registered', 'patient': patient.to_dict()}), 201


@patients_bp.route('/patients/<int:patient_id>', methods=['GET'])
@jwt_required()
def get_patient(patient_id):
    patient = Patient.query.get_or_404(patient_id)
    return jsonify({'patient': patient.to_dict(include_appointments=True)}), 200


@patients_bp.route('/patients/<int:patient_id>', methods=['PATCH'])
@jwt_required()
def update_patient(patient_id):
    patient = Patient.query.get_or_404(patient_id)
    data = request.get_json() or {}

    if 'name' in data:
        patient.name = data['name'].strip()
    if 'age' in data:
        patient.age = int(data['age'])
    if 'gender' in data:
        patient.gender = data['gender']
    if 'contact' in data:
        patient.contact = data['contact'].strip()
    if 'email' in data:
        patient.email = data['email'].strip()

    db.session.commit()
    return jsonify({'message': 'Patient updated', 'patient': patient.to_dict()}), 200


@patients_bp.route('/patients/<int:patient_id>', methods=['DELETE'])
@jwt_required()
def delete_patient(patient_id):
    patient = Patient.query.get_or_404(patient_id)
    db.session.delete(patient)
    db.session.commit()
    return jsonify({'message': 'Patient removed from system'}), 200
