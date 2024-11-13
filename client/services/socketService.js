// SocketService.js
import { io } from 'socket.io-client';

class SocketService {
  constructor(serverUrl) {
    this.serverUrl = serverUrl;
    this.clientSocket = io(this.serverUrl);
    this.isConnected = false;
  }

  connect() {
    this.clientSocket.on('connect', () => {
      console.log('Connected to the server');
      this.isConnected = true;
      this.onConnect();
    });

    this.clientSocket.on('disconnect', () => {
      console.log('Disconnected from server');
      this.isConnected = false;
      this.onDisconnect();
    });
  }

  onConnect() {
    // Action à prendre lors de la connexion (ex : démarrer l'enregistrement)
  }

  onDisconnect() {
    // Action à prendre lors de la déconnexion (ex : arrêter l'enregistrement)
  }

  sendData(event, data) {
    if (this.isConnected) {
      this.clientSocket.emit(event, data);
    } else {
      console.log('Server is not reachable. Data not sent.');
    }
  }

  disconnect() {
    this.clientSocket.disconnect();
  }
}

export default SocketService;
