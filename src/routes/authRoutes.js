const express = require("express");
const { register, login, refreshToken, logout } = require('../controllers/authController.js');
const { rateLimiter }  =  require('../middleware/rateLimiter.js');

const router = express.Router();

router.post('/register', rateLimiter, register);
router.post('/login', rateLimiter, login);
router.post('/refresh-token', refreshToken);
router.post('/logout', logout);

module.exports = router;