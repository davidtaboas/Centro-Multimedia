var RUNNING_PORT = 1337; // <- if you change this, you need to change in public/js/client||monitor/app.js and recompile
'use strict';

var request = require('request');
var path = require('path');

module.exports = function (grunt) {

  var target = grunt.cli.tasks[0] || 'dev';

  // show elapsed time at the end
  require('time-grunt')(grunt);
  // load all grunt tasks
  require('load-grunt-tasks')(grunt);

  var reloadPort = 35729, files;

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    develop: {
      // tarea para aplicación en desarrollo
      dev: {
        file: 'server.js',
        env: {NODE_ENV: 'development'}
      },
      // tarea para aplicación en producción
      prod: {
        file: 'server.js',
        env: {NODE_ENV: 'production'}
      }
    },
    copy: {
        main: {
          files: [{
              expand: true,
              cwd: 'modules',
              src: ['**/*.{js,css,png,jpg,gif}', '!**/config.js', '!**/index.jade'],
              dest: 'public/monitor'
          }]
        }
    },
    compass: {
      dev: {
        options: {
          environment: 'development',
          importPath: ['public/components/sass-bootstrap/lib', 'public/components/components-font-awesome/scss'],
          cssDir: 'public/css',
          sassDir: 'assets/sass',
          //images_dir: 'public/img',
          //javascripts_dir: 'public/js',
          force: true
        }
      },
      prod: {
        options: {
          environment: 'production',
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
        usuario: {
          path: 'http://tec.citius.usc.es/mando-cocina/',
          app: 'Google Chrome'
        },
        pantalla: {
          path: 'http://localhost:'+RUNNING_PORT+'/monitor',
          app: 'Google Chrome'
        },
        kiosko: {
            path: 'http://localhost:'+RUNNING_PORT+'/monitor',
            app: 'google-chrome --kiosk'
        },
        subl: {
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
        files: ['app/views/**/*.jade', 'modules/**/*.jade'],
        options: { livereload: reloadPort }
      },
      compass: {
            files: ['assets/sass/**/*.{scss,sass}'],
            tasks: ['compass' + target]
      },
      coffee: {
            files: ['assets/jsdev/**/*.coffee'],
            tasks: ['coffee']
      },
      imagemin:{
            files: ['assets/img/**/*.{png,jpg,gif}'],
            tasks: ['imagemin']
      },
      copy:{
        files: ['modules/**/*', '!**/index.jade', '!**/config.js'],
        tasks: ['copy']
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

  // alias de tareas para desarrollo
  grunt.registerTask('default', ['develop:dev', 'coffee', 'imagemin', 'compass:dev', 'copy', 'open:usuario','open:pantalla', 'open:subl', 'watch']);
  // alias de tareas para producción
  grunt.registerTask('prod', ['develop:prod', 'coffee','imagemin', 'compass:prod', 'copy', 'open:kiosko', 'watch']);

};
