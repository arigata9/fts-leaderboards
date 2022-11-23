require('dotenv').config();
const { marked } = require('marked');
var fs = require('fs'),
    path = require('path');

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

    console.log(tempChangelog);
    const htmlChangelog = marked.parse(tempChangelog);

    con.query(mapsSQL, (err, result, fields) => {
        if(err) throw err;
        if(result.length == 0) return 'No maps found';

        res.render('index', {
            en: locales.en,
            tracks: result,
            changelog: htmlChangelog
        });
    });
});

router.get('/ru', (req, res) => {
    const mapsSQL = 'SELECT track_id, track_name FROM tracks;';

    var tempChangelog; // Variable, content will be read to

    // read the changelog file
    fs.readFile(path.join(__dirname, '..', 'static', 'txt', 'changelog.md'), 'utf8', function(err, data) {
        if(err) {
            console.log(err);
            process.exit(1);
        }
        tempChangelog = data;
    });

    const htmlChangelog = marked.parse(tempChangelog);

    con.query(mapsSQL, (err, result, fields) => {
        if(err) throw err;
        if(result.length == 0) return 'No maps found';

        res.render('index', {
            ru: locales.ru,
            tracks: result,
            changelog: htmlChangelog
        });
    });
});

router.get('/tracks/:trackid', (req, res) => {
    var trackid = req.params.trackid;
    console.log('GET /tracks: requested trackid: '+trackid);

    const scoreSQL = `SELECT score, vehicle_name, user_name, track_rank FROM Records WHERE track_id = ${trackid} ORDER BY track_rank;`;
    con.query(scoreSQL, (err, result, fields) => {
        if(err) throw err;
        if(result.length == 0) console.log('No scores found');
        
        console.log(`result row: ${Object.entries(result)}`);
        const iterate = (obj) => {
            Object.keys(obj).forEach(key => {
        
            console.log(`key: ${key}, value: ${obj[key]}`)
        
            if (typeof obj[key] === 'object' && obj[key] !== null) {
                    iterate(obj[key])
                }
            })
        }
        console.log(iterate(result));

        res.render('leaderboard', {
            scores: result
        });
    });
    
});


module.exports = router;