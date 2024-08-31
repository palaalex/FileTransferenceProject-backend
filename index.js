const express = require('express');
var cors = require('cors')
const WebSocket = require('ws');

// const admin = require('firebase-admin');
// const serviceAccount = require('./firebase.json');

// admin.initializeApp({
//     credential: admin.credential.cert(serviceAccount)
//   });

//   const db = admin.database();

const app = express();
app.use(cors())

const PORT = 3002;
const wss = new WebSocket.Server({ port: 3003 });

const clients = new Map();


wss.on('connection', (ws) => {
  console.log('Client connected');

  let authCode = Date.now().toString(36) + Math.random().toString(36).substring(13);

  clients.set(authCode, ws);
  ws.send(JSON.stringify({status: 'authCode', authCode: authCode }));

  ws.on('close', () => {
    console.log('Client disconnected');
    clients.delete(authCode);
  });
});

app.get('/authCode/:authCode', (req, res) => {
  const { authCode } = req.params;

  const client = clients.get(authCode);

  if (client) {
    console.log("Auth code matched: ", authCode);
    client.send(JSON.stringify({ status: 'verified', message: 'QR code scanned successfully!' }));

    clients.delete(authCode);

    res.status(200).send('Auth code verified!');
  } else {
    console.log('Auth code did not match.');
    res.status(400).send('Invalid or expired auth code.');
  }
})

app.get('/', (req, res) => {
  res.send('The server is running!!');
});

app.post('/auth', (req, res) => {
  console.log("User authenticated!");
  res.send(`http://192.168.56.1:3000`);
})

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

