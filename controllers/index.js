//Express.js is for handling the Model, View, Controller architecture.
//Helps managing routing, requests and views.
var express = require('express');

//http://expressjs.com/4x/api.html#router
var router = express.Router();

//router.METHOD(path, [callback, ...] callback)
//Egy HTML metódust meghív a path-on, majd végrehajtja a callbacket.
router.get('/', function(req, res) {
    //Renders a view and sends the rendered HTML string to the client.
    res.render('index');
});

module.exports = router;