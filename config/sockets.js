
var runningPortNumber = 1337;
var runningPortMonitor = 5555;

module.exports = function (server, serverserver) {

    var iousers = require('socket.io').listen(server);
    var iomonitor = require('socket.io').listen(serverserver);

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

    });


    serverserver.listen(runningPortMonitor);
    server.listen(runningPortNumber);

};

