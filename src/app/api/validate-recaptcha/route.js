import { NextResponse } from "next/server";
import { rateLimit } from "../../utils/rateLimiter";
import { logger } from "../../utils/logger";

const limiter = rateLimit({
  interval: 60 * 1000,
  uniqueTokenPerInterval: 500,
});

export async function POST(request) {
  try {
    await limiter.check(request, 10, "CACHE_TOKEN");

    const body = await request.json();
    validateRequestBody(body);

    const verificationResult = await verifyRecaptcha(body.token);
    if (verificationResult.success) {
      logger.info("reCAPTCHA verification successful");
      return jsonResponse({ success: true });
    } else {
      logger.warn("reCAPTCHA verification failed", { errors: verificationResult["error-codes"] });
      return jsonResponse(
        { success: false, error: "Invalid reCAPTCHA", details: verificationResult["error-codes"] },
        400
      );
    }
  } catch (error) {
    return handleError(error);
  }
}

function validateRequestBody(body) {
  if (!body?.token) {
    logger.warn("reCAPTCHA token missing");
    throw new Error("Token is missing");
  }
}

async function verifyRecaptcha(token) {
  const secretKey = process.env.RECAPTCHA_SECRET_KEY;
  if (!secretKey) {
    logger.error("RECAPTCHA_SECRET_KEY environment variable is missing");
    throw new Error("Server configuration error");
  }

  const verificationURL = "https://www.google.com/recaptcha/api/siteverify";
  const response = await fetch(verificationURL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: `secret=${secretKey}&response=${token}`,
  });

  if (!response.ok) {
    const errorDetails = await response.text();
    logger.error("Failed to reach reCAPTCHA verification server", { status: response.status, errorDetails });
    throw new Error("Failed to verify reCAPTCHA");
  }

  return await response.json();
}

function jsonResponse(body, status = 200) {
  return NextResponse.json(body, { status });
}

function handleError(error) {
  const status = error.message === "Token is missing" ? 400 : 500;
  logger.error("Error during reCAPTCHA verification", { message: error.message });
  return jsonResponse({ success: false, error: error.message }, status);
}
