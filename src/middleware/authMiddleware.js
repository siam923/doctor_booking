const jwt = require('jsonwebtoken');
const User = require('../models/User.js');
const DoctorSubscription = require('../models/DoctorSubscription.js');

exports.authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ message: 'Access token is required' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    const user = await User.findById(decoded.id).populate('role');
    if (!user) return res.status(404).json({ message: 'User not found' });

    req.user = user;
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Invalid token' });
  }
};

exports.authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    if (roles.includes(req.user.role.name)) {
      return next();
    }
    
    // Allow doctors to access their own routes
    if (req.user.role.name === 'doctor' && (req.path.startsWith('/subscribe') || req.path.startsWith('/my-subscription'))) {
      return next();
    }
    
    return res.status(403).json({ message: 'Access denied' });
  };
};


exports.checkDoctorSubscription = async (req, res, next) => {
  if (req.user.role.name !== 'doctor') {
    return next();
  }

  const subscription = await DoctorSubscription.findOne({ 
    doctorId: req.user._id, 
    status: 'active',
    endDate: { $gt: new Date() }
  });

  if (!subscription) {
    return res.status(403).json({ message: 'Active subscription required' });
  }

  next();
};