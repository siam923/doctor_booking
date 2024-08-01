const Joi = require('joi');

exports.validateRegistration = (data) => {
  const schema = Joi.object({
    fullname: Joi.string().min(3).max(30).required(),
    email: Joi.string().email().required(),
    phone: Joi.string().pattern(/^\+[0-9]{11,}$/).required(),
    password: Joi.string().pattern(/^(?=.*[@$!%*?&])[a-zA-Z\d@$!%*?&]{8,}$/).required(),
    role: Joi.string().valid('patient', 'doctor', 'admin').required()
  });

  return schema.validate(data);
};

exports.validateLogin = (data) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
  });

  return schema.validate(data);
};