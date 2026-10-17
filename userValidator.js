
const { body, validationResult } = require('express-validator');

const validateSignup = [
  body('username')
    .isString()
    .trim()
    .isLength({ min: 3, max: 30 })
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Username must be 3-30 characters and contain only letters, numbers or underscores'),

  body('email')
    .isEmail()
    .withMessage('A valid email address is required')
    .normalizeEmail(),

  body('password')
    .isString()
    .isLength({ min: 8, max: 72 })
    .withMessage('Password must contain between 8 and 72 characters')
    .matches(/[A-Z]/)
    .withMessage('Password must contain an uppercase letter')
    .matches(/[a-z]/)
    .withMessage('Password must contain a lowercase letter')
    .matches(/[0-9]/)
    .withMessage('Password must contain a number')
];

const validateLogin = [
  body('password')
    .isString()
    .notEmpty()
    .withMessage('Password is required'),

  body().custom((value) => {
    if (!value.username && !value.email) {
      throw new Error('Username or email is required');
    }

    return true;
  })
];

const handleValidation = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map((error) => ({
        field: error.path,
        message: error.msg
      }))
    });
  }

  next();
};

module.exports = {
  validateSignup,
  validateLogin,
  handleValidation
};
