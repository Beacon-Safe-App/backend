require("dotenv").config();
const { PORT } = process.env;
const express = require("express");
const app = express();
const routes = require('./routes/index.js');
const cookieParser = require("cookie-parser");

app.disable("x-powered-by")
app.use(cookieParser())
app.use(express.urlencoded({extended: true}))
app.use(express.json())

app.use('/', routes)
app.use((req, res) => {res.status(404).json({message: "NOT A PROPER ROUTE", data: [JSON.stringify(req.path)]})})

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));