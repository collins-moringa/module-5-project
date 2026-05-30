from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from .. import db
from ..models import Doctor

doctors_bp = Blueprint('doctors', __name__)


@doctors_bp.route('/doctors', methods=['GET'])
@jwt_required()
def get_doctors():
    search = request.args.get('search', '').strip()
    query = Doctor.query
    if search:
        query = query.filter(
            Doctor.name.ilike(f'%{search}%') |
            Doctor.specialization.ilike(f'%{search}%')
        )
    doctors = query.order_by(Doctor.created_at.desc()).all()
    return jsonify({'doctors': [d.to_dict() for d in doctors]}), 200


@doctors_bp.route('/doctors', methods=['POST'])
@jwt_required()
def create_doctor():
    data = request.get_json()
    if not data:
        return jsonify({'error': 'No data provided'}), 400

    for field in ('name', 'specialization', 'contact'):
        if not data.get(field):
            return jsonify({'error': f'{field} is required'}), 400

    doctor = Doctor(
        name=data['name'].strip(),
        specialization=data['specialization'].strip(),
        contact=data['contact'].strip(),
        email=data.get('email', '').strip(),
    )
    db.session.add(doctor)
    db.session.commit()
    return jsonify({'message': 'Doctor registered', 'doctor': doctor.to_dict()}), 201


@doctors_bp.route('/doctors/<int:doctor_id>', methods=['GET'])
@jwt_required()
def get_doctor(doctor_id):
    doctor = Doctor.query.get_or_404(doctor_id)
    return jsonify({'doctor': doctor.to_dict(include_appointments=True)}), 200


@doctors_bp.route('/doctors/<int:doctor_id>', methods=['PATCH'])
@jwt_required()
def update_doctor(doctor_id):
    doctor = Doctor.query.get_or_404(doctor_id)
    data = request.get_json() or {}

    if 'name' in data:
        doctor.name = data['name'].strip()
    if 'specialization' in data:
        doctor.specialization = data['specialization'].strip()
    if 'contact' in data:
        doctor.contact = data['contact'].strip()
    if 'email' in data:
        doctor.email = data['email'].strip()

    db.session.commit()
    return jsonify({'message': 'Doctor updated', 'doctor': doctor.to_dict()}), 200


@doctors_bp.route('/doctors/<int:doctor_id>', methods=['DELETE'])
@jwt_required()
def delete_doctor(doctor_id):
    doctor = Doctor.query.get_or_404(doctor_id)
    db.session.delete(doctor)
    db.session.commit()
    return jsonify({'message': 'Doctor removed from system'}), 200
