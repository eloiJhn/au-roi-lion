import { logger } from './logger';

export const analyzeContent = (content) => {
  logger.info('Analyzing content for spam');
  
  // Liste de mots-clés souvent associés au spam
  const spamKeywords = ['buy now', 'click here', 'limited offer', 'viagra', 'casino'];
  
  // Convertir le contenu en minuscules pour une comparaison insensible à la casse
  const lowerContent = content.toLowerCase();
  
  // Vérifier si l'un des mots-clés de spam est présent dans le contenu
  for (const keyword of spamKeywords) {
    if (lowerContent.includes(keyword)) {
      logger.warn(`Spam keyword detected: ${keyword}`);
      return 'spam';
    }
  }
  
  return 'ham'; // 'ham' est un terme couramment utilisé pour désigner un contenu non-spam
};