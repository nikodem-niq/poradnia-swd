const express = require('express');
const router = express.Router();
const login = require('../controller/authenticate/login');
const generateKey = require('generate-key');
const sessionStorage = require('sessionstorage');

/* GET users listing. */
router.get('/', function (req, res, next) {
    res.redirect('/users/login');
});

/* GET users listing. */
router.post('/login', function (req, res, next) {

        const pin = req.body.pin;
        let loginResult = login(pin);
            if (loginResult[0]) {
                res.cookie("userData", loginResult[1]);
                sessionStorage.setItem('user', loginResult[1]);
               // res.render('report.pug');
               res.redirect('/')
            } else {
                res.render('index.pug', {
                    error: true
                });
            }
        });
module.exports = router;