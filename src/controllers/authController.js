const User = require('../models/User.js');
const Role = require('../models/Role.js');
const DoctorSubscription = require('../models/DoctorSubscription.js');
const { validateRegistration, validateLogin } = require('../utils/validators/validation.js');
const { generateTokens, verifyRefreshToken } = require('../utils/jwt.js');

const getUserBymail = async (req, res) => {
  try {
    const { email } = req.body;

    // Find the user by email
    const user = await User.findOne({ email }).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Return the user details
    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const register = async (req, res) => {
  try {
    const { error } = validateRegistration(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const { fullname, email, phone, password, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    const userRole = await Role.findOne({ name: role });
    if (!userRole) return res.status(400).json({ message: 'Invalid role' });

    const newUser = new User({
      fullname,
      email,
      phone,
      passwordHash: password,
      role: userRole._id
    });

    await newUser.save();

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: newUser._id,
        fullname: newUser.fullname,
        email: newUser.email,
        phone: newUser.phone,
        role: newUser.role
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

 const login = async (req, res) => {
  try {
    const { error } = validateLogin(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const { email, password } = req.body;

    const user = await User.findOne({ email }).populate('role');
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    if (user.status !== 'active') {
      return res.status(403).json({ message: 'Account is not active' });
    }

    let subscriptionStatus = null;
    if (user.role.name === 'doctor') {
      const subscription = await DoctorSubscription.findOne({ doctorId: user._id, status: 'active' });
      subscriptionStatus = subscription ? 'active' : 'inactive';
    }

    const { accessToken, refreshToken } = generateTokens(user);

    res.json({
      accessToken,
      refreshToken,
      user: {
        id: user._id,
        fullname: user.fullname,
        email: user.email,
        role: user.role.name,
        subscriptionStatus
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const refreshToken = async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) return res.status(400).json({ message: 'Refresh token is required' });

  try {
    const userData = verifyRefreshToken(refreshToken);
    if (!userData) {
      return res.status(401).json({ message: 'Invalid refresh token' });
    }

    const user = await User.findById(userData.id).populate('role');
    if (!user) return res.status(404).json({ message: 'User not found' });

    const { accessToken: newAccessToken, refreshToken: newRefreshToken } = generateTokens(user);

    res.json({ accessToken: newAccessToken, refreshToken: newRefreshToken });
  } catch (error) {
    console.error(error);
    res.status(401).json({ message: 'Invalid refresh token' });
  }
};

 const logout = (req, res) => {
  // In a more advanced implementation, you might want to invalidate the refresh token
  res.json({ message: 'Logged out successfully' });
};

module.exports = { register, login, refreshToken, logout, getUserBymail };