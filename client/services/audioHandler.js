import mic from 'node-mic';
import Vad from 'node-vad';
import clientLogger from '../../logService/clientLogger.js';

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

        this.micInputStream.on('error', (err) => {
            clientLogger.error('Microphone input stream error:', err);
            this.stopRecording();
        });

        this.micInputStream.on('data', this.handleAudioStream.bind(this));
    }

    startRecording() {
        if (!this.isMicActive && this.socketService.isConnected) {
            clientLogger.info('Starting recording...');
            try {
                micInstance.start();
                this.isMicActive = true;
                clientLogger.info('Recording started...');
            } catch (error) {
                clientLogger.error('Error starting microphone:', error);
            }
        } else {
            clientLogger.warn('Microphone is already active or server is not connected.');
        }
    }

    stopRecording() {
        if (this.isMicActive) {
            clientLogger.info('Stopping recording...');
            try {
                micInstance.stop();
                this.isMicActive = false;
                clientLogger.info('Recording stopped...');
            } catch (error) {
                clientLogger.error('Error stopping microphone:', error);
            }
        }
    }

    async handleAudioStream(data) {
        if (!this.socketService.isConnected) {
            clientLogger.warn('Server is not reachable. Audio not sent.');
            return;
        }

        try {
            const res = await vadInstance.processAudio(data, 16000);
            const currentTimestamp = Date.now();

            if (res === Vad.Event.VOICE) {
                if (!this.isRecording) {
                    clientLogger.info('Voice detected, starting streaming...');
                    this.isRecording = true;
                }
                this.lastVoiceTimestamp = currentTimestamp;
                clientLogger.debug('Audio data sent to server in real-time:');
                this.socketService.sendData('Stream_Data', data);
            } else if (res === Vad.Event.SILENCE) {
                if (this.isRecording) {
                    const silenceDuration = currentTimestamp - this.lastVoiceTimestamp;
                    clientLogger.debug(`Silence duration: ${silenceDuration} ms`);
                    if (silenceDuration >= silenceThreshold) {
                        clientLogger.info('Silence detected for 3 seconds, stopping streaming...');
                        this.isRecording = false;
                        this.socketService.sendData('End_Recording');
                    }
                }
            }
        } catch (error) {
            clientLogger.error('Error processing audio:', error);
        }
    }
}

export default AudioHandler;
