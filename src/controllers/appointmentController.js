const appointmentService = require('../services/appointmentService');
const {catchAsync} = require('../utils/catchAsync');

exports.getAvailableSlots = catchAsync(async (req, res) => {
  const { doctorId, date } = req.query;
  const availableSlots = await appointmentService.getAvailableSlots(doctorId, date);
  res.status(200).json({
    status: 'success',
    data: { availableSlots }
  });
});

exports.createAppointment = catchAsync(async (req, res) => {
  const { doctorId, dateTime } = req.body;
  const appointment = await appointmentService.createAppointment(doctorId, req.user._id, dateTime);
  res.status(201).json({
    status: 'success',
    data: { appointment }
  });
});

exports.cancelAppointment = catchAsync(async (req, res) => {
  const { appointmentId } = req.params;
  const appointment = await appointmentService.cancelAppointment(appointmentId, req.user._id);
  res.status(200).json({
    status: 'success',
    data: { appointment }
  });
});

exports.rescheduleAppointment = catchAsync(async (req, res) => {
  const { appointmentId } = req.params;
  const { newDateTime } = req.body;
  const appointment = await appointmentService.rescheduleAppointment(appointmentId, req.user._id, newDateTime);
  res.status(200).json({
    status: 'success',
    data: { appointment }
  });
});

exports.getUpcomingAppointments = catchAsync(async (req, res) => {
  const appointments = await appointmentService.getUpcomingAppointments(req.user._id);
  res.status(200).json({
    status: 'success',
    data: { appointments }
  });
});