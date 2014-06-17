/*************************************
//
// socketio app
//
**************************************/





// express magic
var express = require('express'),
	mongoose = require('mongoose'),
  Agenda = require('agenda'),
  agendaUI = require('agenda-ui'),
	fs = require('fs'),
	config = require('./config/config');




// COnexión a mongose
mongoose.connect(config.db);
var db = mongoose.connection;
db.on('error', function () {
  throw new Error('unable to connect to database at ' + config.db);
});


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

var agenda = new Agenda({db: { address: 'localhost:27017/agenda-example'}});

app.use('/agenda-ui', agendaUI(agenda, {poll: 1000}));

// Servidor de Cliente
var server = require('http').createServer(app);

var device  = require('express-device');

require('./config/express')(app, config);

/*
Views
*/
app.set('views', [
    config.root + '/app/views',
    config.root + '/modules/']
    );


/*
Definimos eventos
*/
eventos = ["doubleTap","swipeLeft","swipeRight","swipeUp","swipeDown","rotateLeft","rotateRight","pinchIn","pinchOut"];
/*
Controllers
*/
require(config.root + '/app/controllers/client')(app);
require(config.root + '/app/controllers/monitor')(app);
require(config.root + '/app/controllers/messages')(app);
/*
Configuración Sockets
*/

// Pasamos el servidor porque el cliente tiene que escuchar en esa ruta
// Los otros sockets pueden ir en otros puertos sin crear servidores
require('./config/sockets')(server, config);


// Cargamos la funcionalidad de apagado automático
require('./config/shutdown')(agenda);

/*
Lanzamos servidores
*/

var runningPortNumber = 1337;

server.listen(runningPortNumber);