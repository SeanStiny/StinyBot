import { createLogger, format, transports } from 'winston';
import { config } from './config';

export const logger = createLogger({
  level: config.logLevel,
  format: format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    format.colorize(),
    format.printf((info) => {
      return `${info.timestamp} [${info.level}]: ${info.message}`;
    })
  ),
  transports: [new transports.Console()],
});
