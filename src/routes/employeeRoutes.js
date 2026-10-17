
const express = require('express');

const protect = require('../middleware/authMiddleware');

const {
  getEmployees,
  createEmployee,
  getEmployeeById,
  updateEmployee,
  deleteEmployee
} = require('../controllers/employeeController');

const {
  validateEmployee,
  validateEmployeeId,
  validateDeleteId,
  handleEmployeeValidation
} = require('../validators/employeeValidator');

const router = express.Router();

router.use(protect);

router.route('/employees')
  .get(getEmployees)
  .post(
    validateEmployee,
    handleEmployeeValidation,
    createEmployee
  )
  .delete(
    validateDeleteId,
    handleEmployeeValidation,
    deleteEmployee
  );

router.route('/employees/:eid')
  .get(
    validateEmployeeId,
    handleEmployeeValidation,
    getEmployeeById
  )
  .put(
    validateEmployeeId,
    validateEmployee,
    handleEmployeeValidation,
    updateEmployee
  );

module.exports = router;
