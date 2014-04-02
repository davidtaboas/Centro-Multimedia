var express = require('express');

function enable_multiple_view_folders() {
    // Monkey-patch express to accept multiple paths for looking up views.
    // this path may change depending on your setup.
    var View = require("../node_modules/express/lib/view"),
        lookup_proxy = View.prototype.lookup;

    View.prototype.lookup = function(viewName) {
        var context, match;
        if (this.root instanceof Array) {
            for (var i = 0; i < this.root.length; i++) {
                context = {root: this.root[i]};
                match = lookup_proxy.call(context, viewName);
                if (match) {
                    return match;
                }
            }
            return null;
        }
        return lookup_proxy.call(this, viewName);
    };
}
enable_multiple_view_folders();

module.exports = function (app, config) {
    app.configure(function () {
        app.use(express.compress());
        app.locals.basedir = config.root;
        app.use(express.static(config.root + '/public'));
        app.set('port', config.port);
        app.set('view engine', 'jade');
        app.set('view options', {layout: true});
        app.use(express.favicon(config.root + '/public/img/favicon.ico'));
        app.use(express.logger('dev'));
        app.use(express.bodyParser());
        app.use(express.methodOverride());
        app.use(app.router);

    });
};
