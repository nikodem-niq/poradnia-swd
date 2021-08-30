var express = require('express');
var router = express.Router();
var login = require('../controller/authenticate/login');

/* GET users listing. */
router.get('/', function (req, res, next) {
    res.redirect('/users/login');
});

/* GET users listing. */
router.post('/login', function (req, res, next) {

        const pin = req.body.pin;
        let loginResult = login(pin);
            if (loginResult) {
                const PIN_Obj = {pin};
                res.cookie("userData", PIN_Obj);
                res.render('report.pug');
            } else {
                res.render('index.pug', {
                    error: true
                });
            }
        });
module.exports = router;