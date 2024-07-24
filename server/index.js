const express = require('express');
const app = express();
const cors = require('cors');
const pool = require('./queries');
const helmet = require("helmet")
const https = require('https');

const port = 3000;

app.use(
    cors({
        origin:'*' // Omogućen pristup sa svih adresa
    })
) 
app.use(express.json()); // req.body

app.use(helmet());

// https.createServer(nuxt.options.server.https, app).listen(port, 'app.agrambanka.hr')

app.listen(port, () => {
    console.log(`Listening on port ${port}`)
});