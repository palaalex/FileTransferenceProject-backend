const express = require('express');
var cors = require('cors')
// const WebSocket = require('ws');

const app = express();
app.use(cors())
app.use(express.json());


const PORT = 3002;
// const wss = new WebSocket.Server({ port: 3003 });

const clients = new Map();
const DISCONNECT_TIMEOUT = 40000;

// wss.on('connection', (ws) => {
//   console.log('Client connected');

//   let authCode = Date.now().toString(36) + Math.random().toString(36).substring(13);

//   clients.set(authCode, ws);
//   ws.send(JSON.stringify({ status: 'authCode', authCode: authCode }));

//   const disconnectTimeout = setTimeout(() => {
//     if (clients.has(authCode)) {
//       clients.delete(authCode);
//       console.log('Disconnecting client due to inactivity:', authCode);
//     }
//     ws.close();
//   }, DISCONNECT_TIMEOUT);

//   ws.on('close', () => {
//     console.log('Client disconnected');
//     clients.delete(authCode);
//   });
// });

// app.post('/authCode/:authCode', (req, res) => {
//   const { authCode } = req.params;

//   console.log(req.body)

//   const client = clients.get(authCode);

//   if (client) {
//     console.log(`Auth code verified: ${authCode} , user: ${req.body.username}`);
//     client.send(JSON.stringify({ status: 'verified', message: 'QR code scanned successfully!' }));

//     client.close();
//     clients.delete(authCode);

//     res.status(200).send('Auth code verified!');
//   } else {
//     console.log('Auth code did not match.');
//     res.status(400).send('Invalid or expired auth code.');
//   }
// })

app.get('/authCode/', (req, res) => {
  let authCode = Date.now().toString(36) + Math.random().toString(36).substring(2);

  let newClient = { authCode: authCode, verified: false };

  clients.set(authCode, newClient);

  res.status(200).json(newClient);
});


app.get('/authCodeCheck/:authCode', (req, res) => {
  let client = clients.get(req.params.authCode);
  console.log(client.authCode + " checking")
  res.status(200).json(client);
})

app.get('/authCode/:authCode', (req, res) => {
  let client = clients.get(req.params.authCode);
  console.log(req.params.authCode + " recived")

  if (client) {
    client.verified = true;
    console.log(`Auth code verified: ${req.params.authCode}`);
  }

  res.status(200).json(client);
});

app.post("/uploadFile", async (req, res) => {
  const { storageRef } = req.body;
  const { file } = req.body;
  try {
    await uploadBytes(storageRef, file).then((snapshot) => {
      console.log("Uploaded a blob or file!");
      res.status(200).send('File uploaded successfully!');
    })
  } catch (err) {
    console.log(err)
    res.status(500).send(err)
  }
  return res;
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

