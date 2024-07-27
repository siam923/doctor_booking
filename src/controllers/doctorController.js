const Doctor = require('../models/Doctor');
const doctorService = require('../services/doctorService');
const { AppError } = require('../utils/appError');
const { catchAsync } = require('../utils/catchAsync');

exports.createDoctor = catchAsync(async (req, res) => {
    const doctor = await doctorService.createDoctor(req.body);
    res.status(201).json({ success: true, data: doctor });
  });

exports.getAllDoctors = catchAsync(async (req, res) => {
    const { doctors, totalCount, page, limit } = await doctorService.getAllDoctors(req.query);
    res.status(200).json({
      success: true,
      data: doctors,
      pagination: {
        totalCount,
        page,
        limit,
        totalPages: Math.ceil(totalCount / limit)
      }
    });
  });
  
  exports.getHospitals = catchAsync(async (req, res) => {
    const hospitals = await doctorService.getHospitals(req.query.search);
    res.status(200).json({ success: true, data: hospitals });
  });
  
  exports.getSpecializations = catchAsync(async (req, res) => {
    const specializations = await doctorService.getSpecializations(req.query.search);
    res.status(200).json({ success: true, data: specializations });
  });

  exports.getDoctorById = catchAsync(async (req, res) => {
    const doctor = await doctorService.getDoctorById(req.params.id);
    if (!doctor) {
      return res.status(404).json({ success: false, message: 'Doctor not found' });
    }
    res.status(200).json({ success: true, data: doctor });
  });

  exports.updateDoctor = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const updateData = req.body;
  
    // Fetch the doctor profile
    const doctorProfile = await Doctor.findById(id).populate('userId');
    
    if (!doctorProfile) {
      throw new AppError('Doctor not found', 404);
    }
  
    // Check if the user is an admin or the doctor themselves
    if (req.user.role.name !== 'admin' && req.user._id.toString() !== doctorProfile.userId._id.toString()) {
      throw new AppError('Not authorized to update this doctor profile', 403);
    }
  
    const updatedDoctor = await doctorService.updateDoctor(id, updateData);
  
    res.status(200).json({ success: true, data: updatedDoctor });
  });

exports.deleteDoctor = catchAsync(async (req, res) => {
  await doctorService.deleteDoctor(req.params.id);
  res.status(204).json({ success: true, data: null });
});

exports.updateSchedule = catchAsync(async (req, res) => {
    const schedule = await doctorService.updateSchedule(req.params.id, req.body.schedule);
    if (!schedule) {
      return res.status(404).json({ success: false, message: 'Doctor not found' });
    }
    res.status(200).json({ success: true, data: schedule });
  });