'use strict';

var fs = require('fs');
var path = require('path');
//var glob = require('glob');
//var stringify = require('stringify');

module.exports = function(grunt) {
  
  grunt.initConfig({
    clean: {
      src: "dist"
    },

    browserify: {
      js: {
        // A single entry point for our app
        src: ['src/js/main.js'],
        // Compile to a single file to add a script tag for in your HTML
        dest: 'dist/js/main.js'
      }
    },
    
    copy: {
      all: {
        // This copies all the html, css and images into the dist/ folder
        expand: true,
        cwd: 'src/',
        src: ['**/*.html', '**/*.css', 'images/**/*', "*.json", "*.js"],
        dest: 'dist/',
      },
      bootstrap_css: {
        expand: true,
        cwd: 'node_modules/bootstrap/dist',
        src: ['css/*.css', 'css/*.map'],
        dest: 'dist/',
      },
      font_awesome_css: {
        expand: true,
        cwd: 'node_modules/font-awesome/',
        src: 'css/*.css',
        dest: 'dist/'
      },
      font_awesome_fonts: {
        expand: true,
        cwd: 'node_modules/font-awesome/',
        src: 'fonts/*',
        dest: 'dist/'
      }
    },

    jshint: {
      files: ['Gruntfile.js', 'app/js/**/*.js'],
      options: {
        globalstrict: true,
        node: true,
        globals: {
          jQuery: true,
          chrome: true,
          console: false,
          localStorage: true,
          module: true,
          document: true,
          window: false,
          escape: false,
          unescape: false
        }
      }
    },

    uglify: {
      options: {
        sourceMap: true
      },
      js: {
        files: [{
          expand: true,
          cwd: 'dist/js',
          src: ['**/*.js', '!**/*.min.js'],
          dest: 'dist/js',
          ext: '.min.js'
        }]
      }
    },

    watch: {
      js: {
        files: "src/**/*.js",
        tasks:['jshint', 'browserify', 'copy']
      },

      other: {
        files: ["src/**/*.css", "src/**/*.html"],
        tasks: ["copy"]
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('default', ['jshint', 'clean', 'browserify', 'copy']);
  grunt.registerTask('dist', ['default', 'uglify']);  
};
