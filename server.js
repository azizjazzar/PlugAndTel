import { WebSocketServer } from 'ws'; 

const wss = new WebSocketServer({ port: 3000 }); 

wss.on('connection', (ws) => {
  console.log('Client connected');

  ws.on('message', (message) => {
    console.log('Received: %s', message);
  });

  ws.on('close', () => {
    console.log('Client disconnected');
  });

  ws.on('error', (err) => {
    console.error('WebSocket error:', err);
  });

  // Send a message to the client
  ws.send('Hello Client');
});

console.log('WebSocket server started on ws://localhost:3000');
