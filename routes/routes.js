require('dotenv').config();

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

// root
router.get('/', (req, res) => {
    const mapsSQL = 'SELECT track_id, track_name FROM tracks;';
    con.query(mapsSQL, (err, result, fields) => {
        if(err) throw err;
        if(result.length == 0) return 'No maps found';

        /* result.forEach((row) => {
            console.log('still workin: '+row.track_name);
        }); */

        res.render('index', {
            en: locales.en,
            tracks: result
        });
    });
});

router.get('/ru', (req, res) => {
    res.render('index', {
        ru: locales.ru,
        tracks: maps
    });
});


module.exports = router;