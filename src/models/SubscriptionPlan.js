const mongoose = require('mongoose');

const subscriptionPlanSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  duration: { type: Number, required: true }, // in days
  price: { type: Number, required: true },
  features: [{ type: String }],
  specialtyCategory: { type: String, required: true }, // e.g., 'general', 'surgeon', 'specialist'
}, { timestamps: true });

module.exports = mongoose.model('SubscriptionPlan', subscriptionPlanSchema);