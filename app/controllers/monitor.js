module.exports = function(app){
  
    
    app.get('/monitor', function(req,res){
        res.render('monitor/index', {
          title: 'Monitor'
        });    
    });
    

};