const patientService = require("../services/patientService");
const appointmentService = require("../services/appointmentService");
const {catchAsync} = require("../utils/catchAsync");
const { authorizeRoles } = require("../middleware/authMiddleware");
const validateRequest = require("../middleware/validateRequest");
const {
  patientRegistrationSchema,
  patientUpdateSchema,
  medicalHistorySchema,
  allergySchema,
} = require("../utils/validators/patientValidation");

exports.registerPatient = [
  validateRequest(patientRegistrationSchema),
  catchAsync(async (req, res) => {
    const patient = await patientService.createPatient(req.user._id, req.body);
    res.status(201).json({
      status: "success",
      data: { patient },
    });
  }),
];

exports.getPatientProfile = catchAsync(async (req, res) => {
  const patient = await patientService.getPatientByUserId(req.user._id);
  res.status(200).json({
    status: "success",
    data: { patient },
  });
});

exports.updatePatientProfile = [
  validateRequest(patientUpdateSchema),
  catchAsync(async (req, res) => {
    const patient = await patientService.updatePatient(req.user._id, req.body);
    res.status(200).json({
      status: "success",
      data: { patient },
    });
  }),
];

exports.addMedicalHistory = [
  validateRequest(medicalHistorySchema),
  catchAsync(async (req, res) => {
    const patient = await patientService.addMedicalHistory(
      req.user._id,
      req.body
    );
    res.status(200).json({
      status: "success",
      data: { patient },
    });
  }),
];

exports.updateMedicalHistory = [
  validateRequest(medicalHistorySchema),
  catchAsync(async (req, res) => {
    const patient = await patientService.updateMedicalHistory(
      req.user._id,
      req.params.historyId,
      req.body
    );
    res.status(200).json({
      status: "success",
      data: { patient },
    });
  }),
];

exports.deleteMedicalHistory = catchAsync(async (req, res) => {
  const patient = await patientService.deleteMedicalHistory(
    req.user._id,
    req.params.historyId
  );
  res.status(200).json({
    status: "success",
    data: { patient },
  });
});

exports.addAllergy = [
  validateRequest(allergySchema),
  catchAsync(async (req, res) => {
    const patient = await patientService.addAllergy(
      req.user._id,
      req.body.allergy
    );
    res.status(200).json({
      status: "success",
      data: { patient },
    });
  }),
];

exports.removeAllergy = catchAsync(async (req, res) => {
  const patient = await patientService.removeAllergy(
    req.user._id,
    req.params.allergy
  );
  res.status(200).json({
    status: "success",
    data: { patient },
  });
});

exports.getAppointmentHistory = catchAsync(async (req, res) => {
  const patientId = req.user._id;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  const result = await appointmentService.getPatientAppointments(
    patientId,
    page,
    limit
  );

  res.status(200).json({
    status: "success",
    data: result,
  });
});
exports.addFavoriteDoctor = catchAsync(async (req, res) => {
  const patient = await patientService.addFavoriteDoctor(
    req.user._id,
    req.params.doctorId
  );
  res.status(200).json({
    status: "success",
    data: { patient },
  });
});

exports.removeFavoriteDoctor = catchAsync(async (req, res) => {
  const patient = await patientService.removeFavoriteDoctor(
    req.user._id,
    req.params.doctorId
  );
  res.status(200).json({
    status: "success",
    data: { patient },
  });
});

exports.getFavoriteDoctors = catchAsync(async (req, res) => {
  const patient = await patientService.getPatientByUserId(req.user._id);
  res.status(200).json({
    status: "success",
    data: { favoriteDoctors: patient.favoriteDoctors },
  });
});
