
const logger = require('../utils/logger');

const requestLogger = (req, res, next) => {
  const startedAt = process.hrtime.bigint();

  res.on('finish', () => {
    const duration = Number(
      process.hrtime.bigint() - startedAt
    ) / 1000000;

    const details = {
      method: req.method,
      path: req.path,
      status: res.statusCode,
      duration_ms: Number(duration.toFixed(2)),
      user_id: req.user?._id?.toString() || null
    };

    if (res.statusCode >= 500) {
      logger.error('HTTP request failed', details);
    } else if (res.statusCode === 401 || res.statusCode === 403) {
      logger.warn('Authentication or authorization failure', details);
    } else if (res.statusCode === 400 || res.statusCode === 422) {
      logger.warn('Request validation failure', details);
    } else if (res.statusCode === 429) {
      logger.warn('Rate limit exceeded', details);
    } else {
      logger.info('HTTP request completed', details);
    }
  });

  next();
};

module.exports = requestLogger;
