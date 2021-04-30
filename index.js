import express from 'express';
import { Server } from 'socket.io';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import http from 'http';
import Translate from 'aws-sdk/clients/translate.js';
import AWS from 'aws-sdk/global.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

/*AWS Translate configuration*/
import { AWSCredentials, AWSRegion } from './keys/awsCredentials.js';
AWS.config.update({
  credentials: AWSCredentials,
  region: AWSRegion,
});
const translateClient = new Translate(); //TODO use environment variables

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

  socket.on('client_to_server', async data => {
    console.log(data.value);
    try {
      const translated = await translateText(data.value, 'en', 'ja');
      console.log('translate:', translated.TranslatedText);
      sendMessageToRoom(io, roomId, translated.TranslatedText);
    } catch (err) {
      console.error('client to server', err);
    }
  });
});

async function translateText(text, source, target) {
  const params = {
    Text: text,
    SourceLanguageCode: source,
    TargetLanguageCode: target,
  };

  return new Promise((resolve, reject) => {
    try {
      translateClient.translateText(params, (err, data) => {
        if (err) reject(err);
        if (data) resolve(data);
      });
    } catch (err) {
      console.error('ERROR: translateText:', err);
      return;
    }
  });
}

function sendMessageToRoom(io, roomId, text) {
  io.to(roomId).emit('server_to_client', text);
}

server.listen(PORT, () => {
  console.log('Server is running on ', PORT);
});
