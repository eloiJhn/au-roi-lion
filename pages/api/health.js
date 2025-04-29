import { logger } from '@/utils/logger';

export default function handler(req, res) {
  try {
    
    // Journal de l'état de santé
    logger.info('Health check completed successfully');
    
    // Retourner un statut OK
    res.status(200).json({ 
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime()
    });
  } catch (error) {
    // Journal des erreurs
    logger.error('Health check failed', { error: error.message });
    
    // Retourner un statut d'erreur
    res.status(500).json({ 
      status: 'unhealthy',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
} 