import fetch from "node-fetch";
import { analyzeContent } from '../../utils/contentAnalyzer';
import { logger } from '../../utils/logger';
import { rateLimit } from '../../utils/rateLimiter';
import { validateEmail, validateName, validateMessage } from '../../utils/Validator';

const limiter = rateLimit({
  uniqueTokenPerInterval: 500,
  interval: 60000,
});

export async function POST(request) {
  try {
    let token = request.headers.get('Authorization');
    if (token && token.startsWith('Bearer ')) {
      token = token.slice(7);
    }

    logger.info("POST - Authorization token", { token });
    logger.info("POST - Request Headers", { headers: request.headers });

    await limiter.check(request, 5, token);

    const body = await request.json();
    const { from_name, reply_to, message } = body;

    logger.info("POST - Données reçues", { from_name, reply_to, message });

    if (!from_name || !reply_to || !message) {
      logger.error("POST - Champs requis manquants", { from_name, reply_to, message });
      return new Response(JSON.stringify({ message: "Champs requis manquants" }), { status: 400 });
    }

    if (!validateEmail(reply_to)) {
      logger.error("POST - Adresse email invalide", { reply_to });
      return new Response(JSON.stringify({ message: "Adresse email invalide" }), { status: 400 });
    }
    if (!validateName(from_name)) {
      logger.error("POST - Nom invalide", { from_name });
      return new Response(JSON.stringify({ message: "Nom invalide" }), { status: 400 });
    }
    if (!validateMessage(message)) {
      logger.error("POST - Message invalide", { message });
      return new Response(JSON.stringify({ message: "Message invalide" }), { status: 400 });
    }

    const spamCheck = analyzeContent(message);
    logger.info("POST - Analyse de contenu pour spam", { spamCheck });

    if (spamCheck === 'spam') {
      logger.warn("POST - Contenu détecté comme spam", { message });
      return new Response(JSON.stringify({ message: "Le contenu est détecté comme spam" }), { status: 400 });
    }

    try {
      const response = await sendEmail(reply_to, from_name, message);
      logger.info("POST - Réponse de sendEmail", { status: response.status });
      return new Response(JSON.stringify({ message: "Email envoyé avec succès" }), { status: 200 });
    } catch (error) {
      logger.error("POST - Échec de l'envoi de l'email", { error: error.message });
      return new Response(JSON.stringify({ message: "Échec de l'envoi de l'email", error: error.message }), { status: 500 });
    }
  } catch (error) {
    if (error.message === 'Too Many Requests') {
      logger.warn("POST - Limite de requêtes dépassée", { error: error.message });
      return new Response(JSON.stringify({ message: "Trop de requêtes" }), { status: 429 });
    }
    logger.error("POST - Erreur inconnue", { error: error.message });
    return new Response(JSON.stringify({ message: "Erreur interne", error: error.message }), { status: 500 });
  }
}

async function sendEmail(reply_to, from_name, message) {
  const apiKey = process.env.SENDGRID_API_KEY;
  const fromEmail = process.env.FROM_EMAIL;

  if (!apiKey || !fromEmail) {
    logger.error("sendEmail - Variables d'environnement manquantes", { apiKey, fromEmail });
    throw new Error("Les variables d'environnement SENDGRID_API_KEY et FROM_EMAIL sont requises");
  }

  logger.info("sendEmail - Initialisation", { apiKey, fromEmail });
  logger.info("sendEmail - Paramètres d'envoi", { reply_to, from_name, message });

  const response = await fetch("https://api.sendgrid.com/v3/mail/send", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      personalizations: [
        {
          to: [{ email: reply_to }],
          subject: `Message de ${from_name}`,
        },
      ],
      from: { email: fromEmail },
      reply_to: { email: reply_to },
      content: [      
        { type: "text/plain", value: message },
        { type: "text/html", value: `<html><body><p>${message}</p></body></html>` },
      ],
    }),
  });

  logger.info("sendEmail - Réponse HTTP de SendGrid", { status: response.status });

  if (!response.ok) {
    const errorDetails = await response.json();
    logger.error("sendEmail - Erreur lors de l'envoi", { status: response.status, errorDetails });
    throw new Error(`Failed to send email: ${errorDetails.errors?.[0]?.message || response.statusText}`);
  }

  return response;
}
