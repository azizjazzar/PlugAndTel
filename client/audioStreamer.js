import mic from 'node-mic';
import { io } from 'socket.io-client';
import vad from 'node-vad'; 

const serverUrl = 'http://localhost:3000';
const clientSocket = io(serverUrl);

const micInstance = new mic({
  rate: '16000',
  channels: '1',
  debug: true
});

const micInputStream = micInstance.getAudioStream();

const vadInstance = new vad(vad.Mode.NORMAL);  

clientSocket.on('connect', () => {
  console.log('Connected to the processing server');
});

clientSocket.on('disconnect', () => {
  console.log('Disconnected from server');
});

clientSocket.on('reconnect', () => {
  console.log('Reconnected to server');
});

micInputStream.on('data', (data) => {
  try {
    const isSpeech = vadInstance.processAudio(data);  

    if (isSpeech === vad.Event.VOICE) {
      clientSocket.emit('audioData', data);
    }

    console.log('Audio data sent to server');
  } catch (error) {
    console.error('Error processing audio:', error);
  }
});

micInstance.start();
console.log('Recording started...');

let silenceTimer;
micInputStream.on('silence', () => {
  clearTimeout(silenceTimer);
  silenceTimer = setTimeout(() => {
    console.log('Silence detected, stopping recording...');
    micInstance.stop();
  }, 3000); 
});

process.on('SIGINT', () => {
  console.log('Stopping...');
  micInstance.stop();
  clientSocket.disconnect();
  process.exit();
});
