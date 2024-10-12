import { NextResponse } from 'next/server';
import { rateLimit } from '../../utils/rateLimiter';
import { logger } from '../../utils/logger';

const limiter = rateLimit({
  interval: 60 * 1000, // 60 secondes
  uniqueTokenPerInterval: 500, // Max 500 users per second
});

export async function POST(request) {
  try {
    // Rate limiting
    await limiter.check(request, 10, 'CACHE_TOKEN'); // 10 requests per minute

    const body = await request.json();
    const { token } = body;

    if (!token) {
      logger.warn('reCAPTCHA token missing');
      return NextResponse.json({ success: false, error: 'Token is missing' }, { status: 400 });
    }

    const secretKey = process.env.RECAPTCHA_SECRET_KEY;
    const verificationURL = `https://www.google.com/recaptcha/api/siteverify`;

    const response = await fetch(verificationURL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `secret=${secretKey}&response=${token}`,
    });

    const data = await response.json();

    if (data.success) {
      logger.info('reCAPTCHA verification successful');
      return NextResponse.json({ success: true });
    } else {
      logger.warn('reCAPTCHA verification failed', { errors: data['error-codes'] });
      return NextResponse.json({ success: false, error: 'Invalid reCAPTCHA', details: data['error-codes'] }, { status: 400 });
    }
  } catch (error) {
    logger.error('Error during reCAPTCHA verification:', error);
    return NextResponse.json({ success: false, error: 'reCAPTCHA verification failed', details: error.message }, { status: 500 });
  }
}