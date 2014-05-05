var mongoose = require('mongoose'),
  Mensaje = mongoose.model('Mensaje');



module.exports = function(app){

    // Guarda nuevo mensaje
    app.post('/messages', function(req,res){


        var mensaje            = new Mensaje();

        mensaje.prioridad      = req.body.msg.prioridad;
        mensaje.texto          = decodeURI(req.body.msg.texto); // TO-DO: acordarse de limpiar cadena de texto %20
        mensaje.unidadDuracion = req.body.msg.uduracion;
        mensaje.escalaDuracion = req.body.msg.eduracion;

        mensaje.save(function(err){

        });


    });

    // Devuelve la lista de mensajes con filtro
    app.get('/messages/:filter', function(req,res){

        var prioridad;
        if (req.filter == "app") {
            // Mensajes filtrados <2
            prioridad = 1;
        }
        else {
            // Mensajes no filtrados
            prioridad = 2;
        }

        var query = Mensaje.find({
            prioridad: { $lte: prioridad }
        });
        query.exec(function (err, docs) {

            res.send(docs);
        });
    });

};