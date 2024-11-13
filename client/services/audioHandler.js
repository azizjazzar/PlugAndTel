// AudioHandler.js
import mic from 'node-mic';
import Vad from 'node-vad';

const silenceThreshold = 3000;
const micInstance = new mic({
  rate: '16000',
  channels: '1',
  debug: true,
});
const vadInstance = new Vad(Vad.Mode.NORMAL);

class AudioHandler {
  constructor(socketService) {
    this.socketService = socketService;
    this.micInputStream = micInstance.getAudioStream();
    this.lastVoiceTimestamp = null;
    this.isRecording = false;
    this.isMicActive = false;

    // Attach error handling for mic input stream
    this.micInputStream.on('error', (err) => {
      console.error('Microphone input stream error:', err);
      this.stopRecording();
    });

    this.micInputStream.on('data', this.handleAudioStream.bind(this));
  }

  startRecording() {
    if (!this.isMicActive && this.socketService.isConnected) {
      console.log('Starting recording...');
      try {
        micInstance.start();
        this.isMicActive = true;
        console.log('Recording started...');
      } catch (error) {
        console.error('Error starting microphone:', error);
      }
    }
  }

  stopRecording() {
    if (this.isMicActive) {
      console.log('Stopping recording...');
      try {
        micInstance.stop();
        this.isMicActive = false;
        console.log('Recording stopped...');
      } catch (error) {
        console.error('Error stopping microphone:', error);
      }
    }
  }

  handleAudioStream(data) {
    if (!this.socketService.isConnected) {
      console.log('Server is not reachable. Audio not sent.');
      return;
    }
    try {
      vadInstance.processAudio(data, 16000).then((res) => {
        const currentTimestamp = Date.now();
        if (res === Vad.Event.VOICE) {
          if (!this.isRecording) {
            console.log('Voice detected, starting streaming...');
            this.isRecording = true;
          }
          this.lastVoiceTimestamp = currentTimestamp;
          console.log('Audio data sent to server in real-time:');
          this.socketService.sendData('Stream_Data', data);
        } else if (res === Vad.Event.SILENCE) {
          if (this.isRecording) {
            const silenceDuration = currentTimestamp - this.lastVoiceTimestamp;
            console.log(`Silence duration: ${silenceDuration} ms`);
            if (silenceDuration >= silenceThreshold) {
              console.log('Silence detected for 3 seconds, stopping streaming...');
              this.isRecording = false;
              this.socketService.sendData('End_Recording');
            }
          }
        }
      }).catch((error) => {
        console.error('Error processing audio:', error);
      });
    } catch (error) {
      console.error('Unexpected error in handleAudioStream:', error);
    }
  }
}

export default AudioHandler;
