import SocketService from './services/socketService.js';
import AudioHandler from './services/audioHandler.js';
import clientLogger from '../logService/clientLogger.js';

const serverUrl = 'http://localhost:3000';
const socketService = new SocketService(serverUrl);
const audioHandler = new AudioHandler(socketService);

socketService.connect();

// Lancer l'enregistrement à la connexion du socket
socketService.clientSocket.on('connect', () => {
  audioHandler.startRecording();
});

// Arrêter l'enregistrement à la déconnexion du socket
socketService.clientSocket.on('disconnect', () => {
  audioHandler.stopRecording();
});

process.on('SIGINT', () => {
  clientLogger.error('Client Server has been down');
  audioHandler.stopRecording();
  socketService.disconnect();
  process.exit();
});
