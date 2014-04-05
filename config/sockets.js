

module.exports = function (server, serverserver) {

    var iousers = require('socket.io').listen(server);
    var iomonitor = require('socket.io').listen(serverserver);
    var apimessage = require('socket.io').listen(7777);

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


    // Socket de API
    apimessage.sockets.on('connection', function (socket) {
      socket.on('message', function (event) { 
        console.log('Received message from client!',event);
      });
      socket.on('disconnect', function () { 
        console.log('Server has disconnected');
      });
    });




};

