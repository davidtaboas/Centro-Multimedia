module.exports = function (app) {


    app.get('/videos', function (req, res) {
        res.render('videos/index', {
            title: 'Videos'

        });
    });


};