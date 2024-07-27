const mongoose = require('mongoose');
const moment = require('moment');
const appointmentService = require('../services/appointmentService');
const Appointment = require('../models/Appointment');
const DoctorAvailability = require('../models/DoctorAvailability');
const { AppError } = require('../utils/appError');

// Import all necessary models
const User = require('../models/User');
const Doctor = require('../models/Doctor');
const Patient = require('../models/Patient');
const Specialization = require('../models/Specialization');
const Role = require('../models/Role');

describe('Appointment Service', () => {
  let doctorId;
  let patientId;
  let roleId;

  beforeAll(async () => {
    await mongoose.connect(`${process.env.MONGO_URI}/test`);
    doctorId = new mongoose.Types.ObjectId();
    patientId = new mongoose.Types.ObjectId();
    roleId = new mongoose.Types.ObjectId();
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    await Appointment.deleteMany({});
    await DoctorAvailability.deleteMany({});
    await User.deleteMany({});
    await Doctor.deleteMany({});
    await Patient.deleteMany({});
    await Specialization.deleteMany({});
    await Role.deleteMany({});
  });

  describe('getAvailableSlots', () => {
    it('should return available slots for a doctor on a given date', async () => {
      const date = moment().add(1, 'days').startOf('day');
      const dayOfWeek = date.day();

      await DoctorAvailability.create({
        doctor: doctorId,
        dayOfWeek,
        startTime: '09:00',
        endTime: '17:00'
      });

      const slots = await appointmentService.getAvailableSlots(doctorId, date.toDate());

      expect(slots).toHaveLength(16); // 8 hours * 2 slots per hour
      expect(slots[0]).toBe(date.set({ hour: 9, minute: 0 }).format());
      expect(slots[slots.length - 1]).toBe(date.set({ hour: 16, minute: 30 }).format());
    });

    it('should throw an error if no availability is found', async () => {
      const date = moment().add(1, 'days').startOf('day');

      await expect(appointmentService.getAvailableSlots(doctorId, date.toDate()))
        .rejects
        .toThrow(AppError);
    });
  });

  describe('createAppointment', () => {
    it('should create a new appointment', async () => {
      const dateTime = moment().add(1, 'days').set({ hour: 10, minute: 0 }).toDate();

      const appointment = await appointmentService.createAppointment(doctorId, patientId, dateTime);

      expect(appointment).toBeDefined();
      expect(appointment.doctor.toString()).toBe(doctorId.toString());
      expect(appointment.patient.toString()).toBe(patientId.toString());
      expect(appointment.dateTime).toEqual(dateTime);
      expect(appointment.status).toBe('scheduled');
    });

    it('should throw an error if the slot is already booked', async () => {
      const dateTime = moment().add(1, 'days').set({ hour: 10, minute: 0 }).toDate();

      await Appointment.create({
        doctor: doctorId,
        patient: new mongoose.Types.ObjectId(),
        dateTime,
        status: 'scheduled'
      });

      await expect(appointmentService.createAppointment(doctorId, patientId, dateTime))
        .rejects
        .toThrow(AppError);
    });
  });

  describe('cancelAppointment', () => {
    it('should cancel an existing appointment', async () => {
      const appointment = await Appointment.create({
        doctor: doctorId,
        patient: patientId,
        dateTime: moment().add(1, 'days').toDate(),
        status: 'scheduled'
      });

      const cancelledAppointment = await appointmentService.cancelAppointment(appointment._id, patientId);

      expect(cancelledAppointment.status).toBe('cancelled');
    });

    it('should throw an error if the appointment is not found', async () => {
      const fakeAppointmentId = new mongoose.Types.ObjectId();

      await expect(appointmentService.cancelAppointment(fakeAppointmentId, patientId))
        .rejects
        .toThrow(AppError);
    });
  });

  describe('rescheduleAppointment', () => {
    it('should reschedule an existing appointment', async () => {
      const oldDateTime = moment().add(1, 'days').toDate();
      const newDateTime = moment().add(2, 'days').toDate();

      const appointment = await Appointment.create({
        doctor: doctorId,
        patient: patientId,
        dateTime: oldDateTime,
        status: 'scheduled'
      });

      const rescheduledAppointment = await appointmentService.rescheduleAppointment(appointment._id, patientId, newDateTime);

      expect(rescheduledAppointment.dateTime).toEqual(newDateTime);
      expect(rescheduledAppointment.status).toBe('rescheduled');
    });

    it('should throw an error if the new slot is already booked', async () => {
      const oldDateTime = moment().add(1, 'days').toDate();
      const newDateTime = moment().add(2, 'days').toDate();

      const appointment = await Appointment.create({
        doctor: doctorId,
        patient: patientId,
        dateTime: oldDateTime,
        status: 'scheduled'
      });

      await Appointment.create({
        doctor: doctorId,
        patient: new mongoose.Types.ObjectId(),
        dateTime: newDateTime,
        status: 'scheduled'
      });

      await expect(appointmentService.rescheduleAppointment(appointment._id, patientId, newDateTime))
        .rejects
        .toThrow(AppError);
    });
  });

  describe('getUpcomingAppointments', () => {
    it('should return upcoming appointments for a patient', async () => {
      // Create a role
      const role = new Role({
        _id: roleId,
        name: 'doctor',
        description: 'Doctor role'
      });
      await role.save();

      // Create a user for the doctor
      const doctorUser = new User({
        username: 'testdoctor',
        email: 'testdoctor@example.com',
        phone: '1234567890',
        passwordHash: 'hashedpassword',
        role: role._id,
      });
      await doctorUser.save();

      // Create a specialization
      const specialization = new Specialization({
        name: 'General',
        description: 'General practitioner'
      });
      await specialization.save();

      // Create a doctor
      const doctor = new Doctor({
        userId: doctorUser._id,
        specialization: specialization._id,
        qualifications: ['MBBS'],
        yearsOfExperience: 5,
        consultationFee: 100,
        location: {
          type: 'Point',
          coordinates: [0, 0]
        }
      });
      await doctor.save();

      const futureDate1 = moment().add(1, 'days').toDate();
      const futureDate2 = moment().add(2, 'days').toDate();
      const pastDate = moment().subtract(1, 'days').toDate();

      await Appointment.create([
        { doctor: doctor._id, patient: patientId, dateTime: futureDate1, status: 'scheduled' },
        { doctor: doctor._id, patient: patientId, dateTime: futureDate2, status: 'scheduled' },
        { doctor: doctor._id, patient: patientId, dateTime: pastDate, status: 'completed' }
      ]);

      const upcomingAppointments = await appointmentService.getUpcomingAppointments(patientId);

      expect(upcomingAppointments).toHaveLength(2);
      expect(upcomingAppointments[0].dateTime).toEqual(futureDate1);
      expect(upcomingAppointments[1].dateTime).toEqual(futureDate2);
    });
  });
});