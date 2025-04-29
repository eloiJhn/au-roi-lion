const escapeSpecialChars = (str) => {
  if (typeof str !== 'string') return '';
  return str.replace(/[&<>"'`]/g, (match) => {
    const escape = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;',
      '`': '&#x60;'
    };
    return escape[match];
  });
};

/**
 * Validation et assainissement des entrées utilisateur
 * @param {string} input - Entrée à valider
 * @param {number} minLength - Longueur minimale
 * @param {number} maxLength - Longueur maximale
 * @param {RegExp} pattern - Motif regex à utiliser pour la validation
 * @returns {boolean} - True si l'entrée est valide
 */
const validateAndSanitizeInput = (input, minLength, maxLength, pattern = /^[a-zA-Z0-9 .,!?@\-_]+$/) => {
  if (typeof input !== 'string') return false;
  
  const sanitized = escapeSpecialChars(input.trim());
  
  if (sanitized.length < minLength || sanitized.length > maxLength) return false;
  
  return pattern.test(sanitized);
};

/**
 * Validation d'adresse email avec regex avancée
 * Cette regex est conforme à RFC 5322
 */
const validateEmail = (email) => {
  if (typeof email !== 'string') return false;

  const emailPattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  const sanitizedEmail = escapeSpecialChars(email.trim().toLowerCase());
  
  // Vérifier la longueur pour éviter des attaques par DoS (adresses email trop longues)
  if (sanitizedEmail.length > 254) return false;
  
  return emailPattern.test(sanitizedEmail);
};

/**
 * Validation de nom avec prise en charge des accents et caractères internationaux
 */
const validateName = (name) => {
  // Caractères alphanumériques, espaces, apostrophes et accents
  const namePattern = /^[a-zA-ZÀ-ÖØ-öø-ÿ0-9 '.,-]+$/;
  return validateAndSanitizeInput(name, 2, 50, namePattern);
};

/**
 * Validation de message avec permissions plus étendues pour le contenu
 */
const validateMessage = (message) => {
  // Permettre plus de caractères pour le message tout en restant sécurisé
  const messagePattern = /^[a-zA-ZÀ-ÖØ-öø-ÿ0-9 '.,:;!?@#%*+\-_\r\n()[\]]+$/;
  return validateAndSanitizeInput(message, 1, 5000, messagePattern);
};

/**
 * Validation de URL
 */
const validateURL = (url) => {
  if (typeof url !== 'string') return false;
  
  const urlPattern = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;
  const sanitizedUrl = escapeSpecialChars(url.trim());
  
  return urlPattern.test(sanitizedUrl);
};

export { 
  validateEmail, 
  validateName, 
  validateMessage, 
  validateURL,
  escapeSpecialChars 
};