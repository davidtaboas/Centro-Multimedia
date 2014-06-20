var path = require('path'),
    rootPath = path.normalize(__dirname + '/..'),
    env = process.env.NODE_ENV || 'development';

var config = {
    development: {
        root: rootPath,
        app: {
            name: 'centrosocial'
        },
        port: 3000,
        db: 'mongodb://localhost/centrosocial-development'
    },
    test: {
        root: rootPath,
        app: {
            name: 'centrosocial'
        },
        port: 3000,
        db: 'mongodb://localhost/centrosocial-test'
    },

    production: {
        root: rootPath,
        app: {
            name: 'centrosocial'
        },
        port: 3000,
        db: 'mongodb://localhost/centrosocial-production'
    }
};

module.exports = config[env];