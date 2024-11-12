import { Server } from 'socket.io';

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
      console.log('Client connected');

      socket.on('Stream_Data', (data) => {
        console.log('Received audio data (chunk size):', data);
        if (this.audioRecorder) {
          this.audioRecorder.addAudioData(data);
        }
      });

      socket.on('End_Recording', () => {
        console.log('End recording signal received');
        if (this.audioRecorder) {
          this.audioRecorder.saveWavFile();
        }
      });

      socket.on('disconnect', () => {
        if (this.audioRecorder && !this.audioRecorder.isAudioChunkEmpty()) {
          this.audioRecorder.saveWavFile();
        }
        console.log('Client disconnected');
      });
    });

    console.log('Server listening on http://localhost:3000');
  }
}

export default SocketService;
