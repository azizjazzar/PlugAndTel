import SocketService from './services/socketService.js';
import AudioHandler from './services/audioHandler.js';
import clientLogger from '../logService/clientLogger.js';

const serverUrl = 'http://localhost:3000';
const socketService = new SocketService(serverUrl);
const audioHandler = new AudioHandler(socketService);

socketService.onConnect = () => {
  audioHandler.startRecording();
};

socketService.onDisconnect = () => {
  audioHandler.stopRecording();
};

socketService.connect();

process.on('SIGINT', () => {
  clientLogger.error('Client Server has been down');
  audioHandler.stopRecording();
  socketService.disconnect();
  process.exit();
});
