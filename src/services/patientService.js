const Patient = require('../models/Patient');
const User = require('../models/User');
const { AppError } = require('../utils/appError');

exports.createPatient = async (userId, patientData) => {
  const existingPatient = await Patient.findOne({ userId });
  if (existingPatient) {
    throw new AppError('Patient profile already exists', 400);
  }

  const patient = new Patient({
    userId,
    ...patientData
  });

  await patient.save();
  return patient;
};

exports.getPatientByUserId = async (userId) => {
  const patient = await Patient.findOne({ userId }).populate('favoriteDoctors', 'name specialization');
  if (!patient) {
    throw new AppError('Patient not found', 404);
  }
  return patient;
};

exports.updatePatient = async (userId, updateData) => {
  const patient = await Patient.findOneAndUpdate({ userId }, updateData, { new: true, runValidators: true });
  if (!patient) {
    throw new AppError('Patient not found', 404);
  }
  return patient;
};

exports.addMedicalHistory = async (userId, historyData) => {
  const patient = await Patient.findOne({ userId });
  if (!patient) {
    throw new AppError('Patient not found', 404);
  }
  patient.medicalHistory.push(historyData);
  await patient.save();
  return patient;
};

exports.updateMedicalHistory = async (userId, historyId, updateData) => {
  const patient = await Patient.findOne({ userId });
  if (!patient) {
    throw new AppError('Patient not found', 404);
  }
  const historyIndex = patient.medicalHistory.findIndex(h => h._id.toString() === historyId);
  if (historyIndex === -1) {
    throw new AppError('Medical history entry not found', 404);
  }
  patient.medicalHistory[historyIndex] = { ...patient.medicalHistory[historyIndex], ...updateData };
  await patient.save();
  return patient;
};

exports.deleteMedicalHistory = async (userId, historyId) => {
  const patient = await Patient.findOne({ userId });
  if (!patient) {
    throw new AppError('Patient not found', 404);
  }
  patient.medicalHistory = patient.medicalHistory.filter(h => h._id.toString() !== historyId);
  await patient.save();
  return patient;
};

exports.addAllergy = async (userId, allergy) => {
  const patient = await Patient.findOne({ userId });
  if (!patient) {
    throw new AppError('Patient not found', 404);
  }
  if (!patient.allergies.includes(allergy)) {
    patient.allergies.push(allergy);
    await patient.save();
  }
  return patient;
};

exports.removeAllergy = async (userId, allergy) => {
  const patient = await Patient.findOne({ userId });
  if (!patient) {
    throw new AppError('Patient not found', 404);
  }
  patient.allergies = patient.allergies.filter(a => a !== allergy);
  await patient.save();
  return patient;
};

exports.addFavoriteDoctor = async (userId, doctorId) => {
  const patient = await Patient.findOne({ userId });
  if (!patient) {
    throw new AppError('Patient not found', 404);
  }
  if (!patient.favoriteDoctors.includes(doctorId)) {
    patient.favoriteDoctors.push(doctorId);
    await patient.save();
  }
  return patient;
};

exports.removeFavoriteDoctor = async (userId, doctorId) => {
  const patient = await Patient.findOne({ userId });
  if (!patient) {
    throw new AppError('Patient not found', 404);
  }
  patient.favoriteDoctors = patient.favoriteDoctors.filter(d => d.toString() !== doctorId);
  await patient.save();
  return patient;
};