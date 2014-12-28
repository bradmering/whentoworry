//index.js/
var express             = require('express'),
    exphbs              = require('express-handlebars'),
    logger              = require('morgan'),
    cookieParser        = require('cookie-parser'),
    bodyParser          = require('body-parser'),
    methodOverride      = require('method-override'),
    session             = require('express-session'),
    passport            = require('passport'),
    LocalStrategy       = require('passport-local'),
    TwitterStrategy     = require('passport-twitter'),
    GoogleStrategy      = require('passport-google'),
    Mailgun             = require('mailgun-js'),
    FacebookStrategy    = require('passport-facebook'),
    mongo               = require('mongodb'),
    helmet              = require('helmet'),
    mongoose            = require('mongoose'),
    session             = require('express-session'),
    MongoStore          = require('connect-mongo')(session);

//We will be creating these two files shortly
var config    = require('./config.js'),
    funct     = require('./functions.js'), //funct file contains our helper functions for our Passport and database work
    cron      = require('./cron.js'), //funct file contains our helper functions for our Passport and database work
    Trips     = require('./models/Trips.js')
    Users     = require('./models/Users.js');
    
var twilio = require('twilio')(config.sms.sid, config.sms.token);

var app     = express(),
    router  = express.Router();

//===============EXPRESS================
// Configure Express
app.use(logger('combined'));

app.use(session({
    secret: config.session.secret,
    store: new MongoStore()
}));

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(methodOverride('X-HTTP-Method-Override'));
app.use(session({secret: 'supernova', saveUninitialized: true, resave: true}));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(__dirname + '/public'));
app.use(helmet());

// Session-persisted message middleware
app.use(function(req, res, next){
    next();
});

// Configure express to use handlebars templates
var hbs = exphbs.create({
    defaultLayout: 'main', //we will be creating this layout shortly
});

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

//===============ROUTES===============

//Static pages
router.route('/')
    .get(function(req, res){
        res.render('home', {user: req.user});
    });

router.route('/about')
    .get(function(req, res){
        res.render('about', {user: req.user});
    });
    
router.route('/contact')
    .get(function(req, res){
        res.render('contact', {user: req.user});
    });
    
router.route('/login')
    .get(function(req, res){
        res.redirect('/');
    })
    .post(function(req, res){
        var username = req.body.article;
        var password = req.body.password;
        console.log(username);
        console.log(password);
    });

router.route('/profile')
    .get(function(req, res){
        console.log('view profile');
    })
    .post(function(req, res){
        console.log('update profile');
    });
    
router.route('/expedition')
    .get(function(req, res){
        res.redirect('/');
    });  
  
router.route('/expedition/list')
    .get(function(req, res){
        console.log('view trips');
    });
    
router.route('/expedition/new')
    .get(function(req, res){
        console.log('new trip form');
    })
    .post(function(req, res){
        console.log('creating a new trip');
    })
    .put(function(req, res){
        console.log('creating a new trip');
    });
    
router.route('/expedition/:id')
    .get(function(req, res){
        console.log('view trip '+req.params.id);
    })
    .post(function(req, res){
        console.log('update trip '+req.params.id);
    })
    .delete(function(req, res){
        console.log('delete trip '+req.params.id);
    });

app.use('/', router);

//===============PORT=================
var port = process.env.PORT || 5000; //select your port or let it pull from your .env file
app.listen(port);
console.log("listening on " + port + "!");