const express = require('express');
const routes = require('./routes.js');

const app = express();
app.use('/', routes);

app.get('/', (req, res) => {
    res.send('Hello :)');
});
