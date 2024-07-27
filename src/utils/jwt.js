const jwt = require ('jsonwebtoken');

exports.generateTokens = (user) => {
  const accessToken = jwt.sign(
    { id: user._id, role: user.role.name },
    process.env.JWT_ACCESS_SECRET,
    { expiresIn: process.env.JWT_ACCESS_EXPIRATION ||'15m' }
  );

  const refreshToken = jwt.sign(
    { id: user._id },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: process.env.JWT_REFRESH_EXPIRATION || '7d' }
  );

  return { accessToken, refreshToken };
};

exports.verifyRefreshToken = (token) => {
    try {
      return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    } catch (error) {
      console.error('Token verification failed:', error.message);
      return null;
    }
  };