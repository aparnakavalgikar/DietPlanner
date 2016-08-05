var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var _ = require('lodash');

//Create Application
var app = express();

//Add Middleware required for REST-API's
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + '/../client/app'));
app.use(bodyParser.json());
app.use(methodOverride('X-HTTP-Method-Override'));

//CORS Support 
app.use(function(req, res, next) {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
	res.header('Access-Control-Allow-Headers', 'Content-Type');
	next();
});

//Load Model
app.models = require('./models/index');

//Load Route
var routes = require('./routes');	

_.each(routes, function(controller, route){
	app.use(route, controller(app, route));
});
	
//Connect to MongoDB
mongoose.connect('mongodb://localhost/dietplanner');
mongoose.connection.once('open', function() {
	console.log('Listening to port 3000....');
	app.listen(3000);
});