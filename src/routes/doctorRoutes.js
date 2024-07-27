const express = require('express');
const router = express.Router();
const doctorController = require('../controllers/doctorController');
const { authenticateToken, authorizeRoles, checkDoctorSubscription } = require('../middleware/authMiddleware');
const { validateDoctorCreation, validateScheduleUpdate, validateDoctorUpdate } = require('../utils/validators/doctorValidation');

router.get('/', doctorController.getAllDoctors);
router.post('/', authenticateToken, authorizeRoles('admin'), validateDoctorCreation, doctorController.createDoctor);

router.get('/hospitals', doctorController.getHospitals);
router.get('/specializations', doctorController.getSpecializations);

router.get('/:id', doctorController.getDoctorById);
router.put('/:id', authenticateToken, authorizeRoles('admin', 'doctor'), validateDoctorUpdate, doctorController.updateDoctor);
router.delete('/:id', authenticateToken, authorizeRoles('admin'), doctorController.deleteDoctor);

router.put('/:id/schedule', authenticateToken, authorizeRoles('doctor'), checkDoctorSubscription, validateScheduleUpdate, doctorController.updateSchedule);

module.exports = router;