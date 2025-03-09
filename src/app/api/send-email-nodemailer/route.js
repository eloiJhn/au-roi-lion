import nodemailer from 'nodemailer';
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

    await limiter.check(request, 5, token);

    const body = await request.json();
    const { from_name, reply_to, message } = body;

    logger.info("POST - Données reçues", { from_name, reply_to });

    if (!from_name || !reply_to || !message) {
      logger.error("POST - Champs requis manquants");
      return new Response(JSON.stringify({ message: "Champs requis manquants" }), { status: 400 });
    }

    if (!validateEmail(reply_to)) {
      return new Response(JSON.stringify({ message: "Adresse email invalide" }), { status: 400 });
    }
    if (!validateName(from_name)) {
      return new Response(JSON.stringify({ message: "Nom invalide" }), { status: 400 });
    }
    if (!validateMessage(message)) {
      return new Response(JSON.stringify({ message: "Message invalide" }), { status: 400 });
    }

    const spamCheck = analyzeContent(message);
    if (spamCheck === 'spam') {
      return new Response(JSON.stringify({ message: "Le contenu est détecté comme spam" }), { status: 400 });
    }

    try {
      const response = await sendEmailWithNodemailer(reply_to, from_name, message);
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
  // Variables d'environnement SMTP
  const smtpHost = process.env.SMTP_HOST;
  const smtpPort = process.env.SMTP_PORT;
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;
  const toEmail = process.env.TO_EMAIL;
  const fromEmail = process.env.FROM_EMAIL;

  if (!smtpUser || !smtpPass || !toEmail) {
    throw new Error("Les informations de configuration SMTP sont requises");
  }

  try {
    const transporter = nodemailer.createTransport({
      host: smtpHost || "smtp-relay.brevo.com",
      port: smtpPort || 587,
      secure: false,
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });

    await transporter.verify();

    const mailOptions = {
      from: `"Le Roi Lion" <${fromEmail || toEmail}>`,
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