const Doctor = require('../models/Doctor');
const Specialization = require('../models/Specialization');
const User = require('../models/User');
const { AppError } = require('../utils/appError');

exports.createDoctor = async (doctorData) => {
  const user = await User.findById(doctorData.userId);
  if (!user) {
    throw new AppError('User not found', 404);
  }

  const doctor = await Doctor.create(doctorData);
  return doctor;
};

exports.getAllDoctors = async (filters) => {
    const page = parseInt(filters.page, 10) || 1;
    const limit = parseInt(filters.limit, 10) || 10;
    const skip = (page - 1) * limit;
  
    let query = Doctor.find()
      .populate('userId', 'username email')
      .populate('specialization', 'name');
  
    if (filters.specialization) {
      query = query.where('specialization').equals(filters.specialization);
    }
  
    if (filters.hospital) {
      query = query.where('hospitals').in([new RegExp(filters.hospital, 'i')]);
    }
  
    if (filters.location) {
      const [lng, lat] = filters.location.split(',').map(Number);
      query = query.where('location').near({
        center: { type: 'Point', coordinates: [lng, lat] },
        maxDistance: 10000 // 10km
      });
    }
  
    if (filters.search) {
      const searchRegex = new RegExp(filters.search, 'i');
      query = query.or([
        { 'userId.username': searchRegex },
        { 'userId.email': searchRegex },
        { qualifications: searchRegex },
        { hospitals: searchRegex },
        { bio: searchRegex }
      ]);
    }
  
    const totalCount = await Doctor.countDocuments(query);
    const doctors = await query
      .select('userId specialization qualifications yearsOfExperience rating reviewsCount consultationFee bio profilePicture hospitals')
      .skip(skip)
      .limit(limit)
      .exec();
  
    return {
      doctors,
      totalCount,
      page,
      limit
    };
  };
  
  exports.getHospitals = async (search) => {
    let query = {};
    if (search) {
      query = { hospitals: new RegExp(search, 'i') };
    }
  
    const hospitals = await Doctor.distinct('hospitals', query);
    return hospitals;
  };
  
  exports.getSpecializations = async (search) => {
    let query = {};
    if (search) {
      query = { name: new RegExp(search, 'i') };
    }
  
    const specializations = await Specialization.find(query).select('name description');
    return specializations;
  };

  exports.getDoctorById = async (id) => {
    const doctor = await Doctor.findById(id).populate('userId', 'username email').populate('specialization', 'name');
    return doctor;
  };

  exports.updateDoctor = async (id, updateData) => {
    const doctor = await Doctor.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
    return doctor;
  };

exports.deleteDoctor = async (id) => {
  const doctor = await Doctor.findByIdAndDelete(id);
  if (!doctor) throw new AppError('Doctor not found', 404);
  await User.findByIdAndUpdate(doctor.userId, { role: 'patient' });
};

exports.updateSchedule = async (id, schedule) => {
  const doctor = await Doctor.findByIdAndUpdate(
    id,
    { $set: { availableSlots: schedule } },
    { new: true, runValidators: true }
  );
  return doctor ? doctor.availableSlots : null;
};
