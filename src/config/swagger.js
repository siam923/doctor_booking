const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const { authDocs } = require('../docs/auth.docs');
const { doctorDocs, doctorSchemas } = require('../docs/doctors.docs');
const { patientDocs } = require('../docs/patients.docs');
const { appointmentDocs } = require('../docs/appointment.docs');
const { subscriptionDocs } = require('../docs/subscription.docs');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Doctor Appointment API',
      version: '1.0.0',
      description: 'API for managing doctor appointments',
    },
    security: [{
      bearerAuth: [],
    }],
    paths: {
      ...authDocs,
      ...doctorDocs,
      ...patientDocs,
      ...appointmentDocs,
      ...subscriptionDocs,
    },
    components: {
      schemas: {
        ...doctorSchemas,
        // Add other schemas here if needed
      },
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      }
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT}`,
        description: 'Development server',
      },
    ],
  },
  
  apis: [], // paths to the API docs e.g. routes/*.js
};

const specs = swaggerJsdoc(options);

module.exports = { swaggerUi, specs };