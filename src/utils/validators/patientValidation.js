const Joi = require('joi');

const patientRegistrationSchema = Joi.object({
  dateOfBirth: Joi.date().max('now').required(),
  gender: Joi.string().valid('male', 'female', 'other').required(),
  medicalHistory: Joi.array().items(
    Joi.object({
      condition: Joi.string().required(),
      diagnosisDate: Joi.date().max('now').required(),
      notes: Joi.string().allow('', null)
    })
  ),
  allergies: Joi.array().items(Joi.string())
});

const patientUpdateSchema = Joi.object({
  dateOfBirth: Joi.date().max('now'),
  gender: Joi.string().valid('male', 'female', 'other'),
  medicalHistory: Joi.array().items(
    Joi.object({
      condition: Joi.string(),
      diagnosisDate: Joi.date().max('now'),
      notes: Joi.string().allow('', null)
    })
  ),
  allergies: Joi.array().items(Joi.string())
});

const medicalHistorySchema = Joi.object({
  condition: Joi.string().required(),
  diagnosisDate: Joi.date().max('now').required(),
  notes: Joi.string().allow('', null)
});

const allergySchema = Joi.object({
  allergy: Joi.string().required()
});

module.exports = {
  patientRegistrationSchema,
  patientUpdateSchema,
  medicalHistorySchema,
  allergySchema
};