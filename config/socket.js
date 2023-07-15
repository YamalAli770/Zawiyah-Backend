const socketIO = require('socket.io');

let io;

// Initialize the Socket.IO server
const initSocket = (server, corsOptions) => {
  io = socketIO(server, {
    cors: corsOptions,
    credentials: true,
  });

  io.on('connection', (socket) => {
    console.log('New client connected');

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });

    socket.emit('hello', {message: 'Hello from server'});
  });

};

const getIO = () => {
  if (!io) {
    throw new Error('Socket.io not initialized');
  }
  return io;
};

module.exports = {initSocket, getIO};