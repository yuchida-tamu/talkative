import express from 'express';
import { Server } from 'socket.io';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import http from 'http';

const __dirname = dirname(fileURLToPath(import.meta.url));

const PORT = process.env.PORT || 8080;

const app = express();
app.use(express.static('public'));
const server = http.createServer(app);
const io = new Server(server);
let roomId = 'common';

/* setuo socket io */
app.use((req, res, next) => {
  req.io = io;
  next();
});

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/portal.html');
});

app.get('/chatroom/:roomId', (req, res) => {
  roomId = req.params.roomId;
  res.sendFile(__dirname + '/public/chatroom.html');
});

io.on('connection', socket => {
  socket.join(roomId);
  socket.send(roomId);

  socket.on('message', data => {
    console.log(data);
  });

  socket.on('client_to_server', data => {
    console.log(data.value);
    // sendMessageToClients(socket, data.value); //send the received message back to clients
    sendMessageToRoom(io, roomId, data);
  });
});

function sendMessageToClients(socket, text) {
  socket.broadcast.emit('server_to_client', text);
}

function sendMessageToRoom(io, roomId, text) {
  io.to(roomId).emit('server_to_client', text);
}

server.listen(PORT, () => {
  console.log('Server is running on ', PORT);
});
