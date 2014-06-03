
var exec =  require('child_process').exec,
    child;

var activo = false,
    hora = 20;

if (activo){
    var shutdown = 'sudo "/sbin/shutdown -h" | at '+hora+':00';

    child = exec(shutdown, function(error, stdout, stderr) {
        if (error !== null){
            console.log('exec error: '+error);
        }
        else{
            // Se ha programado el apagado del sistema
            console.log('>> El sistema se apagará a las:');
            console.log('>> '+hora);
        }
    });
}