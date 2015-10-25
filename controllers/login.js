var express = require('express');
//Passport a bejelentkezéshez passport.js
var passport = require('passport');

var router = express.Router();

//Megjelenítjuk a login/index.hbs-t ha hiba történt, akkor 
router.get('/', function(req, res) {
    res.render('login/index', {
        //connect-flash: hibaüzenetek megjelenítésére
        //https://github.com/jaredhanson/connect-flash
        errorMessages: req.flash('error')
    });
});

//Send POST method request
//A megadott adatok alapján, local stratégiával authentikálunk
//Sikeres authentikálás esetén átirányítjuk az todos/list-re (tennivalók listája)
//Sikertelen esetén átirányítjuk a login pagere még egy bejelentkezésére, majd kiírjuk a hibákat
router.post('/', passport.authenticate('local', {
    successRedirect: '/todos/list',
    failureRedirect: '/login',
    failureFlash: true,
    badRequestMessage: 'Hiányzó adatok'
}));


//Regisztrációs oldal
router.get('/signup', function(req, res) {
    res.render('login/signup', {
        errorMessages: req.flash('error')
    });
});

router.post('/signup', passport.authenticate('local-signup', {
    successRedirect: '/login',
    failureRedirect: '/login/signup',
    failureFlash: true,
    //badRequestMessage: 'Hiányzó adatok'
}));

module.exports = router;