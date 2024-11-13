import fs from 'fs';
import winston from 'winston';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Utiliser import.meta.url pour obtenir __dirname dans les modules ES
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Créer le répertoire de logs s'il n'existe pas
const logDir = join(__dirname, 'logs');
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

// Configuration du logger Winston
const serverLogger = winston.createLogger({
  level: 'debug',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ timestamp, level, message }) => `${timestamp} [${level}] ${message}`)
  ),
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.printf(({ timestamp, level, message }) => `${timestamp} [${level}] ${message}`)
      ),
    }),
    new winston.transports.File({
      filename: join(logDir, 'server.log'),
      level: 'info',
    }),
  ],
});

export default serverLogger;
