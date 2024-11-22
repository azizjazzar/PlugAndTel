import { createLogger, format, transports } from 'winston';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Utiliser import.meta.url pour obtenir __dirname dans les modules ES
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Crée un logger pour le client
const clientLogger = createLogger({
  level: 'debug',
  format: format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    format.printf((info) => `[${info.timestamp}] ${info.level.toUpperCase()}: ${info.message}`)
  ),
  transports: [
    // Log dans la console 
    new transports.Console({
      format: format.combine(
        format.printf((info) => `[${info.timestamp}] ${info.level.toUpperCase()}: ${info.message}`)
      ),
    }),
    // Log dans un fichier 'client.log' pour le client
    new transports.File({
      filename: join(__dirname, 'logs', 'client.log'),
    }),
  ],
});

export default clientLogger;
