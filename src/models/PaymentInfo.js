const mongoose = require('mongoose');

const paymentInfoSchema = new mongoose.Schema({
  bkash: {
    number: { type: String, required: true }
  },
  bank: {
    accountName: { type: String, required: true },
    accountNumber: { type: String, required: true },
    bankName: { type: String, required: true },
    branchName: { type: String, required: true }
  }
}, { timestamps: true });

module.exports = mongoose.model('PaymentInfo', paymentInfoSchema);