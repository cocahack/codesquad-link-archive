import * as winston from 'winston';

const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'development' ? 'debug' : 'warn',
  defaultMeta: { service: 'squadref' },
});

logger.add(new winston.transports.Console());

export default logger;
