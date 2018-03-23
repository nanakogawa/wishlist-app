require('dotenv').config();

var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var hoganExpress = require('hogan-express');
var engine = hoganExpress;
var routes = require('./routes/index');

var app = express();
var port = process.env.PORT;

// Register '.html' extension with Mustache Express
app.engine('html', engine);

// View engine setup
app.set('view engine', 'html');
app.set('views', path.join(__dirname, 'views'));
app.set('partials', {
  head: 'partials/head',
  promo: 'partials/promo',
  navbar: 'partials/navbar',
  footer: 'partials/footer'
});

// Enable cache
app.enable('view cache');

// Body Parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// Set static path
app.use(express.static(path.join(__dirname, 'public')));

// Set main domain route
app.use('/', routes);

app.listen(port);
console.log('Listening to port:', port);
