import { Server } from 'socket.io';
import serverLogger from '../../logService/serverLogger.js';

class SocketService {
  constructor(server) {
    this.io = new Server(server);
    this.audioRecorder = null;
  }

  setAudioRecorder(audioRecorder) {
    this.audioRecorder = audioRecorder;
  }

  startListening() {
    this.io.on('connection', (socket) => {
      serverLogger.info('Client connected');

      socket.on('Stream_Data', (data) => {
        serverLogger.info('Received audio data (chunk size):' + data.length);
        if (this.audioRecorder) {
          this.audioRecorder.addAudioData(data);
        }
      });

      socket.on('End_Recording', () => {
        serverLogger.info('End recording signal received');
        if (this.audioRecorder) {
          this.audioRecorder.saveWavFile();
        }
      });

      socket.on('disconnect', () => {
        if (this.audioRecorder && !this.audioRecorder.isAudioChunkEmpty()) {
          this.audioRecorder.saveWavFile();
        }
        serverLogger.info('Client disconnected');
      });
    });

  }
}

export default SocketService;
