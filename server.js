/*************************************
//
// socketio app
//
**************************************/





// express magic
var express = require('express'),
	mongoose = require('mongoose'),
	fs = require('fs'),
	config = require('./config/config');



/*
Para conectar con mongod cuando haga falta
mongoose.connect(config.db);
var db = mongoose.connection;
db.on('error', function () {
  throw new Error('unable to connect to database at ' + config.db);
});
*/

var modelsPath = __dirname + '/app/models';
fs.readdirSync(modelsPath).forEach(function (file) {
  if (file.indexOf('.js') >= 0) {
    require(modelsPath + '/' + file);
  }
});

var app = express();
var appmonitor = express();


var server = require('http').createServer(app);
var serverserver = require('http').createServer(appmonitor);


var device  = require('express-device');

require('./config/express')(app, config);

/* 
Views 
*/
app.set('views', [
    config.root + '/app/views',
    config.root + '/modules/videos/views']
    );

/*
Controllers
*/
require(config.root + '/app/controllers/client')(app);
require(config.root + '/app/controllers/monitor')(app);
require(config.root + '/modules/videos/controller')(app);

require('./config/sockets')(server, serverserver);

