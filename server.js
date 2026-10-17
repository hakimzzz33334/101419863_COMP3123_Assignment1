
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const mongoose = require('mongoose');
const rateLimit = require('express-rate-limit');

const connectDB = require('./src/config/database');
const logger = require('./src/utils/logger');
const requestLogger = require('./src/middleware/requestLogger');

const userRoutes = require('./src/routes/userRoutes');
const employeeRoutes = require('./src/routes/employeeRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

app.disable('x-powered-by');

app.use(helmet());
app.use(cors());
app.use(requestLogger);

app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: false }));

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests. Please try again later.'
  }
});

app.use('/api', apiLimiter);

app.use('/api/v1/user', userRoutes);
app.use('/api/v1/emp', employeeRoutes);

app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'COMP3123 Assignment 1 API is running',
    timestamp: new Date().toISOString(),
    database:
      mongoose.connection.readyState === 1
        ? 'connected'
        : 'disconnected'
  });
});

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'API endpoint not found'
  });
});

app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({
      success: false,
      message: 'Invalid JSON request body'
    });
  }

  if (err.code === 11000) {
    return res.status(409).json({
      success: false,
      message: 'A record with this information already exists'
    });
  }

  if (err.name === 'ValidationError' || err.name === 'CastError') {
    return res.status(400).json({
      success: false,
      message: 'Invalid request data'
    });
  }

  logger.error('Unhandled application error', {
    method: req.method,
    path: req.path,
    error: err.message
  });

  return res.status(500).json({
    success: false,
    message: 'Internal server error'
  });
});

const startServer = async () => {
  if (!process.env.MONGODB_URI || !process.env.JWT_SECRET) {
    logger.error('Required environment variables are missing');
    process.exit(1);
  }

  await connectDB();

  app.listen(PORT, () => {
    logger.info('Server started successfully', {
      port: PORT,
      environment: process.env.NODE_ENV || 'development'
    });
  });
};

startServer();
