const PORT = process.env.PORT || 4000;
const { Client, LocalAuth, RemoteAuth } = require('whatsapp-web.js');
const express = require('express');
const { createServer } = require("http");
const { Server } = require("socket.io");
const cors = require('cors');
const app = express();
const httpServer = createServer(app);

const { MongoStore } = require('wwebjs-mongo');
const mongoose = require('mongoose');

const { initTgApi } = require('./core/API');
// bot.on('text', async msg => {
//  bot.getUserProfilePhotos(userId, 0, 1).then(function(data){
//   console.log(msg);
// })

const io = new Server(httpServer, {
  cors: {
    origin: ["http://127.0.0.1:3000", 'http://localhost:3000', 'https://userpics.onrender.com'],
    methods: ["GET", "POST"]
  }
});

const bodyParser = require('body-parser');
app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

app.use(cors({
  origin: ['http://127.0.0.1:3000', 'http://localhost:3000', 'https://userpics.onrender.com'], 
  credentials:true,            //access-control-allow-credentials:true
  optionSuccessStatus:200
}));

let client;

httpServer.listen(PORT, () => {
  console.log(`listening on *:${PORT}`);
});

io.on('connection', (socket) => {
  console.log('a user connected');

  socket.on('disconnect', async () => {
    // await client?.destroy();
    console.log('user disconnected');
  });
});

// app.post('/auth', async (req, res) => {
try {
  mongoose.connect(process.env.MONGODB_URI).then(async () => {
    const store = new MongoStore({ mongoose: mongoose });
    client = new Client({
        authStrategy: new RemoteAuth({
            store: store,
            backupSyncIntervalMs: 300000
        })
    });

    client.on('remote_session_saved', () => {
      console.log('remote_session_saved');
      io.emit('client:ready');
    });

    client.on('qr', (qr) => {
      console.log(qr);
      io.emit('qr', qr);
    });

    await client.initialize();
    console.log('client created');
    res.sendStatus(200);
  });

} catch (err) {
  console.log('initerror', err);
  await client.initialize();
}
// });

app.post('/getUserpic', async (req, res) => {
  try { 
    const url = await client.getProfilePicUrl(req.body.id);
    res.send(url);
  } catch (error) { 
    console.log('/getUserpic', error); 
    await client.initialize();
  }
})