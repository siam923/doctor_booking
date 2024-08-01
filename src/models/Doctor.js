const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  specialization: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Specialization',
    required: true
  },
  qualifications: [{
    type: String,
    required: true
  }],
  yearsOfExperience: {
    type: Number,
    required: true
  },
  availableSlots: [{
    day: {
      type: String,
      enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      required: true
    },
    slots: [{
      startTime: String,
      endTime: String
    }]
  }],
  rating: {
    type: Number,
    default: 0
  },
  reviewsCount: {
    type: Number,
    default: 0
  },
  consultationFee: {
    type: Number,
    required: true
  },
  bio: {
    type: String,
    maxlength: 500
  },
  profilePicture: {
    type: String
  },
  reviews: [{
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Patient'
    },
    rating: Number,
    comment: String,
    date: {
      type: Date,
      default: Date.now
    }
  }],
  hospitals: [{
    type: String
  }],
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number],
      required: true
    }
  },
  address: {
    street: String,
    city: String,
    state: String,
    country: String,
    postalCode: String
  }
}, {
  timestamps: true
});

doctorSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Doctor', doctorSchema);