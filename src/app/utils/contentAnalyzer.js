import { logger } from './logger';

/**
 * Analyse le contenu du message pour détecter du spam
 * @param {string} content - Contenu à analyser
 * @returns {string} - 'spam' ou 'ham'
 */
export const analyzeContent = (content) => {
  if (typeof content !== 'string') {
    logger.warn('Invalid content type for spam analysis');
    return 'spam';
  }

  logger.info('Analyzing content for spam');
  
  // Liste de mots-clés de spam plus complète
  const spamKeywords = [
    // Mots-clés généraux en anglais
    'buy now', 'click here', 'limited offer', 'viagra', 'casino', 'free money', 
    'earn money', 'make money fast', 'lottery', 'winner', 'prize', 'discount',
    'free access', 'free consultation', 'limited time', 'special promotion',
    'cheap', 'best price', 'investment opportunity', 'no fee', 'no cost',
    'get rich', 'easy cash', 'online pharmacy', 'medication without prescription',
    
    // Mots-clés en français
    'achetez maintenant', 'offre limitée', 'exclusif', 'gagnez de l\'argent',
    'argent facile', 'loto', 'gagnant', 'prix', 'réduction', 'consultation gratuite',
    'temps limité', 'promotion spéciale', 'pas cher', 'meilleur prix',
    'opportunité d\'investissement', 'sans frais', 'sans coût',
    'devenir riche', 'argent facile', 'pharmacie en ligne', 'médicament sans ordonnance'
  ];
  
  // Expressions régulières pour des motifs de spam courants
  const spamPatterns = [
    /\b\d{5,}\b/g,                      // Longues séquences de chiffres
    /https?:\/\/\S+/g,                 // URLs (suspicieux dans un premier contact)
    /[A-Z]{5,}/g,                      // MAJUSCULES (CRIER)
    /\$\d+/g,                          // Montants d'argent ($100)
    /\b(bitcoin|btc|crypto|ethereum|eth)\b/gi,  // Cryptomonnaies
    /\b(password|login|username|email|account).{0,20}(reset|verify|confirm|update)/gi, // Phishing
    /\b(casino|bet|gambling|poker|slots)\b/gi,  // Jeux d'argent
    /[!?]{3,}/g,                       // Ponctuation excessive (!!!)
    /cialis|viagra|enlarge|pill/gi     // Médicaments couramment spammés
  ];
  
  // Convertir le contenu en minuscules pour la recherche
  const lowerContent = content.toLowerCase();
  
  // Vérification des mots-clés de spam
  for (const keyword of spamKeywords) {
    if (lowerContent.includes(keyword)) {
      logger.warn(`Spam keyword detected: ${keyword}`);
      return 'spam';
    }
  }
  
  // Calculer un score de spam basé sur des patterns
  let spamScore = 0;
  
  // Vérifier les motifs de spam
  for (const pattern of spamPatterns) {
    const matches = content.match(pattern);
    if (matches) {
      spamScore += matches.length * 2;
      logger.info(`Spam pattern detected: ${pattern}, matches: ${matches.length}`);
    }
  }
  
  // Vérifier le ratio de mots/caractères (texte sans sens)
  const words = content.split(/\s+/).filter(word => word.length > 0);
  const wordCount = words.length;
  const charCount = content.length;
  
  if (wordCount > 0) {
    const avgWordLength = charCount / wordCount;
    
    // Mots anormalement longs
    if (avgWordLength > 15) {
      spamScore += 5;
      logger.info(`High average word length: ${avgWordLength}`);
    }
    
    // Mots répétitifs
    const uniqueWords = new Set(words);
    const repetitionRatio = uniqueWords.size / wordCount;
    
    if (repetitionRatio < 0.3 && wordCount > 10) {
      spamScore += 3;
      logger.info(`High word repetition detected: ${repetitionRatio}`);
    }
  }
  
  // Trop de lignes avec juste un ou deux mots
  const lines = content.split('\n');
  const shortLines = lines.filter(line => {
    const lineWords = line.trim().split(/\s+/).filter(w => w.length > 0);
    return lineWords.length > 0 && lineWords.length <= 2;
  });
  
  if (lines.length > 5 && shortLines.length / lines.length > 0.7) {
    spamScore += 3;
    logger.info('Too many short lines detected');
  }

  // Déterminer si c'est du spam en fonction du score final
  const isSpam = spamScore >= 5;
  
  if (isSpam) {
    logger.warn(`Content classified as spam with score: ${spamScore}`);
    return 'spam';
  }
  
  return 'ham';
};