
function compare(a,b) {
  if (a.priority < b.priority)
     return -1;
  if (a.priority > b.priority)
    return 1;
  return 0;
}

module.exports = function(app){
    function filterMsgs(element) {
        return element.priority < 2;
    }

    filter = "all";

    messages = [{msg: "mundo", priority: "2", date: "2014-04-07T14:15:37.670Z"}];

    // Devuelve la lista de mensajes
    app.get('/messages', function(req,res){
        filterMessages = [];

        if (filter == "app") {
            filterMessages = messages.filter(filterMsgs);

        }
        else {
            filterMessages = messages;
        }
        filterMessages.sort(compare);
        res.send(filterMessages);
    });

    // Guarda nuevo mensaje
    app.post('/messages', function(req,res){
        messages.push(req.body);
        messages.sort(compare);
        res.send(messages);
    });

    // Devuelve mensajes filtrados
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

    // Devuelve último mensaje
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