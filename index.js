const express = require('express');
const app = express();

const PORT = 3001;

app.get('/', (req, res) => {
    res.send('The server is running!!');
});

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});

