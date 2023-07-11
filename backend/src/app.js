const express = require('express');
const router = require('./router')
var cors = require('cors')
const app = express();

//Rotas de API
app.use(cors())
app.use(express.json())
app.use(router);

module.exports = app;