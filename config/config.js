var path = require('path'),
    rootPath = path.normalize(__dirname + '/..'),
    env = process.env.NODE_ENV || 'development';

var config = {
    development: {
        root: rootPath,
        app: {
            name: 'yeoman-app-express'
        }
    },

    test: {
        root: rootPath,
        app: {
            name: 'yeoman-app-express'
        }
    },

    production: {
        root: rootPath,
        app: {
            name: 'yeoman-app-express'
        }
    }
};

module.exports = config[env];