import fs from 'fs';
import wav from 'wav';
import serverLogger from '../../logService/serverLogger.js';
class audioService {
  constructor(sampleRate = 16000, channels = 1, bitDepth = 16) {
    this.sampleRate = sampleRate;
    this.channels = channels;
    this.bitDepth = bitDepth;
    this.audioChunks = [];
    this.outputDir = '../audio';

    if (!fs.existsSync(this.outputDir)) {
      fs.mkdirSync(this.outputDir, { recursive: true });
    }
  }

  addAudioData(data) {
    this.audioChunks.push(data);
  }

  resetAudioChunks() {
    this.audioChunks = [];
  }

  getUniqueFileName() {
    const now = new Date();
    const dateString = now.toISOString().replace(/[-:.]/g, '_'); 
    const filePath = `${this.outputDir}/${dateString}.wav`;
    return filePath;
  }

  saveWavFile() {
    if (this.audioChunks.length === 0) {
      serverLogger.info('No audio data to save.');
      return;
    }
    const audioData = Buffer.concat(this.audioChunks); 
    const filePath = this.getUniqueFileName();

    const writer = new wav.FileWriter(filePath, {
      sampleRate: this.sampleRate,
      channels: this.channels,
      bitDepth: this.bitDepth,
    });

    writer.write(audioData); 
    writer.end(); 

    this.resetAudioChunks(); 
    serverLogger.info(`WAV file created and saved as ${filePath}`);
  }

  isAudioChunkEmpty() {
    return this.audioChunks.length === 0;
  }
}

export default new audioService();
