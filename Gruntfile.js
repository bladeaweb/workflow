/**
 * @file
 * Grunt tasks for Alexander Sharkov workflow.
 *
 * Run `grunt` for to process with dev settings.
 * Run `grunt prod` to process with prod settings.
 * Run `grunt dev` to start watching with dev settings.
 */

/* global module */
var prod = 'production/';
var dev = 'source/';
module.exports = function (grunt) {
  'use strict';
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    notify_hooks: {
      options: {
        enable: true,
        max_jshint_notifications: 5,
        success: true,
        duration: 3,
        title: "Grunt compilation"
      }
    },
    connect: {
      server: {
        options: {
          port: 3088,
          base: prod
        }
      }
    },
    clean: {
      js: [
        prod + 'js/script.min.js'
      ]
    },
    sprite: {
      png: {
        cssFormat: 'scss',
        cssSpritesheetName: 'sprite-png',
        imgPath: '../img/sprite.png',
        cssTemplate: dev + 'sprite/template/_sprite-png.scss.handlebars',
        src: [dev + 'sprite/png/*.png'],
        dest: prod + 'img/sprite.png',
        destCss: dev + 'sass/components/_sprite-png.scss'
      },
    },
    sass_globbing: {
      dev: {
        files: {
          [dev + 'sass/base/index.sass']: [dev + 'sass/base/_*.{scss,sass}'],
          [dev + 'sass/components/index.sass']: [dev + 'sass/components/_*.{scss,sass}'],
          [dev + 'sass/fixes/index.sass']: [dev + 'sass/fixes/_*.{scss,sass}'],
          [dev + 'sass/layouts/index.sass']: [dev + 'sass/layouts/_*.{scss,sass}'],
          [dev + 'sass/pages/index.sass']: [dev + 'sass/pages/_*.{scss,sass}'],
          [dev + 'sass/tools/index.sass']: [dev + 'sass/tools/_*.{scss,sass}'],
          [dev + 'sass/variables/index.sass']: [dev + 'sass/variables/_*.{scss,sass}'],
          [dev + 'sass/vendors/index.sass']: [dev + 'sass/vendors/_*.{scss,sass}']
        },
        options: {
          useSingleQuotes: true,
          signature: '//\n// GENERATED FILE. DO NOT MODIFY DIRECTLY.\n//'
        }
      }
    },
    concat: {
      options: {
        separator: '\n\n'
      },
      dist: {
        src: [
          dev + 'js/*.js',
          dev + 'js/**/*.js'
        ],
        dest: prod + 'js/script.min.js'
      }
    },
    uglify: {
      prod: {
        options: {
          mangle: {
            except: ['jQuery']
          },
          compress: {
            drop_console: true
          }
        },
        files: {
          [prod + 'js/ie.min.js']: [prod + 'js/ie.min.js']
        }
      },
      dev: {
        options: {
          mangle: {
            except: ['jQuery', 'Drupal']
          },
          compress: {
            drop_console: false
          }
        },
        files: {
          [prod + 'js/style.min.js']: [prod + 'js/style.min.js']
        }
      }
    },
    sass: {
      dev: {
        files: [{
          expand: true,
          cwd: dev + 'sass/',
          src: ['*.{scss,sass}'],
          dest: prod + 'style',
          ext: '.min.css'
        }],
        options: {
          sourceMap: true,
          outputStyle: 'expanded'
        }
      },
      prod: {
        files: [{
          expand: true,
          cwd: dev + 'sass/',
          src: ['*.{scss,sass}'],
          dest: prod + 'style',
          ext: '.min.css'
        }],
        options: {
          sourceMap: false,
          outputStyle: 'compressed'
        }
      }
    },
    pug: {
      dev: {
        options: {
          data: {
            debug: false
          }
        },
        files: [{
          expand: true,
          cwd: dev + 'pug/',
          src: ['*.pug'],
          dest: prod,
          ext: '.html'
        }]
      },
      prod: {
        options: {
          data: {
            debug: true,
            timestamp: '<%= grunt.template.today() %>'
          }
        },
        files: [{
          expand: true,
          cwd: dev + 'pug/',
          src: ['*.pug'],
          dest: prod,
          ext: '.html'
        }]
      }
    },
    prettify: {
      options: {
        indent: 2,
        indent_char: ' ',
        brace_style: 'expand',
        unformatted: [
          'abbr', 'area', 'b', 'bdi', 'bdo', 'br', 'cite', 'code', 'data', 'datalist', 'del', 'dfn', 'em', 'embed', 'i',
          'ins', 'kbd', 'keygen', 'map', 'mark', 'math', 'meter', 'noscript', 'object', 'output', 'progress', 'q',
          'ruby', 's', 'samp', 'small', 'strong', 'sub', 'sup', 'template', 'time', 'u', 'var', 'wbr', 'text',
          'acronym', 'address', 'big', 'dt', 'ins', 'strike', 'tt'
        ]
      },
      all: {
        expand: true,
        cwd: prod,
        ext: '.html',
        src: ['*.html'],
        dest: prod
      }
    },
    watch: {
      options: {
        livereload: true
      },
      scripts: {
        files: [dev + 'js/*.js'],
        tasks: ['clean:js', 'concat:dist', 'uglify:dev'],
        options: {
          spawn: false
        }
      },
      pug: {
        files: [dev + 'pug/*.pug', 'prettify:all'],
        tasks: ['pug:dev', 'prettify:all'],
        options: {
          spawn: false
        }
      },
      sprite: {
        files: [dev + 'sprite/*/*.{png,jpg}'],
        tasks: ['sprite'],
        options: {
          spawn: false
        }
      },
      styles: {
        files: [dev + 'sass/*.{scss,sass}', dev + 'sass/**/*.{scss,sass}'],
        tasks: ['sass_globbing', 'sass:dev'],
        options: {
          spawn: false
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-sass-globbing');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-pug');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-sass');
  grunt.loadNpmTasks('grunt-exec');
  grunt.loadNpmTasks('grunt-notify');
  grunt.loadNpmTasks('grunt-prettify');
  grunt.loadNpmTasks('grunt-spritesmith');

  grunt.task.run('notify_hooks');

  grunt.registerTask('prod', ['clean:js', 'sprite', 'sass_globbing', 'concat:dist', 'uglify:prod', 'sass:prod', 'pug:prod', 'prettify:all']);
  // By default, run grunt with dev settings for developing.
  grunt.registerTask('default', ['clean:js', 'sprite', 'sass_globbing', 'concat:dist', 'uglify:dev', 'sass:dev', 'pug:prod', 'prettify:all']);
  // For develop
  grunt.registerTask('dev', ['connect:server', 'watch']);
};