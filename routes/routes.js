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

        res.render('index', {
            en: locales.en,
            tracks: result
        });
    });
});

router.get('/ru', (req, res) => {
    const mapsSQL = 'SELECT track_id, track_name FROM tracks;';
    con.query(mapsSQL, (err, result, fields) => {
        if(err) throw err;
        if(result.length == 0) return 'No maps found';

        res.render('index', {
            ru: locales.ru,
            tracks: result
        });
    });
});

router.post('/post/timetrials', (req, res) => {
    console.log('hey, a body: '+req.body);
    const scoreSQL = `SELECT score, vehicle_name FROM Records WHERE track_id = ${req.body.maps}`;
    con.query(scoreSQL, (err, result, fields) => {
        if(err) throw err;
        if(result.length == 0) return 'No scores found';

        res.sendStatus(200);
        res.json(result);
    });
});

router.get('/tracks/:trackid', (req, res) => {
    var trackid = req.params.trackid;
    console.log('GET /tracks: requested trackid: '+trackid);

    const scoreSQL = `SELECT score, vehicle_name FROM Records WHERE track_id = ${trackid}`;
    con.query(scoreSQL, (err, result, fields) => {
        if(err) throw err;
        if(result.length == 0) console.log('No scores found');
        
        console.log(`result row 0: ${result[0]}`)

        res.render('leaderboard', {
            scores: result[0]
        });
    });
    
});


module.exports = router;