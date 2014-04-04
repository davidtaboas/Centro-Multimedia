module.exports = function (app) {


    app.get('/module/videos', function (req, res) {
        res.render('videos/index', {
            title: 'Videos'

        });
    });


};