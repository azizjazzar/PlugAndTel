import mic from 'node-mic';
import { io } from 'socket.io-client';
import Vad from 'node-vad';

const serverUrl = 'http://localhost:3000';  
const clientSocket = io(serverUrl);
const micInstance = new mic({
  rate: '16000',
  channels: '1',
  debug: true,
});

const micInputStream = micInstance.getAudioStream();
const vadInstance = new Vad(Vad.Mode.NORMAL);
let lastVoiceTimestamp = null;
const silenceThreshold = 3000;  
let isRecording = false;
let isConnected = false;
let isMicActive = false;  

const startRecording = () => {
  if (!isMicActive && isConnected) {
    console.log('Starting recording...');
    micInstance.start();
    isMicActive = true;  
    console.log('Recording started...');
  }
};

const stopRecording = () => {
  if (isMicActive) {
    console.log('Stopping recording...');
    micInstance.stop();
    isMicActive = false; 
    console.log('Recording stopped...');
  }
};
const handleAudioStream = (data) => {
  if (!isConnected) {
    console.log('Server is not reachable. Audio not sent.');
    return;
  }
  try {
    vadInstance.processAudio(data, 16000).then((res) => {
      const currentTimestamp = Date.now(); 
      if (res === Vad.Event.VOICE) {
        if (!isRecording) {
          console.log('Voice detected, starting streaming...');
          isRecording = true;
        }
        lastVoiceTimestamp = currentTimestamp;
        console.log('Audio data sent to server in real-time:');
        clientSocket.emit('Stream_Data', data);
      } else if (res === Vad.Event.SILENCE) {
        if (isRecording) {
          if (lastVoiceTimestamp) {
            const silenceDuration = currentTimestamp - lastVoiceTimestamp;
            console.log(`Silence duration: ${silenceDuration} ms`);

            if (silenceDuration >= silenceThreshold) {
              console.log('Silence detected for 3 seconds, stopping streaming...');
              isRecording = false;
              clientSocket.emit('End_Recording');
            }
          }
        }
      }
    });
  } catch (error) {
    console.error('Error processing audio:', error);
  }
};

clientSocket.on('connect', () => {
  console.log('Connected to the server');
  isConnected = true;
  if (!isMicActive) {
    startRecording();
  }
  micInputStream.on('data', handleAudioStream);

});

clientSocket.on('disconnect', () => {
  console.log('Disconnected from server');
  isConnected = false;  
  stopRecording();
  console.log('Server is not reachable. Audio not sent.');
});


process.on('SIGINT', () => {
  console.log('Stopping...');
  micInstance.stop();
  clientSocket.disconnect();
  process.exit();
});
