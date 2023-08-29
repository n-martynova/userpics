const path = require("path");
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const PORT = process.env.PORT || 4000;
const { Client, RemoteAuth } = require('whatsapp-web.js');
const express = require('express');
const { createServer } = require("http");
const { Server } = require("socket.io");
const cors = require('cors');
const app = express();
const httpServer = createServer(app);

const { MongoStore } = require('wwebjs-mongo');
const mongoose = require('mongoose');

const io = new Server(httpServer, {
  cors: {
    origin: ["http://127.0.0.1:3000", 'http://localhost:3000', 'https://userpics.onrender.com'],
    methods: ["GET", "POST"]
  }
});

const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(cors({
  origin: ['http://127.0.0.1:3000', 'http://localhost:3000', 'https://userpics.onrender.com'], 
  credentials: true,
  optionSuccessStatus:200
}));

let client;

httpServer.listen(PORT, () => {
  console.log(`listening on *:${PORT}`);
});

const createWAClient = async () => {
  try {
    mongoose.connect(process.env.MONGODB_URI).then(async () => {
      const store = new MongoStore({ mongoose: mongoose });
      client = new Client({
          authStrategy: new RemoteAuth({
              store: store,
              backupSyncIntervalMs: 300000
          })
      });

      client.on('remote_session_saved', async () => {
        console.log('remote_session_saved');
      });

      client.on('qr', (qr) => {
        console.log(qr);
        io.emit('qr', qr);
      });

      client.on('authenticated', () => {
        console.log('Client is authenticated!');
      });

      await client.initialize();
      console.log('client created');
      io.emit('client:ready');
    });

  } catch (err) {
    console.log('initerror', err);
    await client.initialize();
  }
};

io.on('connection', (socket) => {
  console.log('user connected');
  if (client?.info) {
    console.log('Client has info');
    io.emit('client:ready');

    client.on('ready', () => {
      console.log('Client has info on ready');

      io.emit('client:ready');
    });
  } else {
    createWAClient();
  }

  socket.on('disconnect', async () => {
    console.log('user disconnected');
  });
});

app.post('/getUserpic', async (req, res) => {
  try { 
    const url = await client.getProfilePicUrl(req.body.id);
    res.send(url);
  } catch (error) { 
    console.log('/getUserpic', error); 
    await client.initialize();
  }
})

createWAClient();