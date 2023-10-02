const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const PORT = process.env.PORT || 4000;
const { Client, LocalAuth } = require('whatsapp-web.js');
const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: [
      'http://127.0.0.1:3000',
      'http://localhost:3000',
      'https://userpics.onrender.com',
    ],
    methods: ['GET', 'POST'],
  },
});

const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.use(
  cors({
    origin: [
      'http://127.0.0.1:3000',
      'http://localhost:3000',
      'https://userpics.onrender.com',
    ],
    credentials: true,
    optionSuccessStatus: 200,
  })
);

let client;

httpServer.listen(PORT, () => {
  console.log(`listening on *:${PORT}`);
});

const createWAClient = async (userId) => {
  try {
    if (!client) {
      client = new Client({
        authStrategy: new LocalAuth({
          clientId: userId,
        }),
        puppeteer: { 
          headless: true, 
          args: [ 
            '--no-sandbox', 
            '--disable-setuid-sandbox', 
            '--disable-dev-shm-usage', 
            '--disable-accelerated-2d-canvas', 
            '--no-first-run', 
            '--no-zygote', 
            '--single-process', 
            '--disable-gpu',
          ], 
        },
      });

      client.on('ready', async () => {
        console.log('ready');
        io.emit('client:ready');
      });

      client.on('qr', (qr) => {
        console.log(qr);
        io.emit('qr', qr);
      });

      client.on('authenticated', () => {
        console.log('Client is authenticated!');
      });

      client.on('disconnected', (reason) => {
        console.log('Client destroyed');
        // Destroy and reinitialize the client when disconnected
        // client.destroy();
        // client.initialize();
      });

      await client.initialize();
    }
  } catch (err) {
    console.log('initerror', err);
    // await client.initialize();
  }
};

io.on('connection', async (socket) => {
  console.log('user connected');
  if (client?.info) {
    console.log('Client has info');
    io.emit('client:ready');

    // client.on('ready', () => {
    //   console.log('Client has info on ready');

    //   io.emit('client:ready');
    // });
  } else {
    console.log('no user');
    await createWAClient(socket.handshake.query.userId);
  }

  socket.on('disconnect', async () => {
    console.log('user disconnected');
  });
});


app.get('/reload', async (req, res) => {
  try {
    await client.destroy();
    await client.initialize();
    res.status(200);
  } catch (error) {
    console.log('/reload', error);
    // await client.initialize();
  }
});


app.post('/getUserpic', async (req, res) => {
  try {
    const url = await client.getProfilePicUrl(req.body.id);
    res.send(url);
  } catch (error) {
    console.log('/getUserpic', error);
    // await client.initialize();
  }
});

app.post('/getUserpics', async (req, res) => {
  await Promise.all(
    req.body.map(async (phone) => {
      let pic = await client.getProfilePicUrl(`${phone}@c.us`);
      if (pic) {
        return {
          phone,
          pic,
        }
      }
    })
  )
    .then((users) => {
      users = users.filter(user => user);
      res.send(users);
    })
    .catch(async (error) => {
      console.log('/getUserpics', error); 
      res.status(503);
    });
})
