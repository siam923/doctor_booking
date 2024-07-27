// routes/patientRoutes.js

const express = require('express');
const router = express.Router();
const patientController = require('../controllers/patientController');
const { authenticateToken, authorizeRoles } = require('../middleware/authMiddleware');

// Middleware to ensure the user has a patient role
const ensurePatientRole = authorizeRoles('patient');

// Patient registration and profile creation
router.post('/register', authenticateToken, patientController.registerPatient);

// All other routes require authentication and patient role
router.use(authenticateToken, ensurePatientRole);

router.get('/profile', patientController.getPatientProfile);
router.put('/profile', patientController.updatePatientProfile);
router.post('/medical-history', patientController.addMedicalHistory);
router.put('/medical-history/:historyId', patientController.updateMedicalHistory);
router.delete('/medical-history/:historyId', patientController.deleteMedicalHistory);
router.post('/allergies', patientController.addAllergy);
router.delete('/allergies/:allergy', patientController.removeAllergy);
router.get('/appointments', patientController.getAppointmentHistory);
router.post('/favorite-doctors/:doctorId', patientController.addFavoriteDoctor);
router.delete('/favorite-doctors/:doctorId', patientController.removeFavoriteDoctor);
router.get('/favorite-doctors', patientController.getFavoriteDoctors);

module.exports = router;