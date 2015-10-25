var express = require('express');
var router = express.Router();

//Tennivalók dekorálása
////Hozzárendeli minden tömbbeli elemhez a megfelelő classokat és állapot neveket, hogy így szépen megkülönböztethetőek legyenek majd az oldalon.
var decorateTodos = require('../viewmodels/todos');


//Todolista oldal
router.get('/list', function(req, res) {
    //req.app: holds a reference to the instance of the express application
    //.models: modellek.todo prototípus
    //.find(): returns a value in the array, if an element in the array satisfies the provided testing function.
    //.then: The then() method returns a Promise. It takes two arguments, both are callback functions for the success and failure cases of the Promise.
    //Itt csak success van
    req.app.models.todo.find().then(function(todos) {
        //Success esetén rendereljük a todos/list viewt (kiírjuk a todokat).
        res.render('todos/list', {
            //Dekoráljuk a todokat
            todos: decorateTodos(todos),
            //Hibaüzenetek
            messages: req.flash('info')
        });
    });
});

//Todo felvétele oldal
router.get('/new', function(req, res) {
    //Ha van validálási hibaüzenet (pl.: nincs bejelentkezve a user), akkor a validationErrors értéke abból jön. Ha nincs, akkor egy üres objektumból.
    var validationErrors = (req.flash('validationErrors') || [{}]).pop();
    var data = (req.flash('data') || [{}]).pop();
    
    res.render('todos/new', {
        validationErrors: validationErrors,
        data: data
    });
});

//Hiba felvétele post
router.post('/new', function(req, res) {
    //Sanitizes the specified parameter (using 'dot-notation' or array), the parameter will be updated to the sanitized result. Cannot be chained, and will return the result.
    req.sanitizeBody('leiras').escape();
    
    //checkbody(): Starts the validation of the specifed parameter, will look for the parameter in req in the order params, query, body, then validate, you can use 'dot-notation' or an array to access nested values.
    //notEmpty(): nem üres a request body-jában a 'leiras'.
    //withMessage(): A megadott üzenetet kiírja
    req.checkBody('leiras', 'Hibás leírás').notEmpty().withMessage('Kötelező megadni');
    req.checkBody('dueDate', 'Hibás dátum').notEmpty().withMessage('Kötelező megadni');
    
    //express-validatorból
    //Return an array of errors
    var validationErrors = req.validationErrors(true);
    console.log(validationErrors);
    
    if(validationErrors) {
        //Ha validációs hibák vannak, akkor 
        //Flasheljük a hibaüzeneteket és a postolni szánt adatokat
        //Flash: It's a type of user data that you show once and then destroy. Usually a top alert like "Your action has been successful" or similar.
        req.flash('validationErrors', validationErrors);
        req.flash('data', req.body);
        //Visszairányítunk az errors/new oldalra
        res.redirect('/todos/new');
    } else {
        
        req.app.models.todo.create({
            //Ezekkel az adatokkal hozzuk létre az új teendőt
            status: 'pending',
            description: req.body.leiras,
            dueDate: req.body.dueDate,
            assigner: req.body.nickname,
        })
        .then(function (todo) {
            //sikerült a mentés
            req.flash('info', 'Teendő sikeresen felvéve!');
            res.redirect('/todos/list');
        })
        .catch(function(err) {
           //Ha hibatörtént, kiírjuk
            console.log(err);
        });
    }
});

module.exports = router;




















