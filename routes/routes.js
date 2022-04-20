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
let maps = con.execute(mapsSQL, (err, result, fields) => {
    if(err) throw err;
    if(result.length == 0) return 'No maps found';

    return result;
});

console.log(maps);
var test = maps[0].track_name;
console.log('array test: '+test);
var test2 = Object.keys(maps).forEach(key => {
    var row = maps[key];
    console.log('working on it: '+row.track_name);
});
//console.log('after test2: '+test2);

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