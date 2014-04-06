

var runningPortMonitor = 5555;
var runningPortApi     = 7777;

module.exports = function (server) {

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

    });


    // Socket de API
    apimessage.sockets.on('connection', function (socket) {

        socket.on('message', function (event) {
            var salida = JSON.parse(event);
            if( salida.msg && salida.prioridad ){
                iomonitor.sockets.socket(idmonitor).emit('msg', {msg: salida.msg, priority: salida.prioridad, date: new Date()});
            }
            else{

                console.log('Error de bulto');


            }
        });
        socket.on('disconnect', function () {
            console.log('++++++');
            console.log('Server has disconnected');
            console.log('++++++');
        });
    });




};

