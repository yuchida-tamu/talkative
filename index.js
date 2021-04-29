import express from 'express';
import { Server } from 'socket.io';
import http from 'http';

const PORT = process.env.PORT || 8080;

const app = express();
app.use(express.static('public'));
const server = http.createServer(app);
const io = new Server(server);

io.on('connection', socket => {
  socket.send('Hello From the Server');

  socket.on('message', data => {
    console.log(data);
  });

  socket.on('client_to_server', data => {
    console.log(data.value);
    sendMessageToClients(socket, data.value); //send the received message back to clients
  });
});

function sendMessageToClients(socket, text) {
  socket.emit('server_to_client', text);
}

server.listen(PORT, () => {
  console.log('Server is running on ', PORT);
});
