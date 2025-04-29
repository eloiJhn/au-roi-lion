import nodemailer from 'nodemailer';
import { analyzeContent } from '../../utils/contentAnalyzer';
import { logger } from '../../utils/logger';
import { rateLimit } from '../../utils/rateLimiter';
import { validateEmail, validateName, validateMessage } from '../../utils/Validator';
import { NextResponse } from 'next/server';

// Création d'un pool de connexions SMTP optimisé
const transporter = nodemailer.createTransport({
  pool: true,
  host: process.env.SMTP_HOST || "smtp-relay.brevo.com",
  port: process.env.SMTP_PORT || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  maxConnections: 5,
  maxMessages: 100,
  rateDelta: 1000,
  rateLimit: 3,
  socketTimeout: 5000,
  connectionTimeout: 5000,
  greetingTimeout: 5000,
  dnsTimeout: 5000,
  debug: false,
  logger: false
});

// Pré-établir les connexions
transporter.verify().catch(err => {
  logger.error("SMTP connection verification failed", { error: err.message });
});

const limiter = rateLimit({
  uniqueTokenPerInterval: 500,
  interval: 60000,
});

// Fonction d'échappement HTML optimisée
function escapeHtml(unsafe) {
  if (typeof unsafe !== 'string') return '';
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// Validation de la longueur du message
function validateMessageLength(message) {
  const MAX_MESSAGE_LENGTH = 5000;
  return message.length <= MAX_MESSAGE_LENGTH;
}

export async function POST(request) {
  try {
    // En développement, ignorer les vérifications d'origine
    if (process.env.NODE_ENV !== 'development') {
      // Utilisation de request.headers de manière synchrone
      const referer = request.headers.get('referer') ?? '';
      const origin = request.headers.get('origin') ?? '';
      const requestedWith = request.headers.get('x-requested-with') ?? '';
      
      // Vérifier l'en-tête X-Requested-With
      if (requestedWith !== 'XMLHttpRequest') {
        logger.warn("Invalid request type blocked");
        return new Response(JSON.stringify({ message: "Invalid request type" }), { status: 400 });
      }
      
      // Liste des origines autorisées
      const allowedOrigins = [
        'https://au-roi-lion.vercel.app',
        'https://www.auroilion.com',
        'https://auroilion.com'
      ];
      
      // Vérifier l'origine de la requête
      const isAllowedOrigin = allowedOrigins.some(allowed => 
        origin.startsWith(allowed) || referer.startsWith(allowed)
      );
      
      if (!isAllowedOrigin) {
        logger.warn("Invalid origin request blocked");
        return new Response(JSON.stringify({ message: "Unauthorized origin" }), { status: 403 });
      }
    }

    // Récupérer le token Bearer
    let token = request.headers.get('Authorization');
    if (token && token.startsWith('Bearer ')) {
      token = token.slice(7);
    } else {
      return new Response(JSON.stringify({ message: "Authorization token required" }), { status: 401 });
    }

    // Appliquer la limitation de débit
    await limiter.check(request, 5, token);

    const body = await request.json();
    const { from_name, reply_to, message } = body;

    // Validation des champs requis
    if (!from_name || !reply_to || !message) {
      return new Response(JSON.stringify({ message: "Champs requis manquants" }), { status: 400 });
    }

    // Validation complète des entrées
    if (!validateEmail(reply_to)) {
      return new Response(JSON.stringify({ message: "Adresse email invalide" }), { status: 400 });
    }
    if (!validateName(from_name)) {
      return new Response(JSON.stringify({ message: "Nom invalide" }), { status: 400 });
    }
    if (!validateMessage(message)) {
      return new Response(JSON.stringify({ message: "Message invalide" }), { status: 400 });
    }
    if (!validateMessageLength(message)) {
      return new Response(JSON.stringify({ message: "Le message est trop long" }), { status: 400 });
    }

    // Vérification de spam en parallèle avec la préparation de l'email
    const [spamCheck, escapedMessage, escapedName, escapedEmail] = await Promise.all([
      analyzeContent(message),
      Promise.resolve(escapeHtml(message)),
      Promise.resolve(escapeHtml(from_name)),
      Promise.resolve(escapeHtml(reply_to))
    ]);

    if (spamCheck === 'spam') {
      logger.warn("Spam content detected", { email: escapedEmail });
      return new Response(JSON.stringify({ message: "Le contenu est détecté comme spam" }), { status: 400 });
    }

    try {
      const response = await sendEmailWithNodemailer(escapedEmail, escapedName, escapedMessage);
      return new Response(JSON.stringify({ message: "Email envoyé avec succès" }), { status: 200 });
    } catch (error) {
      logger.error("POST - Échec de l'envoi de l'email", { error: error.message });
      return new Response(JSON.stringify({ message: "Échec de l'envoi de l'email" }), { status: 500 });
    }
  } catch (error) {
    if (error.message === 'Too Many Requests') {
      return new Response(JSON.stringify({ message: "Trop de requêtes" }), { status: 429 });
    }
    logger.error("POST - Erreur", { error: error.message });
    return new Response(JSON.stringify({ message: "Erreur interne" }), { status: 500 });
  }
}

async function sendEmailWithNodemailer(reply_to, from_name, message) {
  const toEmail = process.env.TO_EMAIL;
  const fromEmail = process.env.FROM_EMAIL;

  if (!toEmail) {
    throw new Error("L'adresse email de destination est requise");
  }

  try {
    const mailOptions = {
      from: `\"Le Roi Lion\" <${fromEmail || toEmail}>`,
      to: toEmail,
      replyTo: reply_to,
      subject: `Nouveau message de ${from_name}`,
      text: `Nouveau message de ${from_name} (${reply_to}):\n\n${message}\n\n—\nEnvoyé via le formulaire de contact de Au Roi Lion`,      
      html: `
        <html><body>
          <p><strong>Message de:</strong> ${from_name}</p>
          <p><strong>Email de contact:</strong> ${reply_to}</p>
          <hr>
          <p>${message.replace(/\n/g, '<br>')}</p>
        </body></html>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    return { messageId: info.messageId };
  } catch (error) {
    logger.error("Erreur lors de l'envoi", { error: error.message });
    throw error;
  }
}
