import { logger } from './logger';

export const analyzeContent = (content) => {
  logger.info('Analyzing content for spam');
  
  const spamKeywords = ['buy now', 'click here', 'limited offer', 'viagra', 'casino', 'achetez maintenant', 'offre limitée', 'exclusif'];
  
  const lowerContent = content.toLowerCase();
  
  for (const keyword of spamKeywords) {
    if (lowerContent.includes(keyword)) {
      logger.warn(`Spam keyword detected: ${keyword}`);
      return 'spam';
    }
  }
  
  return 'ham'; 
};