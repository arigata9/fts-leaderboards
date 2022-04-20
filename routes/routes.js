const express = require('express');
const mysql = require('mysql2');
const router = express.Router();
const locales = require('./../locales.json');

let con = mysql.createConnection({
    host: 'localhost',
    user: process.env.MYSQLUSER,
    password: process.env.MYSQLPW,
    database: process.env.MYSQLDB
});

con.connect((err) => {
    if(err) throw err;
    console.log('Database connection established.');
});

const mapsSQL = 'SELECT track_id, track_name FROM tracks;';
const maps = con.execute(mapsSQL, (err, result, fields) => {
    if(err) throw err;
    if(result.length == 0) return 'No maps found';

    return result;
});

// root
router.get('/', (req, res) => {
    res.render('index', {
        en: locales.en,
        tracks: maps
    });
});

router.get('/ru', (req, res) => {
    res.render('index', {
        ru: locales.ru,
        tracks: maps
    });
});


module.exports = router;