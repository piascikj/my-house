'use strict';

var fs = require('fs');
var path = require('path');
var mozjpeg = require('imagemin-mozjpeg');
var envify = require('envify');
var Zillow = require('node-zillow');
process.env.NODE_ENV = "development";
var zwsid = "X1-ZWz1b18wrlizgr_14qhc";

module.exports = function(grunt) {
  
  grunt.initConfig({
    clean: {
      src: ["dist/*", "!dist/.git"]
    },

    browserify: {
      js: {
        // A single entry point for our app
        src: ['src/js/main.js'],
        // Compile to a single file to add a script tag for in your HTML
        dest: 'dist/js/main.js',
        options: {
          transform: ['envify']
        }
      }
    },
    
    copy: {
      all: {
        // This copies all the html, css and images into the dist/ folder
        expand: true,
        cwd: 'src/',
        src: ['**/*.html', '**/*.css', 'images/**/*', "*.json", "*.js", "*.ico"],
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
      files: ['Gruntfile.js', 'src/js/**/*.js'],
      options: {
        globalstrict: true,
        node: true,
        validthis: true,
        globals: {
          jQuery: true,
          chrome: true,
          console: false,
          localStorage: true,
          module: true,
          document: true,
          window: false,
          escape: false,
          unescape: false,
          location: false
        }
      }
    },
    
    haml: {
      // compile individually into dest, maintaining folder structure
      main: {
        files: {
          "dist/index.html": "src/index.haml"
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

    imagemin: {
      dynamic: {
        options: {
          optimizationLevel: 6,
          progressive: true,
          svgoPlugins: [{ removeViewBox: false }],
          use: [mozjpeg()]
        },
        files: [{
          expand: true,
          cwd: 'dist/',
          src: ['**/*.{png,jpg,gif}'],
          dest: 'dist/'
        }]
      }
    },

    image_resize: {
      resize: {
        options: {
          width: 1728,  // width: 1920,
        },
        files: [{
          expand: true,
          cwd: 'dist/',
          src: ['**/*.{png,jpg,gif}'],
          dest: 'dist/'
        }]
      }
    },

    buildcontrol: {
      options: {
        dir: 'dist',
        commit: true,
        push: true,
        message: 'Built %sourceName% from commit %sourceCommit% on branch %sourceBranch%'
      },
      pages: {
        options: {
          remote: 'git@github.com:piascikj/my-house.git',
          branch: 'gh-pages'
        }
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
      },

      haml: {
        files: ["src/*.haml"],
        tasks: ["haml"]
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-imagemin');
  grunt.loadNpmTasks('grunt-image-resize');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-haml');
  grunt.loadNpmTasks('grunt-build-control');


  grunt.registerTask('prod_env',  function() {
    process.env.NODE_ENV = "production";
  });

  grunt.registerTask('zillow', function() {
    var done = this.async();
    var zillow = new Zillow(zwsid);
    zillow.getDeepSearchResults({
      address: '4476 Plank Rd.',
      city: 'Highland',
      state: 'WI',
      zip: '53543'
    }).then(function(result) {
      fs.writeFile('dist/js/data.json', JSON.stringify(result, null, 3), done);
    });
  });
  
  grunt.registerTask('default', ['jshint', 'clean', 'browserify', 'copy', 'haml', 'image_resize', 'imagemin', 'zillow']);
  grunt.registerTask('dist', ['prod_env', 'default', 'uglify', 'buildcontrol']);  
};
