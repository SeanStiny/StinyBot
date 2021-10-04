import dotenv from 'dotenv';

// Load config from .env file
dotenv.config();

/**
 * Application configuration
 */
export const config = {
  // Logging
  logLevel: process.env.LOG_LEVEL,

  // Database
  dbUri: process.env.DB_URI || 'mongodb://localhost:27017',
  dbName: process.env.DB_NAME || 'stinybot',

  // Twitch chat
  user: process.env.USER || `justinfan${Math.floor(Math.random() * 9999)}`,
  pass: process.env.PASS || '',
};
