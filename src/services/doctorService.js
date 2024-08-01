const Doctor = require('../models/Doctor');
const Specialization = require('../models/Specialization');
const User = require('../models/User');
const { AppError } = require('../utils/appError');

exports.createDoctor = async (doctorData) => {
  // Check if the user exists
  const user = await User.findById(doctorData.userId);
  if (!user) {
    throw new AppError('User not found', 404);
  }

  // Check if a doctor profile already exists for this user
  const existingDoctor = await Doctor.findOne({ userId: doctorData.userId });
  if (existingDoctor) {
    throw new AppError('A doctor profile already exists for this user', 409); // 409 Conflict
  }

  // Create the new doctor profile
  const doctor = await Doctor.create(doctorData);

  // Update the user's role to 'doctor'
  await User.findByIdAndUpdate(doctorData.userId, { role: 'doctor' });

  return doctor;
};

exports.getAllDoctors = async (filters) => {
  const page = parseInt(filters.page, 10) || 1;
  const limit = parseInt(filters.limit, 10) || 10;
  const skip = (page - 1) * limit;

  let query = Doctor.find();

  if (filters.specialization) {
    query = query.where('specialization').equals(filters.specialization);
  }

  if (filters.hospital) {
    query = query.where('hospitals').regex(new RegExp(filters.hospital, 'i'));
  }

  // Address filtering
  if (filters.city) {
    query = query.where('address.city').regex(new RegExp(`^${filters.city}`, 'i'));
  }
  if (filters.state) {
    query = query.where('address.state').regex(new RegExp(`^${filters.state}`, 'i'));
  }
  if (filters.country) {
    query = query.where('address.country').regex(new RegExp(`^${filters.country}`, 'i'));
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
      { bio: searchRegex },
      { 'address.street': searchRegex },
      { 'address.city': searchRegex },
      { 'address.state': searchRegex },
      { 'address.country': searchRegex }
    ]);
  }

  const totalCount = await Doctor.countDocuments(query);
  
  const doctors = await query
    .populate('userId', 'username email fullname')
    .populate('specialization', 'name')
    .select('userId specialization qualifications yearsOfExperience rating reviewsCount consultationFee bio profilePicture hospitals address')
    .skip(skip)
    .limit(limit)
    .lean()
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
    // Find the doctor
    const doctor = await Doctor.findById(id);
    if (!doctor) {
      throw new AppError('Doctor not found', 404);
    }
  
    // If updating location, ensure it's in the correct format
    if (updateData.location) {
      if (!updateData.location.type || !updateData.location.coordinates) {
        throw new AppError('Invalid location format', 400);
      }
      doctor.location = updateData.location;
    }
  
    // If updating address, ensure it's an object
    if (updateData.address && typeof updateData.address === 'object') {
      doctor.address = { ...doctor.address, ...updateData.address };
    } else if (updateData.address) {
      throw new AppError('Invalid address format', 400);
    }
  
    // Update other fields
    Object.keys(updateData).forEach(key => {
      if (key !== 'location' && key !== 'address') {
        doctor[key] = updateData[key];
      }
    });
  
    // Save the updated doctor
    const updatedDoctor = await doctor.save();
  
    if (!updatedDoctor) {
      throw new AppError('Failed to update doctor', 500);
    }
  
    return updatedDoctor;
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
