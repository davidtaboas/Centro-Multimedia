
module.exports = function(app){
    function filterMsgs(element) {
        return element.priority < 2;
    }

    filter = "all";

    messages = [{msg: "mundo", priority: "2", date: "2014-04-07T14:15:37.670Z"}];

    app.get('/messages', function(req,res){
        filterMessages = [];

        if (filter == "app") {
            filterMessages = messages.filter(filterMsgs);
        }
        else {
            filterMessages = messages;
        }

        res.send(filterMessages);
    });

    app.post('/messages', function(req,res){
        messages.push(req.body);
        res.send(messages);
    });


    app.get('/messages/:filter', function(req,res){

        filter = req.params.filter;
        filterMessages = [];

        if (filter == "app") {
            filterMessages = messages.filter(filterMsgs);
        }
        else {
            filterMessages = messages;
        }

        res.send(filterMessages);
    });

    app.get('/lastmessage', function(req, res){
        filterMessages = [];
        if (filter == "app") {
            filterMessages = messages.filter(filterMsgs);
        }
        else {
            filterMessages = messages;
        }

        res.send(filterMessages[filterMessages.length-1]);

    });

};