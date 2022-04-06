const express = require('express');
const router = express.Router();
const locales = require('./../locales.json');

// root
router.get('/', (req, res) => {
    res.render('index', {
        en: locales.en,
        ru: locales.ru
    });
});


module.exports = router;