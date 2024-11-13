import http from 'http';
import AudioRecorder from './services/audioService.js';
import SocketService from './services/socketService.js';
import serverLogger from '../logService/serverLogger.js';

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Audio Recording Server');
});

const socketService = new SocketService(server);

socketService.setAudioRecorder(AudioRecorder);

socketService.startListening();

server.listen(3000, () => {
  serverLogger.info('Server is running at http://localhost:3000');
});
process.on('SIGINT', () => {
  serverLogger.error('Server has been down');
  audioHandler.stopRecording();
  socketService.disconnect();
  process.exit();
});
