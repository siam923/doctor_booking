// scripts/initPaymentInfo.js
const mongoose = require('mongoose');
const PaymentInfo = require('../models/PaymentInfo');
require("dotenv").config();
mongoose.connect(process.env.MONGODB_URI)

const initPaymentInfo = async () => {
  const existingInfo = await PaymentInfo.findOne();
  if (!existingInfo) {
    await PaymentInfo.create({
      bkash: { number: '01XXXXXXXXX' },
      bank: {
        accountName: 'Your Account Name',
        accountNumber: 'Your Account Number',
        bankName: 'Your Bank Name',
        branchName: 'Your Branch Name'
      }
    });
    console.log('Payment info initialized');
  } else {
    console.log('Payment info already exists');
  }
  mongoose.connection.close();
};

initPaymentInfo();