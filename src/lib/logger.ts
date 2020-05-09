import winston from 'winston';

const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'development' ? 'debug' : 'warn',
  format: winston.format.json(),
  defaultMeta: { service: 'squadref' },
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(),
    }),
  ]
});

export default logger;
