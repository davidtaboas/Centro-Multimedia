

var runningPortMonitor = 5555;
var runningPortApi     = 7777;

var exec =  require('child_process').exec,
    child,
    os = require('os'),
    sistemaoperativo = os.platform();

module.exports = function (server, config) {


    var login_eventos = eventos;



    var iousers = require('socket.io').listen(server);
    var iomonitor = require('socket.io').listen(runningPortMonitor);
    var apimessage = require('socket.io').listen(runningPortApi);

    iousers.set('log level', 2);
    iomonitor.set('log level', 2);

    var idmonitor,
        usuarioActivo = -1;

    var allClients = [];

    // Conexión del monitor
    iomonitor.sockets.on('connection', function (socketserver) {
        idmonitor = socketserver.id;

        socketserver.on("config", function(data){

            console.log(data);
            if (data.protegido === '1'){

                // si hay un usuario activo, lo sacamos
                if(usuarioActivo!=-1){

                    usuarioActivo.emit("login", {login: "disconnect"});
                }
                // indicamos un usuario activo neutral
                usuarioActivo = 0;

                // indicamos que se muestre la pantalla
                socketserver.emit("login", {login: "ok"});


            }
            else if (data.protegido == '0'){

                // si cambiamos a modo desprotegido y no hay usuarios o protegido
                if(usuarioActivo==-1 || usuarioActivo == 0){

                    usuarioActivo = -1;
                    iousers.sockets.emit("login", {login: "go"});
                }
            }
        });

        socketserver.on("controlBotones", function (data){

            iousers.sockets.emit('botonesUsuario', {button: data.id, label: data.label});
        });

    });


    // GESTIÓN DE USUARIOS
    iousers.on('connection', function (socket) {


        console.log(">>Todos los clientes: "+allClients.length);
        // Si no hay clientes conectados, despertamos el monitor
        if (allClients.length == 0){

            // comando segun plataforma
            if(sistemaoperativo == "darwin"){
                //mac
                wakeup = "SleepDisplay -wake";
            }
            else if(sistemaoperativo == "linux"){
                // linux
            }
            else if(sistemaoperativo == "win32"){
                //windows

            }


            child = exec(wakeup, function(error, stdout, stderr) {
                if (error !== null){
                    console.log('exec error: '+error);
                }
                else{
                    // Se ha encendido la pantalla
                }
            });
        }


        // Identificación de un usuario
        allClients.push(socket);
        console.log(">>Todos los clientes: "+allClients.length);

        socket.emit('login', {login: "go"});

        if(usuarioActivo!=-1){
            socket.emit('login', {login: "wait"});
        }
        console.log("Se acaba de conectar el socket id: "+socket.id);

        // Desconexión de usuarios
        socket.on('disconnect', function(){
            console.log('Se ha desconectado un cliente.');
            var i = allClients.indexOf(socket);
            if(socket == usuarioActivo){
                console.log('El usuario desconectado era el activo')
                usuarioActivo=-1;
                iomonitor.sockets.socket(idmonitor).emit('control', {move: "home"});
            }

            // Eliminamos el cliente de la lista
            if(i > -1){
                allClients.splice(i, 1);
            }


            // Si no quedan clientes en la cola de espera procedemos a poner el monitor en espera

            if (allClients.length == 0){

                // comando segun plataforma
                if(sistemaoperativo == "darwin"){
                    //mac
                    sleep = "SleepDisplay";
                }
                else if(sistemaoperativo == "linux"){
                    // linux
                }
                else if(sistemaoperativo == "win32"){
                    //windows

                }
                child = exec(sleep, function(error, stdout, stderr) {
                    if (error !== null){
                        console.log('exec error: '+error);
                    }
                    else{
                        // Se ha apagado la pantalla
                    }
                });
            }

            // Si no hay un usuario contralando la aplicación indicamos que se puede proceder a la identificación
            if(usuarioActivo==-1){
                iousers.sockets.emit("login", {login: "go"});
            }

        });

        // Gestion del monitor
        socket.on('monitor', function(data){


            if(usuarioActivo === -1){
                // No hay usuario activo, por lo tanto lanzamos al monitor el patrón de registro

                // Antes mezclamos los eventos para la identificación
                login_eventos.sort (function(){
                    return 0.5 - Math.random();
                });

                iomonitor.sockets.socket(idmonitor).emit('login', {login: login_eventos[0]});
            }
            else{

                console.log('Ya existe un usuario identificado.')

            }
        });


        socket.on('mensaje', function(data) {

            var mensaje = { texto: data.texto, prioridad: '2', expiracion: data.caducidad }
            iomonitor.sockets.socket(idmonitor).emit('msg', {msg: mensaje});
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


        socket.on('botonesMonitor', function(data) {
            iomonitor.sockets.socket(idmonitor).emit('button', {id: data});
        });


    });



    // Socket de API
    apimessage.sockets.on('connection', function (socket) {

        socket.on('message', function (event) {


            var mensaje = JSON.parse(event);

            console.log(mensaje);

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

