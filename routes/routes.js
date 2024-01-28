require('dotenv').config();
const { marked } = require('marked');
var fs = require('fs'),
    path = require('path');

var tempChangelog; // Variable, content will be read to

// read the changelog file
fs.readFile(path.join(__dirname, '..', 'static', 'txt', 'changelog.md'), 'utf8', function(err, data) {
    if(err) {
        console.log(err);
        process.exit(1);
    }
    console.log(data);
    tempChangelog = data;
});


const express = require('express');
const mysql = require('mysql2');
const router = express.Router();
const locales = require('./../locales.json');

let pool = mysql.createPool({
    connectionLimit: 10,
    host: 'localhost',
    user: process.env.MYSQLUSER,
    password: process.env.MYSQLPW,
    database: process.env.MYSQLDB
});

// root
router.get('/', (req, res) => {
    const mapsSQL = 'SELECT track_id, track_name FROM tracks;';

    const htmlChangelog = marked.parse(tempChangelog);
    
    try {
        pool.query(mapsSQL, function(error, results, fields) {
            res.render('index', {
                en: locales.en,
                tracks: results,
                changelog: htmlChangelog
            });
        });
    } catch {
        res.sendFile(path.join(__dirname, 'static', 'error.html'));
    }
    
});

router.get('/ru', (req, res) => {
    const mapsSQL = 'SELECT track_id, track_name FROM tracks;';

    const htmlChangelog = marked.parse(tempChangelog);

    try {
        pool.query(mapsSQL, function(error, results, fields) {
            res.render('index', {
                en: locales.ru,
                tracks: results,
                changelog: htmlChangelog
            });
        });
    } catch {
        res.sendFile(path.join(__dirname, 'static', 'error.html'));
    }
});

router.get('/tracks/:trackid', (req, res) => {
    var trackid = req.params.trackid;
    console.log('GET /tracks: requested trackid: '+trackid);

    const scoreSQL = `SELECT score, vehicle_name, user_name, track_rank FROM Records WHERE track_id = ${trackid} ORDER BY track_rank;`;
    
    try {
        pool.query(scoreSQL, function(error, results, fields) {
            const iterate = (obj) => {
                Object.keys(obj).forEach(key => {
            
                console.log(`key: ${key}, value: ${obj[key]}`)
            
                if (typeof obj[key] === 'object' && obj[key] !== null) {
                        iterate(obj[key])
                    }
                })
            }
            console.log(iterate(results));
    
            res.render('leaderboard', {
                scores: results
            });
        });
    } catch {
        res.sendFile(path.join(__dirname, 'static', 'error.html'));
    }
    
    
});


module.exports = router;