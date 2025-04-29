import { NextResponse } from "next/server";
import { rateLimit } from "../../utils/rateLimiter";
import { logger } from "../../utils/logger";
import { headers } from "next/headers";

const limiter = rateLimit({
  interval: 60 * 1000,
  uniqueTokenPerInterval: 500,
});

// Utiliser un LRU Cache avec une limite de taille pour éviter les fuites de mémoire
class LRUCache {
  constructor(maxSize = 100) {
    this.cache = new Map();
    this.maxSize = maxSize;
  }

  get(key) {
    if (!this.cache.has(key)) return undefined;
    
    const item = this.cache.get(key);
    // Vérifier si l'élément est expiré
    if (item.expiry < Date.now()) {
      this.cache.delete(key);
      return undefined;
    }
    
    // Mettre à jour l'élément pour qu'il soit considéré comme récemment utilisé
    this.cache.delete(key);
    this.cache.set(key, item);
    return item.value;
  }

  set(key, value, ttl) {
    // Supprimer les anciens éléments si la taille max est atteinte
    if (this.cache.size >= this.maxSize) {
      const oldestKey = this.cache.keys().next().value;
      this.cache.delete(oldestKey);
    }
    
    this.cache.set(key, {
      value,
      expiry: Date.now() + ttl
    });
  }
}

// Cache limité pour les tokens validés
const tokenCache = new LRUCache(500);
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export async function POST(request) {
  try {
    // Vérifier que la requête provient d'une source légitime
    const requestedWith = request.headers.get('x-requested-with') ?? '';
    
    if (requestedWith !== 'XMLHttpRequest' && process.env.NODE_ENV === 'production') {
      logger.warn("Invalid request type blocked");
      return jsonResponse({ success: false, error: "Invalid request type" }, 400);
    }

    const body = await request.json();
    const { token } = body;

    if (!token) {
      return jsonResponse({ success: false, error: "Token is missing" }, 400);
    }

    // Vérification rapide du cache
    const cachedResult = tokenCache.get(token);
    if (cachedResult) {
      return jsonResponse({ 
        success: true, 
        score: cachedResult.score, 
        action: cachedResult.action 
      });
    }

    // En mode développement uniquement, accepter les tokens sans vérification si la clé n'est pas configurée
    if (process.env.NODE_ENV === 'development' && !process.env.RECAPTCHA_SECRET_KEY) {
      logger.warn("Dev mode: Bypassing reCAPTCHA verification due to missing secret key");
      const devResult = {
        success: true,
        score: 0.9,
        action: 'contact'
      };
      
      tokenCache.set(token, devResult, CACHE_TTL);
      return jsonResponse(devResult);
    }

    // Vérification complète pour tous les tokens
    const verificationResult = await verifyRecaptcha(token);
    
    if (verificationResult.success) {
      // Mise en cache uniquement si le score est suffisant
      if (verificationResult.score >= 0.5) {
        tokenCache.set(token, {
          score: verificationResult.score,
          action: verificationResult.action
        }, CACHE_TTL);
      }

      return jsonResponse({ 
        success: true,
        score: verificationResult.score,
        action: verificationResult.action
      });
    }

    return jsonResponse({ 
      success: false, 
      error: "Invalid reCAPTCHA"
    }, 400);
  } catch (error) {
    return handleError(error);
  }
}

async function verifyRecaptcha(token) {
  const secretKey = process.env.RECAPTCHA_SECRET_KEY;
  if (!secretKey) {
    logger.warn("RECAPTCHA_SECRET_KEY is not set");
    // En mode développement, on accepte les tokens sans vérification
    if (process.env.NODE_ENV === 'development') {
      return {
        success: true,
        score: 0.9,
        action: 'contact'
      };
    }
    throw new Error("Server configuration error");
  }

  const verificationURL = "https://www.google.com/recaptcha/api/siteverify";
  
  try {
    const response = await fetch(verificationURL, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `secret=${secretKey}&response=${token}`,
      signal: AbortSignal.timeout(5000)
    });

    if (!response.ok) {
      throw new Error(`Failed to verify reCAPTCHA: ${response.status}`);
    }

    const result = await response.json();

    // Vérifier le score minimal
    if (result.success && result.score < 0.3) {
      logger.warn("reCAPTCHA score too low", { score: result.score });
      result.success = false;
    }

    return result;
  } catch (error) {
    logger.error("Error during reCAPTCHA verification", { 
      error: error.message, 
      stack: error.stack 
    });

    // Uniquement en développement et en cas d'erreur réseau
    if (process.env.NODE_ENV === 'development' && (error.name === 'AbortError' || error.message.includes('fetch failed'))) {
      logger.warn("Dev mode: Bypassing reCAPTCHA verification due to network error");
      return {
        success: true,
        score: 0.7,
        action: 'contact'
      };
    }
    throw error;
  }
}

function jsonResponse(body, status = 200) {
  return NextResponse.json(body, { status });
}

function handleError(error) {
  const status = error.message === "Token is missing" ? 400 : 500;
  logger.error("Error during reCAPTCHA verification", { error: error.message });
  
  // En production, ne pas exposer les détails de l'erreur
  const errorMessage = process.env.NODE_ENV === 'production' 
    ? "Échec de la vérification de sécurité" 
    : error.message;
    
  return jsonResponse({ success: false, error: errorMessage }, status);
}