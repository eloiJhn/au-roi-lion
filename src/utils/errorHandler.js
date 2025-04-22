import { logger } from './logger';

export class AppError extends Error {
  constructor(message, statusCode = 500, details = {}) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

export function handleError(error) {
  // Log l'erreur
  logger.error('Error occurred', {
    error: {
      message: error.message,
      name: error.name,
      stack: error.stack,
      details: error.details,
      statusCode: error.statusCode
    }
  });

  // Si c'est une AppError, retourner la réponse appropriée
  if (error instanceof AppError) {
    return {
      success: false,
      error: error.message,
      details: error.details,
      statusCode: error.statusCode
    };
  }

  // Pour les autres erreurs, retourner une réponse générique
  return {
    success: false,
    error: 'Une erreur interne est survenue',
    statusCode: 500
  };
}

export function validateInput(data, schema) {
  const errors = [];
  
  for (const [key, validator] of Object.entries(schema)) {
    if (!validator(data[key])) {
      errors.push(`${key} est invalide`);
    }
  }

  if (errors.length > 0) {
    throw new AppError('Validation error', 400, { errors });
  }

  return true;
}

export function sanitizeInput(input) {
  if (typeof input === 'string') {
    return input
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/<[^>]+>/g, '')
      .trim();
  }
  return input;
} 