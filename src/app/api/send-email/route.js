import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import DOMPurify from 'isomorphic-dompurify';
import { rateLimit } from 'express-rate-limit';
import { validateEmail, validateName, validateMessage, escapeSpecialChars } from '../../utils/Validator';
import { logger } from '../../utils/logger';

// Create a custom rate limiter for Next.js API routes
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per window
  message: { message: 'Too many requests, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    return req.headers.get('x-forwarded-for') || 'unknown';
  },
});

export async function POST(request) {
  try {
    // Apply rate limiting
    const rateLimitResult = await new Promise((resolve) => {
      limiter(request, {
        json: (data) => resolve(data),
        status: (s) => ({ json: (data) => resolve({ ...data, status: s }) }),
      }, () => resolve({ success: true }));
    });

    if (!rateLimitResult.success) {
      return NextResponse.json(rateLimitResult, { status: rateLimitResult.status || 429 });
    }

    const { from_name, reply_to, message, honeypot } = await request.json();

    // Honeypot check
    if (honeypot) {
      logger.warn('Potential bot detected');
      return NextResponse.json({ message: 'Form submission failed' }, { status: 400 });
    }

    // Input validation
    if (!from_name || !reply_to || !message) {
      throw new Error('Missing required fields');
    }

    if (!validateEmail(reply_to)) {
      throw new Error('Invalid email address');
    }
    if (!validateName(from_name)) {
      throw new Error('Invalid name');
    }
    if (!validateMessage(message)) {
      throw new Error(`Invalid message: length ${message.length}`);
    }

    // Input sanitization
    const sanitizedFromName = escapeSpecialChars(DOMPurify.sanitize(from_name));
    const sanitizedMessage = escapeSpecialChars(DOMPurify.sanitize(message));

    // Nodemailer transporter configuration
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });

    // Send email
    const info = await transporter.sendMail({
      from: `"${process.env.FROM_NAME}" <${process.env.FROM_EMAIL}>`,
      to: process.env.TO_EMAIL,
      replyTo: reply_to,
      subject: `New message from ${sanitizedFromName}`,
      text: sanitizedMessage,
      html: `<p><strong>From:</strong> ${sanitizedFromName}</p><p><strong>Email:</strong> ${reply_to}</p><p><strong>Message:</strong></p><p>${sanitizedMessage}</p>`
    });

    logger.info(`Email sent: ${info.messageId}`);
    return NextResponse.json({ message: 'Email sent successfully' });
  } catch (error) {
    logger.error('Error sending email:', error);
    return NextResponse.json({ message: 'Failed to send email', error: error.message }, { status: 500 });
  }
}