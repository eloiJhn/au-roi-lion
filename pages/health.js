import { logger } from '../src/utils/logger';

// Page simple qui ne nécessite pas d'authentification
export default function Health() {
  // Journaliser l'accès
  logger.info('Health check page accessed');
  
  // Renvoyer un élément HTML minimal avec une indication de santé
  return (
    <div className="health-check">
      <h1>Service is healthy</h1>
      <p>Timestamp: {new Date().toISOString()}</p>
      <p>Uptime: {process.uptime()} seconds</p>
      <style jsx>{`
        .health-check {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100vh;
          font-family: sans-serif;
        }
        h1 {
          color: #0070f3;
        }
      `}</style>
    </div>
  );
}

// Cette fonction s'exécute côté serveur et permet de définir des headers ou des propriétés spéciales
export async function getServerSideProps({ res }) {
  try {
    // Définir les en-têtes pour éviter la mise en cache
    res.setHeader('Cache-Control', 'no-store, max-age=0');
    
    // Journaliser le succès
    logger.info('Health check completed successfully');
    
    // Retourner un statut normal
    return {
      props: {}
    };
  } catch (error) {
    // Journaliser l'erreur
    logger.error('Health check failed', { error: error.message });
    
    // En cas d'erreur, on peut toujours retourner un code 200 pour la page
    // mais avec des détails d'erreur dans les props
    return {
      props: {
        error: true,
        message: error.message
      }
    };
  }
} 