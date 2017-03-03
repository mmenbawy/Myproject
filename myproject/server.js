var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var flash = require('connect-flash');
var flash = require('req-flash');
var cookieParser = require('cookie-parser');
var session = require('express-session');


var expressValidator = require('express-validator');
var app = express();

app.use(expressValidator());
app.use(cookieParser());
app.use(session({ secret: '123' }));


var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/HelloData');
var db = mongoose.connection;

var index = require('./routes/index'); //index page-home page
var tasks = require('./routes/tasks');

var port = 8000;

//view Engine
app.set('views', path.join(__dirname, 'views')); //our views in views folder
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile); // render files with ejs extensions

// Set Static Folder-- store in angular2 staff
app.use(express.static(path.join(__dirname, '/client')));
//app.use('/client', express.static('/client'));

// Body Parser MW
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//creating our routes 
app.use('/', index); //the slash is the home page/ asociate with index page
app.use('/users', tasks);


app.listen(port, function() {
    console.log('Server started on port ' + port);
})