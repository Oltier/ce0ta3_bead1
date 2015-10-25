var express = require('express');

//Node-js body-parser. a post body-ját tudjuk fele elemezni
var bodyParser = require('body-parser');
//Request részeit tudjuk vele validálni
var expressValidator = require('express-validator');
//Create a session middleware with the given options.
//Note Session data is not saved in the cookie itself, just the session ID. Session data is stored server-side.
var session = require('express-session');
var flash = require('connect-flash');

//Adatbázissal kommunikálás
var Waterline = require('waterline');
var waterlineConfig = require('./config/waterline');

var indexController = require('./controllers/index');
var todoController = require('./controllers/todo');
var loginController = require('./controllers/login');

//viewengine for handlebars.js This will render .hbs files, when res.render is called
var hbs = require('hbs');

var blocks = {};

//?????
//Block helpers make it possible to define custom iterators and other functionality that can invoke the passed block with a new context.
//A list.hbs-ben levő
//{{#extend "scripts"}}
//<script src="/js/list.js"></script>
//{{/extend}}
//Részbe "extendeli" a scripteket
hbs.registerHelper('extend', function(name, context) {
    var block = blocks[name];
    if(!block) {
        block = blocks[name] = [];
    }
    
    block.push(context.fn(this));
});

hbs.registerHelper('block', function(name) {
    var val = (blocks[name] || []).join('\n');
    
    blocks[name] = [];
    return val;
});


//--------------------------
//Passport's sole purpose is to authenticate requests, which it does through an extensible set of plugins known as strategies. Passport does not mount routes or assume any particular database schema, which maximizes flexibility and allows application-level decisions to be made by the developer. The API is simple: you provide Passport a request to authenticate, and Passport provides hooks for controlling what occurs when authentication succeeds or fails.
var passport = require('passport');

//Passport strategy for authenticating with a membername and password.
//This module lets you authenticate using a membername and password in your Node.js applications. By plugging into Passport, local authentication can be easily and unobtrusively integrated into any application or framework that supports Connect-style middleware, including Express.
//Stratégia konfigurálása
var LocalStrategy = require('passport-local').Strategy;

//New session: serialize the userr and send it to the user as a cookie in the user's browser
//Each subsequent request will not contain credentials, but rather the unique cookie that identifies the session. In order to support login sessions, Passport will serialize and deserialize user instances to and from the session.
passport.serializeUser(function(member, done){
    done(null, member);
});
passport.deserializeUser(function(obj, done) {
    done(null, obj);
});

//Stratégia a regisztráláshoz
passport.use('local-signup', new LocalStrategy({
        usernameField: 'nickname',
        passwordField: 'password',
        passReqToCallback: true,
    },
    
    function(req, nickname, password, done) {
        req.app.models.member.findOne({ nickname: nickname }, function(err, member) {
            if(err) { return done(err); }
            //Ha talál ilyen becenevet, akkor hibát írunk ki.
            if(member) {
                return done(null, false, { message: 'Létező becenév.'});
            }
            //ES6
            //Object.create() method creates a new object with the specified prototype object and properties.
            req.app.models.member.create(req.body)
            //Prototype.then() ha sikerült, akkor ez történik
            .then(member => done(null, member))
            //Ha nem sikerül, (kivételkezelés) akkor hibaüzenetek. 
            .catch(err => done(null, false, {message: err.details }));
            
            //ES5
            /* req.app.models.member.create(req.body)
            .then(function (member) {
                return done(null, member);
            })
            .catch(function (err) {
                return done(null, false, { message: err.details });
            })*/
        });
    }
));


//Stratégia bejelentkezéshez
passport.use('local', new LocalStrategy({
        usernameField: 'nickname',
        passwordField: 'password',
        passReqToCallback: true,
    },
    
    //A memberek közt a nicknamekre megnézi, hogy van-e a paramétereben megadott nicknameű. Ha vmi hiba történt returnölünk a hibával.
    //Ha nincs ilyen member, vagy nem megfegelelő jelszót adott meg, akkor kiírjuk a helytelen adatok hibaüzenetet
    //Különben hiba nélkül visszatérünk és a member kap egy sessiont.
    function(req, nickname, password, done) {
        req.app.models.member.findOne({ nickname: nickname }, function(err, member) {
            if(err) { return done(err); }
            if(!member | !member.validPassword(password)) {
                return done(null, false, { message: 'Helytelen adatok.' });
            }
            return done(null, member);
        });
    }
    
));

