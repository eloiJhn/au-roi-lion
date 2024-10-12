const escapeSpecialChars = (str) => {
    return str.replace(/[&<>"']/g, (match) => {
      const escape = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
      };
      return escape[match];
    });
  };
  
  const validateAndSanitizeInput = (input, minLength, maxLength) => {
    if (typeof input !== 'string') return false;
    
    const sanitized = escapeSpecialChars(input.trim());
    
    if (sanitized.length < minLength || sanitized.length > maxLength) return false;
    
    // Liste blanche de caractères autorisés
    const allowedChars = /^[a-zA-Z0-9 .,!?@-]+$/;
    return allowedChars.test(sanitized);
  };
  
  const validateEmail = (email) => {
    const re = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    return re.test(String(email).toLowerCase());
  };
  
  const validateName = (name) => validateAndSanitizeInput(name, 2, 50);
  const validateMessage = (message) => validateAndSanitizeInput(message, 1, 5000);
  
  export { validateEmail, validateName, validateMessage, escapeSpecialChars };