import { io } from 'socket.io-client';
const socket = io('http://localhost:4000');

socket.on('connect', () => {
  console.log('Connected!');
  socket.emit('createRoom', 'TestPlayer', (res) => {
    console.log('createRoom response:', res);
    process.exit(0);
  });
});

socket.on('connect_error', (err) => {
  console.error('Connection error:', err.message);
  process.exit(1);
});
