

var runningPortMonitor = 5555;
var runningPortApi     = 7777;

module.exports = function (server, eventos) {


    var login_eventos = eventos;



    var iousers = require('socket.io').listen(server);
    var iomonitor = require('socket.io').listen(runningPortMonitor);
    var apimessage = require('socket.io').listen(runningPortApi);

    iousers.set('log level', 2);
    iomonitor.set('log level', 2);

    var idmonitor,
        usuarioActivo = -1;

    var allClients = [];

    iomonitor.sockets.on('connection', function (socketserver) {
        idmonitor = socketserver.id;

    });


    // GESTIÓN DE USUARIOS



    iousers.on('connection', function (socket) {

        /*
        Aquí se reconoce que se conecta un usuario
        Por lo tanto, lo hacemos activo o estará en espera
        */

        allClients.push(socket);
        socket.emit('login', {login: "go"});
        if(usuarioActivo!=-1){
            socket.emit('login', {login: "wait"});
        }
        console.log("Se acaba de conectar el socket id: "+socket.id);


        socket.on('disconnect', function(){
            console.log('SE HA DESCONECTADO');
            var i = allClients.indexOf(socket);
            if(socket == usuarioActivo)
                usuarioActivo=-1;
            delete allClients[i];
            iousers.sockets.emit("login", {login: "go"});

        });

        socket.on('monitor', function(data){

            if(usuarioActivo==-1){
                // No hay usuario activo, por lo tanto lanzamos al monitor el patrón de registro

                // Antes mezclamos los eventos para la identificación
                login_eventos.sort (function(){
                    return 0.5 - Math.random();
                });

                iomonitor.sockets.socket(idmonitor).emit('login', {login: login_eventos[0]});
            }
            else{

                console.log('YA HAY UN USUARIO CONECTADO')

            }
        });

        socket.on('move', function (data) {
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

                // Asignamos el usuario activo
                usuarioActivo = socket;


                // Enviamos al usuario activo que se ha identificado correctamente
                socket.emit('login', {login: "ok"});
                // Enviamos al resto de usuarios que otro se ha identificado
                socket.broadcast.emit('login', {login: "wait"});

                // Indicamos al monitor que se ha identificado correctamente alguien
                iomonitor.sockets.socket(idmonitor).emit('login', {login: "ok"});
            }
            else{
                console.log("LOGIN FAIL");

                if(usuarioActivo==-1){


                    // Indicamos al usuario que ha fallado en su intento
                    socket.emit('login', {login: "error"});

                    // Volvemos a mezclar eventos y enviamos a monitor el login correcto
                    login_eventos.sort (function(){
                        return 0.5 - Math.random();
                    });
                    iomonitor.sockets.socket(idmonitor).emit('login', {login: login_eventos[0]});

                }
                else{
                    // Indicamos al usuario que hay un usuario activo
                    // Con esto evitamos choques de identificaciones
                    socket.emit('login', {login: "wait"});
                }


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

