module.exports = function(app){



    app.get('/', function(req, res){
        res.render('client/index', {
          title: 'Cliente',
          array_eventos: eventos
        });
    });


};