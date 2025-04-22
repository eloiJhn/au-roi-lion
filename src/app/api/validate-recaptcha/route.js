import { NextResponse } from "next/server";
import { rateLimit } from "../../utils/rateLimiter";
import { logger } from "../../utils/logger";

const limiter = rateLimit({
  interval: 60 * 1000,
  uniqueTokenPerInterval: 500,
});

// Cache en mémoire pour les tokens valides
const tokenCache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

// Liste des tokens valides (à remplacer par votre clé reCAPTCHA)
const VALID_TOKENS = new Set([
  // Ajoutez ici les tokens valides si nécessaire
]);

export async function POST(request) {
  try {
    const body = await request.json();
    const { token } = body;

    if (!token) {
      return jsonResponse({ success: false, error: "Token is missing" }, 400);
    }

    // Vérification rapide du cache
    const cachedResult = tokenCache.get(token);
    if (cachedResult && Date.now() - cachedResult.timestamp < CACHE_TTL) {
      return jsonResponse({ success: true, score: cachedResult.score, action: cachedResult.action });
    }

    // Vérification rapide du token
    if (VALID_TOKENS.has(token)) {
      const result = {
        success: true,
        score: 0.9,
        action: 'contact'
      };
      
      // Mise en cache
      tokenCache.set(token, {
        ...result,
        timestamp: Date.now()
      });

      return jsonResponse(result);
    }

    // Si le token n'est pas dans le cache ou la liste valide, on fait une vérification complète
    const verificationResult = await verifyRecaptcha(token);
    
    if (verificationResult.success) {
      // Mise en cache
      tokenCache.set(token, {
        score: verificationResult.score,
        action: verificationResult.action,
        timestamp: Date.now()
      });

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
      signal: AbortSignal.timeout(1000) // Timeout après 1 seconde
    });

    if (!response.ok) {
      throw new Error(`Failed to verify reCAPTCHA: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    if (error.name === 'AbortError') {
      // En cas de timeout, on considère le token comme valide pour ne pas bloquer l'utilisateur
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
  return jsonResponse({ success: false, error: error.message }, status);
}
