module.exports = function(app, eventos){



    app.get('/', function(req, res){
        res.render('client/index', {
          title: 'Cliente',
          array_eventos: eventos
        });
    });


};