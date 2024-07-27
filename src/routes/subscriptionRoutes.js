// routes/subscriptionRoutes.js
const express = require('express');
const { authenticateToken, authorizeRoles } = require('../middleware/authMiddleware');
const subscriptionController = require('../controllers/subscriptionController');

const router = express.Router();

// Public route
router.get('/payment-info', subscriptionController.getPaymentInfo);

// Admin routes
router.use(authenticateToken, authorizeRoles('admin'));
router.post('/plans', subscriptionController.createPlan);
router.put('/plans/:id', subscriptionController.updatePlan);
router.delete('/plans/:id', subscriptionController.deletePlan);
router.get('/plans', subscriptionController.getAllPlans);
router.put('/payment-info', subscriptionController.updatePaymentInfo);
router.get('/pending-subscriptions', subscriptionController.getPendingSubscriptions);
router.put('/approve-payment/:subscriptionId', subscriptionController.approveSubscriptionPayment);
router.put('/reject-payment/:subscriptionId', subscriptionController.rejectSubscriptionPayment);

// Doctor routes
router.use(authenticateToken, authorizeRoles('doctor'));
router.post('/subscribe', subscriptionController.subscribeToPlan);
router.get('/my-subscription', subscriptionController.getMySubscription);



module.exports = router;