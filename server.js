require("dotenv").config();
const { PORT, ACCESS_TOKEN_SECRET } = process.env;
const express = require("express");
const jwt = require('jsonwebtoken');
const app = express();
const routes = require('./routes/index.js');
const cookieParser = require("cookie-parser");
const cors = require("cors");

app.disable("x-powered-by")
app.use(cookieParser())
app.use(express.urlencoded({extended: true}))
app.use(express.json())

const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:5174',
    // Add other origins as needed
]

const corsOptionsDelegate = (req, callback) => {
    let corsOptions
    if (allowedOrigins.includes(req.header('Origin'))) {
      corsOptions = { origin: true, credentials: true }
    } else {
      corsOptions = { origin: false }
    }
    callback(null, corsOptions)
}

app.use(cors(corsOptionsDelegate));
app.use('/', routes)

app.use((req, res) => {
  res.status(404).json({message: "NOT A PROPER ROUTE", data: [JSON.stringify(req.path)] });
});

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));