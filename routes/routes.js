const express = require('express');
const router = express.Router();

// root
router.get('/', (req, res) => {
    res.send('Home.');
});

// about
router.get('/about', (req, res) => {
    res.send('About.');
});

module.exports = router;