

module.exports = function(agenda) {

    moment = require('moment'),
    fs = require('fs'),
    path = require('path'),
    rootPath = path.normalize(__dirname + '/');


    agenda.define('apagar sistema', {priority: 'high', concurrency: 10}, function(job, done) {
        var data = job.attrs.data,
        horaProgramada = "";

        fs.readFile(rootPath+'horaApagado.txt','utf8', function (err, read) {
          if (err) throw err;
          horaProgramada = read;
        });

        if(moment(data.hora).isAfter(horaProgramada)){
            var exec = require('child_process').exec,
                child;

            child = exec('shutdown -h now',
              function (error, stdout, stderr) {
                if (error !== null) {
                  console.log('exec error: ' + error);
                }
            });
        }
    });
    agenda.every('30 minutes', 'apagar sistema', {hora: moment().format('H:m')});
    agenda.start();

};