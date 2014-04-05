var RUNNING_PORT = 1337; // <- if you change this, you need to change in public/js/client||monitor/app.js and recompile
'use strict';

var request = require('request');
var path = require('path');

module.exports = function (grunt) {
  // show elapsed time at the end
  require('time-grunt')(grunt);
  // load all grunt tasks
  require('load-grunt-tasks')(grunt);

  var reloadPort = 35729, files;

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    develop: {
      server: {
        file: 'server.js'
      }
    },
    // shell: {
    //   mongo: {
    //     command: "mongod --dbpath "+path.resolve()+"/data",
    //     options: {
    //         async: true
    //     }
    //   },
    //   options: {
    //     stdout: false,
    //     stderr: true,
    //     failOnError: true
    //   }
    // },
    compass: {
      dist: {
        options: {
          importPath: ['public/components/sass-bootstrap/lib', 'public/components/components-font-awesome/scss'],
          cssDir: 'public/css',
          sassDir: 'assets/sass',
          //images_dir: 'public/img',
          //javascripts_dir: 'public/js',
          force: true
        }
      }
    },
    coffee: {
      glob_to_multiple: {
        options: {
          bare: true
        },
        expand: true,
        flatten: false,
        cwd: 'assets/jsdev/',
        src: ['**/*.coffee'],
        dest: 'public/js/',
        ext: '.js'
      }
    },
    open : {
        chrome : {
          path: 'http://localhost:'+RUNNING_PORT+'/',
          app: 'Google Chrome'
        },
        subl : {
          path: '.',
          app: 'Sublime Text'
        }
    },
    imagemin: {                          // Task
      dynamic: {                         // Another target
        files: [{
          expand: true,                  // Enable dynamic expansion
          cwd: 'assets/img',                   // Src matches are relative to this path
          src: ['**/*.{png,jpg,gif}'],   // Actual patterns to match
          dest: 'public/img'                  // Destination path prefix
        }]
      }
    },
    watch: {
      options: {
        nospawn: true,
        livereload: reloadPort
      },
      js: {
        files: [
          'server.js',
          'app/**/*.js',
          'config/*.js'
        ],
        tasks: ['develop', 'delayed-livereload']
      },
      jade: {
        files: ['app/views/**/*.jade'],
        options: { livereload: reloadPort }
      },
      compass: {
            files: ['assets/sass/**/*.{scss,sass}'],
            tasks: ['compass']
      },
      coffee: {
            files: ['assets/jsdev/**/*.coffee'],
            tasks: ['coffee']
      },
      imagemin:{
            files: ['assets/img/**/*.{png,jpg,gif}'],
            tasks: ['imagemin']
      }
    }
  });

  grunt.config.requires('watch.js.files');
  files = grunt.config('watch.js.files');
  files = grunt.file.expand(files);

  grunt.registerTask('delayed-livereload', 'Live reload after the node server has restarted.', function () {
    var done = this.async();
    setTimeout(function () {
      request.get('http://localhost:' + reloadPort + '/changed?files=' + files.join(','),  function(err, res) {
          var reloaded = !err && res.statusCode === 200;
          if (reloaded)
            grunt.log.ok('Delayed live reload successful.');
          else
            grunt.log.error('Unable to make a delayed live reload.');
          done(reloaded);
        });
    }, 500);
  });

  grunt.registerTask('default', ['develop', 'coffee', 'imagemin', 'compass', 'open:chrome', 'open:subl', 'watch']);
};
