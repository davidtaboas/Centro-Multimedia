

var runningPortMonitor = 5555;
var runningPortApi     = 7777;

module.exports = function (server, eventos) {


    var login_eventos = eventos;
    login_eventos.sort (function(){
        return 0.5 - Math.random();
    });


    var iousers = require('socket.io').listen(server);
    var iomonitor = require('socket.io').listen(runningPortMonitor);
    var apimessage = require('socket.io').listen(runningPortApi);

    iousers.set('log level', 2);
    iomonitor.set('log level', 2);

    var idmonitor;
    iomonitor.sockets.on('connection', function (socketserver) {
        idmonitor = socketserver.id;

    });

    iousers.sockets.on('connection', function (socket) {

        iomonitor.sockets.socket(idmonitor).emit('login', {login: login_eventos[0]});

        socket.on('move', function (data) {
            console.log('********');
            console.log(data);
            console.log('********');
            iomonitor.sockets.socket(idmonitor).emit('move', {move: data});
        });

        socket.on('control', function (data) {

            iomonitor.sockets.socket(idmonitor).emit('control', {move: data});
        });

        socket.on('change', function (data) {
            iomonitor.sockets.socket(idmonitor).emit('change', {change: data});
        });

        socket.on('filtermsgs', function(data) {
            iomonitor.sockets.socket(idmonitor).emit('filter', {filter: data});
        });

        // Validación de login
        socket.on('loginevent', function(data) {
            console.log("He realizado: "+data);
            console.log("Deberia haber realizado: "+login_eventos[0]);
            if (data === login_eventos[0]){
                console.log("LOGIN OK");
                iousers.sockets.emit('login', {login: "ok"});
                iomonitor.sockets.socket(idmonitor).emit('login', {login: "ok"});
            }
            else{
                console.log("LOGIN FAIL");
                iousers.sockets.emit('login', {login: "error"});
                login_eventos.sort (function(){
                    return 0.5 - Math.random();
                });
                iomonitor.sockets.socket(idmonitor).emit('login', {login: login_eventos[0]});
            }

        });

    });


    // Socket de API
    apimessage.sockets.on('connection', function (socket) {

        socket.on('message', function (event) {


            var mensaje = JSON.parse(event);


            if( Object.keys(mensaje).length > 0 ){

                iomonitor.sockets.socket(idmonitor).emit('msg', {msg: mensaje});
            }
            else{

                console.log('Error de bulto');


            }
        });
        socket.on('disconnect', function () {

        });
    });




};

