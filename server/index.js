const express = require('express');
const app = express();
const cors = require('cors');
const pool = require('./queries');
const helmet = require("helmet")

const port = 5000;

app.use(
    cors({
        origin:'*' // Omogućen pristup sa svih adresa
    })
) 
app.use(express.json()); // req.body

app.use(helmet());
app.listen(port, () => {
    console.log(`Listening on port ${port}`)
});