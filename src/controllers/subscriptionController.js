const SubscriptionPlan = require('../models/SubscriptionPlan');
const PaymentInfo = require('../models/PaymentInfo');
const DoctorSubscription = require('../models/DoctorSubscription');
const User = require('../models/User');
const {AppError} = require('../utils/appError');
const {catchAsync} = require('../utils/catchAsync');

// Admin functions
exports.createPlan = catchAsync(async (req, res) => {
  const plan = await SubscriptionPlan.create(req.body);
  res.status(201).json({ success: true, data: plan });
});

exports.updatePlan = catchAsync(async (req, res) => {
  const plan = await SubscriptionPlan.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!plan) throw new AppError('Plan not found', 404);
  res.status(200).json({ success: true, data: plan });
});

exports.deletePlan = catchAsync(async (req, res) => {
  const plan = await SubscriptionPlan.findByIdAndDelete(req.params.id);
  if (!plan) throw new AppError('Plan not found', 404);
  res.status(204).json({ success: true, data: null });
});

exports.getAllPlans = catchAsync(async (req, res) => {
  const plans = await SubscriptionPlan.find();
  res.status(200).json({ success: true, data: plans });
});

// Doctor functions
exports.subscribeToPlan = catchAsync(async (req, res) => {
  const { planId, paymentMethod, paymentDetails } = req.body;
  const doctorId = req.user._id;

  const plan = await SubscriptionPlan.findById(planId);
  if (!plan) throw new AppError('Subscription plan not found', 404);

  const startDate = new Date();
  const endDate = new Date(startDate.getTime() + plan.duration * 24 * 60 * 60 * 1000);

  const subscription = await DoctorSubscription.create({
    doctorId,
    planId,
    startDate,
    endDate,
    paymentMethod,
    paymentDetails,
  });

  res.status(201).json({ success: true, data: subscription });
});

exports.getMySubscription = catchAsync(async (req, res) => {
  const subscription = await DoctorSubscription.findOne({ doctorId: req.user._id, status: 'active' })
    .populate('planId');
  if (!subscription) throw new AppError('No active subscription found', 404);
  res.status(200).json({ success: true, data: subscription });
});

// Utility function
exports.checkAndUpdateExpiredSubscriptions = catchAsync(async () => {
  const expiredSubscriptions = await DoctorSubscription.find({
    status: 'active',
    endDate: { $lte: new Date() }
  });

  for (let subscription of expiredSubscriptions) {
    subscription.status = 'expired';
    await subscription.save();
  }
});



exports.updatePaymentInfo = catchAsync(async (req, res) => {
  let paymentInfo = await PaymentInfo.findOne();
  if (paymentInfo) {
    paymentInfo = await PaymentInfo.findOneAndUpdate({}, req.body, { new: true, runValidators: true });
  } else {
    paymentInfo = await PaymentInfo.create(req.body);
  }
  res.status(200).json({ success: true, data: paymentInfo });
});

// Public function to get payment info
exports.getPaymentInfo = catchAsync(async (req, res) => {
  const paymentInfo = await PaymentInfo.findOne();
  if (!paymentInfo) throw new AppError('Payment information not found', 404);
  res.status(200).json({ success: true, data: paymentInfo });
});

// Admin function to approve subscription payment
exports.approveSubscriptionPayment = catchAsync(async (req, res) => {
  const { subscriptionId } = req.params;
  const subscription = await DoctorSubscription.findById(subscriptionId);
  if (!subscription) throw new AppError('Subscription not found', 404);

  subscription.paymentStatus = 'paid';
  await subscription.save();

  res.status(200).json({ success: true, data: subscription });
});

// Admin function to reject subscription payment
exports.rejectSubscriptionPayment = catchAsync(async (req, res) => {
  const { subscriptionId } = req.params;
  const subscription = await DoctorSubscription.findById(subscriptionId);
  if (!subscription) throw new AppError('Subscription not found', 404);

  subscription.paymentStatus = 'failed';
  subscription.status = 'cancelled';
  await subscription.save();

  res.status(200).json({ success: true, data: subscription });
});

// Admin function to get all pending subscriptions
exports.getPendingSubscriptions = catchAsync(async (req, res) => {
  const pendingSubscriptions = await DoctorSubscription.find({ paymentStatus: 'pending' })
    .populate('doctorId', 'username email')
    .populate('planId');
  res.status(200).json({ success: true, data: pendingSubscriptions });
});