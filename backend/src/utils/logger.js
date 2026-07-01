import winston from 'winston';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const { combine, timestamp, printf, colorize, simple } = winston.format;

const logDir = path.join(__dirname, '../../logs');

const myFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp} [${level}]: ${message}`;
});

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: combine(
    timestamp(),
    myFormat
  ),
  transports: [],
});

if (process.env.NODE_ENV === 'production') {
  logger.add(
    new winston.transports.File({
      filename: path.join(logDir, 'error.log'),
      level: 'error',
    })
  );
  logger.add(
    new winston.transports.File({
      filename: path.join(logDir, 'combined.log'),
    })
  );
} else {
  logger.add(
    new winston.transports.Console({
      format: combine(
        colorize(),
        simple()
      ),
    })
  );
}

export default logger;