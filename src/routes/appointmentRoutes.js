// routes/appointmentRoutes.js

const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointmentController');
const { authenticateToken, authorizeRoles } = require('../middleware/authMiddleware');

router.use(authenticateToken);

router.get('/available-slots', appointmentController.getAvailableSlots);
router.post('/', authorizeRoles('patient'), appointmentController.createAppointment);
router.put('/:appointmentId/cancel', authorizeRoles('patient'), appointmentController.cancelAppointment);
router.put('/:appointmentId/reschedule', authorizeRoles('patient'), appointmentController.rescheduleAppointment);
router.get('/upcoming', authorizeRoles('patient'), appointmentController.getUpcomingAppointments);

module.exports = router;