// server.js
const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

io.on('connection', (socket) => {
  socket.on('message', (data) => {
    // Handle incoming messages from clients (if required)
    io.emit('message', data); // Broadcast the message to all connected clients
  });

  // Handle disconnection (if required)
  socket.on('disconnect', () => {
    // Handle disconnection here
  });
});

server.listen(8080, () => {
  console.log('Server listening on port 8080');
});
