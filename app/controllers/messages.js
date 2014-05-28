var mongoose = require('mongoose'),
    moment  = require('moment'),
    Mensaje = mongoose.model('Mensaje');



module.exports = function(app){

    // Guarda nuevo mensaje
    app.post('/messages', function(req,res){


        var mensaje             = new Mensaje();
        var ahora               = moment(new Date());
        mensaje.prioridad       = req.body.msg.prioridad;
        mensaje.texto           = decodeURI(req.body.msg.texto).replace( /\+/g, ' ' );
        mensaje.fechaEnvio      = ahora;
        mensaje.fechaExpiracion = ahora.add('hours',req.body.msg.expiracion);


        mensaje.save(function(err){

        });


    });

    // Devuelve la lista de mensajes con filtro
    app.get('/messages/:filter', function(req,res){

        var prioridad;

        if (req.params.filter == "app") {
            // Mensajes filtrados <2
            prioridad = 1;
        }
        else {
            // Mensajes no filtrados
            prioridad = 2;
        }


        var query = Mensaje.find({
            prioridad: { $lte: prioridad },
            fechaExpiracion: { $gte: new Date() }
        });

        query.exec(function (err, docs) {

            res.send(docs);
        });
    });

};