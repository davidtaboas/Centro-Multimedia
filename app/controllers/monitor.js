var path = require('path'),
    rootPath = path.normalize(__dirname + '/../..'),
    modulesPath = rootPath + '/modules';


module.exports = function(app){




    app.get('/monitor', function(req,res){

        // Cargamos los módulos con su configuración
        var fs = require('fs');

        modulos = new Array();
        fs.readdirSync(modulesPath).forEach( function (file) {

            if( !(/(^|.\/)\.+[^\/\.]/g).test(file) && file != "home"){

                datos = require(modulesPath+'/'+file+'/config');
                modulo = {
                    titulo: datos.titulo,
                    url: file,
                    // imagen: modulesPath+'/'+file+'/'+datos.imagen};
                    imagen: file+'/'+datos.imagen};
                modulos.push(modulo);
            }

        });

        res.render('monitor/index', {
          title: 'Monitor',
          modulos: modulos
        });
    });

    app.get('/modulo/:name', function(req,res){

        var name = req.params.name,
            modulo = require(modulesPath+'/'+name+'/config');



        // res.render('partials/partial' + name);
        res.render(name + '/index', {
            titulo: modulo.titulo
        });
    });

    app.get('/modulo/:name/config', function(req,res){

        var name = req.params.name,


            modulo = require(modulesPath+'/'+name+'/config');


        res.send(modulo);
    });

};