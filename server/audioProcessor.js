import fs from 'fs';
import WebSocket from 'ws';
import Vad from 'node-vad';
import wav from 'node-wav';

const ws = new WebSocket('ws://localhost:3000');  

const vadInstance = new Vad(Vad.Mode.NORMAL);  
// Array to store audio data
let audioChunks = [];
let isRecording = false;
let silenceTimeout = null;

ws.on('message', (data) => {
  const audioBuffer = Buffer.from(data);
  
  audioChunks.push(audioBuffer);

  if (vadInstance.process(audioBuffer)) {
    if (!isRecording) {
      console.log('Voice detected, starting recording');
      isRecording = true;
      startRecording();
    }
    resetSilenceTimeout();
  } else {
    if (isRecording) {
      startSilenceTimeout();
    }
  }
});

function startRecording() {
  const writer = fs.createWriteStream('output.wav', { flags: 'a' });  

  if (audioChunks.length === 1) {
    writer.write(wav.encode(audioChunks, { sampleRate: 16000, float: true }));
  }
}

function resetSilenceTimeout() {
  if (silenceTimeout) {
    clearTimeout(silenceTimeout);
  }
}

function startSilenceTimeout() {
  silenceTimeout = setTimeout(() => {
    if (isRecording) {
      console.log('Silence detected, stopping recording');
      isRecording = false;
      stopRecording();
    }
  }, 3000);
}

function stopRecording() {
  const writer = fs.createWriteStream('output.wav', { flags: 'a' });
  writer.write(wav.encode(audioChunks, { sampleRate: 16000, float: true }));
  writer.end();
  audioChunks = [];  
}
