module.exports = function(app){



    app.get('/', function(req, res){
        res.render('users/index', {
          title: 'Cliente',
          array_eventos: eventos
        });
    });


};