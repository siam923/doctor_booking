const Joi = require('joi');

exports.validateDoctorCreation = (req, res, next) => {
  const schema = Joi.object({
    userId: Joi.string().required(),
    specialization: Joi.string().required(),
    qualifications: Joi.array().items(Joi.string()).min(1).required(),
    yearsOfExperience: Joi.number().min(0).required(),
    consultationFee: Joi.number().min(0).required(),
    bio: Joi.string().max(500),
    hospitals: Joi.array().items(Joi.string()),
    location: Joi.object({
      type: Joi.string().valid('Point'),
      coordinates: Joi.array().items(Joi.number()).length(2)
    }).optional(),
    address: Joi.object({
      street: Joi.string(),
      city: Joi.string(),
      state: Joi.string(),
      country: Joi.string(),
      postalCode: Joi.string()
    }).optional()
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ success: false, message: error.details[0].message });
  }
  next();
};

exports.validateDoctorUpdate = (req, res, next) => {
  const schema = Joi.object({
    specialization: Joi.string(),
    qualifications: Joi.array().items(Joi.string()).min(1),
    yearsOfExperience: Joi.number().min(0),
    consultationFee: Joi.number().min(0),
    bio: Joi.string().max(500),
    hospitals: Joi.array().items(Joi.string()),
    location: Joi.object({
      type: Joi.string().valid('Point'),
      coordinates: Joi.array().items(Joi.number()).length(2)
    }).optional(),
    address: Joi.object({
      street: Joi.string(),
      city: Joi.string(),
      state: Joi.string(),
      country: Joi.string(),
      postalCode: Joi.string()
    }).optional()
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ success: false, message: error.details[0].message });
  }
  next();
};

exports.validateScheduleUpdate = (req, res, next) => {
  const schema = Joi.object({
    schedule: Joi.array().items(Joi.object({
      day: Joi.string().valid('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday').required(),
      slots: Joi.array().items(Joi.object({
        startTime: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).required(),
        endTime: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).required()
      }))
    })).min(1).required()
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ success: false, message: error.details[0].message });
  }
  next();
};