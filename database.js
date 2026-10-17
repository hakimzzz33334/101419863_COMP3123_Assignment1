
const mongoose = require('mongoose');
const logger = require('../utils/logger');

const connectDB = async () => {
  try {
    const connection = await mongoose.connect(process.env.MONGODB_URI);

    logger.info('MongoDB connection established', {
      host: connection.connection.host,
      database: connection.connection.name
    });

    return connection;
  } catch (error) {
    logger.error('MongoDB connection failed', {
      error: error.message
    });

    process.exit(1);
  }
};

module.exports = connectDB;
