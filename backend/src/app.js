const express = require('express');
const router = require('./router')
const app = express();

//Rotas de API
app.use(express.json())
app.use(router);

module.exports = app;