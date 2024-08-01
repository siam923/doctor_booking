const express = require('express');
const { rateLimiter } = require('./middleware/rateLimiter.js');
const { AppError } = require('./utils/appError');
require("dotenv").config();
const cors = require('cors');

// Routes
const authRoutes = require('./routes/authRoutes');
const doctorRoutes = require('./routes/doctorRoutes');
const patientRoutes = require('./routes/patientRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');
const subscriptionRoutes = require('./routes/subscriptionRoutes');
const { swaggerUi, specs } = require('./config/swagger.js');

const app = express();

// Middleware
app.use(cors()); // allow any origin
// app.use(cors({
//   origin: ['http://frontend-domain.com', 'http://another-allowed-domain.com'],
//   methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
//   credentials: true, // Allow credentials (cookies, authorization headers, etc.)
//   optionsSuccessStatus: 204 // For legacy browser support
// }));
app.use(express.json());
app.use(rateLimiter);


app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs))
// Routes
app.use('/api/auth', authRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/subscriptions', subscriptionRoutes);
// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err);

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message
    });
  }

  res.status(500).json({
    success: false,
    message: 'Something went wrong!'
  });
});

module.exports = app;