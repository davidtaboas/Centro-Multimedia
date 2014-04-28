module.exports = function(app){


    app.get('/monitor', function(req,res){
        res.render('monitor/index', {
          title: 'Monitor'
        });
    });

    app.get('/monitor/:name', function(req,res){
        var name = req.params.name;
        res.render('partials/partial' + name);
    });

};