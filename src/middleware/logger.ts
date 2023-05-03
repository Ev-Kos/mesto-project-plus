import winston from 'winston';
import expressWinston from 'express-winston';
import 'winston-daily-rotate-file';

export const transport = new winston.transports.DailyRotateFile({
  filename: 'logs/error-%DATE%.log',
  datePattern: 'YYYY-MM-DD-HH',
  maxSize: '20m',
  maxFiles: 14,
});

export const requestLogger = expressWinston.logger({
  transports: [
    new winston.transports.Console({
      format: winston.format.simple(),
    }),
    new winston.transports.File({
      filename: 'request.log',
    }),
  ],
  format: winston.format.json(),
});

export const errorLogger = expressWinston.errorLogger({
  transports: [
    transport,
    new winston.transports.File({ filename: 'error.log' }),
  ],
  format: winston.format.json(),
});
