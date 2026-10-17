
const express = require('express');
const rateLimit = require('express-rate-limit');

const {
  signup,
  login
} = require('../controllers/userController');

const {
  validateSignup,
  validateLogin,
  handleValidation
} = require('../validators/userValidator');

const router = express.Router();

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many authentication attempts. Please try again later.'
  }
});

router.post(
  '/signup',
  authLimiter,
  validateSignup,
  handleValidation,
  signup
);

router.post(
  '/login',
  authLimiter,
  validateLogin,
  handleValidation,
  login
);

module.exports = router;
