
const { body, param, query, validationResult } = require('express-validator');

const employeeFields = [
  body('first_name')
    .isString()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('First name must contain 2-50 characters'),

  body('last_name')
    .isString()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Last name must contain 2-50 characters'),

  body('email')
    .isEmail()
    .withMessage('A valid employee email is required')
    .normalizeEmail(),

  body('position')
    .isString()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Position must contain 2-100 characters'),

  body('salary')
    .isFloat({ min: 0.01 })
    .withMessage('Salary must be a positive number')
    .toFloat(),

  body('date_of_joining')
    .isISO8601({ strict: true, strictSeparator: true })
    .withMessage('Date of joining must be a valid ISO 8601 date'),

  body('department')
    .isString()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Department must contain 2-100 characters')
];

const validateEmployee = [
  body().custom((value) => {
    const allowed = [
      'first_name',
      'last_name',
      'email',
      'position',
      'salary',
      'date_of_joining',
      'department'
    ];

    if (!value || typeof value !== 'object' || Array.isArray(value)) {
      throw new Error('A JSON object is required');
    }

    const unexpected = Object.keys(value).filter(
      (key) => !allowed.includes(key)
    );

    if (unexpected.length > 0) {
      throw new Error(`Unexpected fields: ${unexpected.join(', ')}`);
    }

    return true;
  }),
  ...employeeFields
];

const validateEmployeeId = [
  param('eid')
    .isMongoId()
    .withMessage('A valid employee ID is required')
];

const validateDeleteId = [
  query('eid')
    .isMongoId()
    .withMessage('A valid employee ID is required')
];

const handleEmployeeValidation = (req, res, next) => {
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
  validateEmployee,
  validateEmployeeId,
  validateDeleteId,
  handleEmployeeValidation
};
