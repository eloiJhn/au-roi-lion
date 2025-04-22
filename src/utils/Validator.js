import { AppError } from './errorHandler';

// Expressions régulières pour la validation
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const NAME_REGEX = /^[a-zA-ZÀ-ÿ\s-]{2,50}$/;
const MESSAGE_REGEX = /^[\s\S]{10,5000}$/;

export function validateEmail(email) {
  if (!email || typeof email !== 'string') {
    throw new AppError('Email invalide', 400);
  }
  return EMAIL_REGEX.test(email.trim());
}

export function validateName(name) {
  if (!name || typeof name !== 'string') {
    throw new AppError('Nom invalide', 400);
  }
  return NAME_REGEX.test(name.trim());
}

export function validateMessage(message) {
  if (!message || typeof message !== 'string') {
    throw new AppError('Message invalide', 400);
  }
  return MESSAGE_REGEX.test(message.trim());
}

export const validationSchema = {
  email: validateEmail,
  name: validateName,
  message: validateMessage
};

export function validateContactForm(data) {
  const errors = [];
  
  if (!data.email || !validateEmail(data.email)) {
    errors.push('Email invalide');
  }
  
  if (!data.name || !validateName(data.name)) {
    errors.push('Nom invalide');
  }
  
  if (!data.message || !validateMessage(data.message)) {
    errors.push('Message invalide');
  }
  
  if (errors.length > 0) {
    throw new AppError('Validation error', 400, { errors });
  }
  
  return true;
} 