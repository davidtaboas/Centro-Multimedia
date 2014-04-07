module.exports = function(app){

    messages = [{msg: "mundo", priority: "2", date: "2014-04-07T14:15:37.670Z"}];

    app.get('/messages', function(req,res){
        res.send(messages);
    });

    app.post('/messages', function(req,res){
        messages.push(req.body);
        res.send(messages);
    });



};