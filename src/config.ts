import dotenv from 'dotenv';

// Load config from .env file
dotenv.config();

// Warn about missing config values
if (process.env.CLIENT_ID === undefined) {
  console.warn('CLIENT_ID has not been provided.');
}
if (process.env.CLIENT_SECRET === undefined) {
  console.warn('CLIENT_SECRET has not been provided');
}
if (process.env.SPLATNET2_COOKIE === undefined) {
  console.warn('SPLATNET2_COOKIE has not been provided.');
}

/**
 * Application configuration
 */
export const config = {
  // Logging
  logLevel: process.env.LOG_LEVEL,

  // Database
  dbUri: process.env.DB_URI || 'mongodb://localhost:27017',
  dbName: process.env.DB_NAME || 'stinybot',

  // Twitch
  user: process.env.USER || `justinfan${Math.floor(Math.random() * 9999)}`,
  pass: process.env.PASS || '',
  clientId: process.env.CLIENT_ID || '',
  clientSecret: process.env.CLIENT_SECRET || '',

  // Splatoon 2
  splatnetCookie: process.env.SPLATNET2_COOKIE,
};
