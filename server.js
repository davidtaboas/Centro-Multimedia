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


// Aplicación general
var app = express();
// Aplicación auxiliar para Socket
var appmonitor = express();
// Aplicación auxiliar para API
var appapi = express();

// Servidor de Cliente Usuario
var server = require('http').createServer(app);
// Servidor de Cliente Monitor
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


/*
Configuración Sockets
*/
require('./config/sockets')(server, serverserver);



/*
Lanzamos servidores
*/

var runningPortNumber = 1337;
var runningPortMonitor = 5555;


serverserver.listen(runningPortMonitor);
server.listen(runningPortNumber);