import winston from 'winston';
import 'winston-daily-rotate-file';
import path from 'path';

// Fonction pour redacter les données sensibles
function redactSensitiveData(data) {
  if (typeof data !== 'object' || data === null) {
    return data;
  }

  const sensitiveFields = [
    'password',
    'token',
    'secret',
    'key',
    'authorization',
    'cookie',
    'session',
    'smtp_pass',
    'recaptcha_secret_key'
  ];

  const redacted = { ...data };

  for (const [key, value] of Object.entries(redacted)) {
    if (sensitiveFields.some(field => key.toLowerCase().includes(field))) {
      redacted[key] = '[REDACTED]';
    } else if (typeof value === 'object' && value !== null) {
      redacted[key] = redactSensitiveData(value);
    }
  }

  return redacted;
}

// Configuration des transports
const transports = [
  // Console transport
  new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple()
    ),
  }),
  // Fichier de logs d'erreur avec rotation
  new winston.transports.DailyRotateFile({
    filename: path.join(process.cwd(), 'logs', 'error-%DATE%.log'),
    datePattern: 'YYYY-MM-DD',
    zippedArchive: true,
    maxSize: '20m',
    maxFiles: '14d',
    level: 'error',
  }),
  // Fichier de logs combinés avec rotation
  new winston.transports.DailyRotateFile({
    filename: path.join(process.cwd(), 'logs', 'combined-%DATE%.log'),
    datePattern: 'YYYY-MM-DD',
    zippedArchive: true,
    maxSize: '20m',
    maxFiles: '14d',
  }),
];

// Création du logger
const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json(),
    winston.format((info) => {
      // Redacter les données sensibles avant de logger
      if (info.metadata) {
        info.metadata = redactSensitiveData(info.metadata);
      }
      return info;
    })()
  ),
  defaultMeta: { service: 'au-roi-lion' },
  transports,
});

// Fonction helper pour logger les erreurs
export const logError = (error, context = {}) => {
  logger.error(error.message, {
    error: {
      name: error.name,
      stack: error.stack,
      ...context
    }
  });
};

// Fonction helper pour logger les informations
export const logInfo = (message, metadata = {}) => {
  logger.info(message, { metadata });
};

// Fonction helper pour logger les warnings
export const logWarning = (message, metadata = {}) => {
  logger.warn(message, { metadata });
};

export { logger }; 