//Segédfüggvények
function setLocalsForLayout() {
    return function(req, res, next) {
        //res.locals:
        //An object that contains response local variables scoped to the request, and therefore available only to the view(s) rendered during that request / response cycle (if any).
        res.locals.loggedIn = req.isAuthenticated();
        res.locals.user = req.user;
        next();
    }
}

function ensureAuthenticated(req, res, next) {
    //Ha a request autentikálva van (tehát van passport cookieja), akkor tovább mehetünk
    if(req.isAuthenticated()) { return next(); }
    //Ha nincs, akkor átirányítjuk a bejelentkező oldalra
    res.redirect('/login');
}

//Megnézi, hogy a megfelelő role be van-e állítva. pl.: ha később, ha szeretnénk különválasztani a szülőt és gyereket.
function andRestictTo(role) {
    return function(req, res, next) {
        if(req.user.role == role) {
            next();
        } else {
            next(new Error('Unauthorized'));
        }
    }
}


//EXPRESS

var app = express();

//app.use(): Mounts the middleware function(s) at the path. If path is not specified, it defaults to “/”.

//config
//Beállítjuk, hogy a views-ek milyen pathon elérhetők
app.set('views', './views');
//HBS-ből generálunk
app.set('view engine', 'hbs');

//Middleware
//Statikus dolgokhoz használja a public mappát
//express.static is the only built-in middleware in Express. It is based on serve-static, and is responsible for serving the static assets of an Express application.
app.use(express.static('public'));

//.urlencoded: Returns middleware that only parses urlencoded bodies. This parser accepts only UTF-8 encoding of the body and supports automatic inflation of gzip and deflate encodings.
//A new body object containing the parsed data is populated on the request object after the middleware (i.e. req.body). This object will contain key-value pairs, where the value can be a string or array (when extended is false), or any type (when extended is true).
app.use(bodyParser.urlencoded({extended: false}));
app.use(expressValidator());
app.use(session({
    //Session ID cookie settings: 
    //maxAge by default is null and will be destroyed, when user closes the browser
    //maxAge 60000 := 60000 ms-ig él
    cookie: { maxAge: 60000 },
    //This is the secret used to sign the session ID cookie. This can be either a string for a single secret, or an array of multiple secrets. If an array of secrets is provided, only the first element will be used to sign the session ID cookie, while all the elements will be considered when verifying the signature in requests.
    secret: 'dancing kitten',
    //Set it to false if the store implements touch method.
    resave: false,
    //Better for logins, reduces server storage
    saveUninitialized: false,
}));

app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

app.use(setLocalsForLayout());


//endpoints
app.use('/', indexController);
app.use('/todos', ensureAuthenticated, todoController);
app.use('/login', loginController);

app.get('/parent', ensureAuthenticated, andRestictTo('parent'), function(req, res){
    //Ends the response process. This method actually comes from Node core, specifically the response.end() method of http.ServerResponse.
    res.end('parent');
});

app.get('/logout', function(req, res) {
    //Invoking logout() will remove the req.user property and clear the login session (if any).
    req.logout();
    res.redirect('/');
})

//ORM adatbázishoz példány
var orm = new Waterline();
//Define your own collection (model) by extending the Waterline.Collection and load this model
orm.loadCollection(Waterline.Collection.extend(require('./models/todo')));
orm.loadCollection(Waterline.Collection.extend(require('./models/member')));

//ORM indítása
orm.initialize(waterlineConfig, function(err, models) {
    
    if(err) throw err;
    
    
    app.models = models.collections;
    app.connections = models.connections;
    
    //Cloud9 beállítások
    var port = process.env.PORT;
    var host = process.env.IP;
    var server = app.listen(port, host, function(){console.log('Server is started.');});
    
    console.log('ORM is started');
    
});




























