// services/appointmentService.js

const Appointment = require('../models/Appointment');
const DoctorAvailability = require('../models/DoctorAvailability');
const {AppError} = require('../utils/appError');
const moment = require('moment');

exports.getAvailableSlots = async (doctorId, date) => {
  const dayOfWeek = moment(date).day();
  const availability = await DoctorAvailability.findOne({ doctor: doctorId, dayOfWeek });

  if (!availability) {
    throw new AppError('No availability found for this doctor on the given date', 404);
  }

  const startTime = moment(date).set({
    hour: availability.startTime.split(':')[0],
    minute: availability.startTime.split(':')[1],
    second: 0
  });
  const endTime = moment(date).set({
    hour: availability.endTime.split(':')[0],
    minute: availability.endTime.split(':')[1],
    second: 0
  });

  const slots = [];
  let currentSlot = startTime.clone();

  while (currentSlot.isBefore(endTime)) {
    slots.push(currentSlot.format());
    currentSlot.add(30, 'minutes');
  }

  const bookedAppointments = await Appointment.find({
    doctor: doctorId,
    dateTime: {
      $gte: startTime.toDate(),
      $lt: endTime.toDate()
    },
    status: { $in: ['scheduled', 'rescheduled'] }
  });

  const availableSlots = slots.filter(slot => {
    return !bookedAppointments.some(appointment => 
      moment(appointment.dateTime).format() === slot
    );
  });

  return availableSlots;
};

exports.createAppointment = async (doctorId, patientId, dateTime) => {
  const conflictingAppointment = await Appointment.findOne({
    doctor: doctorId,
    dateTime: dateTime,
    status: { $in: ['scheduled', 'rescheduled'] }
  });

  if (conflictingAppointment) {
    throw new AppError('This slot is already booked', 400);
  }

  const appointment = new Appointment({
    doctor: doctorId,
    patient: patientId,
    dateTime: dateTime
  });

  await appointment.save();
  return appointment;
};

exports.cancelAppointment = async (appointmentId, patientId) => {
  const appointment = await Appointment.findOne({ _id: appointmentId, patient: patientId });

  if (!appointment) {
    throw new AppError('Appointment not found', 404);
  }

  if (appointment.status !== 'scheduled' && appointment.status !== 'rescheduled') {
    throw new AppError('Cannot cancel this appointment', 400);
  }

  appointment.status = 'cancelled';
  await appointment.save();
  return appointment;
};

exports.rescheduleAppointment = async (appointmentId, patientId, newDateTime) => {
  const appointment = await Appointment.findOne({ _id: appointmentId, patient: patientId });

  if (!appointment) {
    throw new AppError('Appointment not found', 404);
  }

  if (appointment.status !== 'scheduled' && appointment.status !== 'rescheduled') {
    throw new AppError('Cannot reschedule this appointment', 400);
  }

  const conflictingAppointment = await Appointment.findOne({
    doctor: appointment.doctor,
    dateTime: newDateTime,
    status: { $in: ['scheduled', 'rescheduled'] }
  });

  if (conflictingAppointment) {
    throw new AppError('This slot is already booked', 400);
  }

  appointment.dateTime = newDateTime;
  appointment.status = 'rescheduled';
  await appointment.save();
  return appointment;
};


  exports.getPatientAppointments = async (patientId, page = 1, limit = 10) => {
    const skip = (page - 1) * limit;
  
    const appointments = await Appointment.find({ patient: patientId })
      .sort({ dateTime: -1 })
      .skip(skip)
      .limit(limit)
      .populate('doctor', 'name specialization')
      .lean();
  
    const total = await Appointment.countDocuments({ patient: patientId });
  
    return {
      appointments,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalAppointments: total
    };
  };

exports.getAppointmentsByIds = async (appointmentIds) => {
  return await Appointment.find({ _id: { $in: appointmentIds } })
    .populate('doctor', 'name specialization')
    .populate('patient', 'name');
};

exports.getUpcomingAppointments = async (patientId) => {
  const currentDate = new Date();
  return await Appointment.find({
    patient: patientId,
    dateTime: { $gt: currentDate },
    status: { $in: ['scheduled', 'rescheduled'] }
  }).populate('doctor', 'name specialization');
};