// models/DoctorSubscription.js
const mongoose = require('mongoose');

const doctorSubscriptionSchema = new mongoose.Schema({
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  planId: { type: mongoose.Schema.Types.ObjectId, ref: 'SubscriptionPlan', required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  status: { type: String, enum: ['active', 'expired', 'cancelled'], default: 'active' },
  paymentStatus: { type: String, enum: ['paid', 'pending', 'failed'], default: 'pending' },
  paymentMethod: { type: String, enum: ['bkash', 'bank'], required: true },
  paymentDetails: {
    bkashNumber: String,
    bankName: String,
    bankBranch: String,
  },
}, { timestamps: true });

module.exports = mongoose.model('DoctorSubscription', doctorSubscriptionSchema);