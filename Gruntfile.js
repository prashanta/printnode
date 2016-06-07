'use strict';

var request = require('request');

module.exports = function (grunt) {
   // show elapsed time at the end
   require('time-grunt')(grunt);
   // load all grunt tasks
   require('load-grunt-tasks')(grunt);

   var reloadPort = 35729, files;

   grunt.initConfig({
      pkg: grunt.file.readJSON('package.json'),

      bowercopy: {
         options: {
            clean: false, // Do not remove bower components folder
         },
         // CSS files
         css: {
            options: { destPrefix: 'public/css' },
            files: { 'bootstrap.min.css': 'bootstrap/dist/css/bootstrap.min.css',
                     'font-awesome.min.css': 'font-awesome/css/font-awesome.min.css',}
         },
         js: {
            options: { destPrefix: 'public/js/lib' },
            files: { 'bootstrap.min.js': 'bootstrap/dist/js/bootstrap.min.js'}
         },
         font:{
            files: { 'public/fonts': 'font-awesome/fonts/*.*'}
         }
      },

      dom_munger: {
         development:{
            options: {
               update:[
                  {selector:'#livereload',attribute:'src', value:'http://localhost:'+reloadPort+'/livereload.js'},
                  {selector:'#entry',attribute:'src', value:'build/bundle.js'}
               ]
            },
            src: './public/index.html'
         },
         production: {
            options: {
               update: [
                  {selector:'#livereload',attribute:'src', value:' '},
                  {selector:'#entry',attribute:'src', value:'build/bundle.min.js'}
               ]
            },
            src: './public/index.html'
         }
      },

      browserify: {
         dist:{
            options:{
               transform:[['babelify']]
            },
            files:{
               'public/build/bundle.js': ['public/js/index.js']
            }
         }
      },

      uglify: {
         production: {
            files: {
               'public/build/bundle.min.js': 'public/build/bundle.js'
            }
         }
      },

      develop: {
         server: {
            file: './server.js'
         }
      },

      watch: {
         options: {
            nospawn: true,
            livereload: reloadPort
         },
         server: {
            files: [
               'app/*/*.js', 'app/*.js'
            ],
            tasks: ['develop']
         },
         js: {
            files: ['./public/js/*/*.js'],
            tasks: ['browserify']
         },
         css: {
            files: [
               'public/css/*.css'
            ]
         },
         html: {
            files: [
               'public/index.html'
            ]
         }
      }
   });

   grunt.config.requires('watch.server.files');
   files = grunt.config('watch.server.files');
   files = grunt.file.expand(files);

   grunt.registerTask('delayed-livereload', 'Live reload after the node server has restarted.', function () {
      var done = this.async();
      var f = 'http://localhost:' + reloadPort + '/changed?files=' + files.join(',');
      console.log(f);
      setTimeout(function () {
         request.get(f,  function (err, res) {
            var reloaded = !err && res.statusCode === 200;
            if (reloaded) {
               grunt.log.ok('Delayed live reload successful.');
            } else {
               grunt.log.error('Unable to make a delayed live reload.');
            }
            done(reloaded);
         });
      }, 500);
   });

   grunt.registerTask('default', [
      'bowercopy',
      'browserify',
      'dom_munger:development',
      'develop',
      'watch'
   ]);

   grunt.registerTask('build', [
      'bowercopy',
      'browserify',
      'uglify',
      'dom_munger:production'
   ]);
};
