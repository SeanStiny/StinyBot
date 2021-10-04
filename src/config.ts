import dotenv from 'dotenv';

// Load config from .env file
dotenv.config();

/**
 * Application configuration
 */
export const config = {
  // Logging
  logLevel: process.env.LOG_LEVEL,

  // Twitch chat
  user: process.env.USER || `justinfan${Math.floor(Math.random() * 9999)}`,
  pass: process.env.PASS || '',
  channels: process.env.CHANNELS?.split(',') || [],
};
