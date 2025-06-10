// Lightweight logger wrapper that avoids Node.js-specific dependencies.
// Uses console methods under the hood so it works in both Node and browser
// environments without requiring modules like 'fs'.

const noop = () => {};

const isProd = process.env.NODE_ENV === 'production';

export const logger = {
  debug: isProd ? noop : console.debug.bind(console),
  info: console.info.bind(console),
  warn: console.warn.bind(console),
  error: console.error.bind(console),
};

export default logger;
