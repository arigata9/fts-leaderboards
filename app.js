const express = require('express');
const config = require('./config.json');
const app = express();

// routes file
const routes = require('./routes/routes.js');

// middlewares
app.set('view engine', 'ejs');
app.use(express.static('static'));
app.use('/', routes);

// starting server
app.listen(config.port, config.address, () => {
    console.log(`Listening on ${config.address} port ${config.port}`);
})