gulp = require 'gulp'
connect = require 'gulp-connect'
sass = require 'gulp-sass'
autoprefixer = require 'gulp-autoprefixer'
pug = require 'gulp-pug'
plumber = require 'gulp-plumber'
sourcemaps = require 'gulp-sourcemaps'
minifyCSS = 'gulp-csso'

prod = "production/"
dev = "dev/"


gulp.task 'connect', ->
  connect.server
    port: 1337
    livereload: on
    root: './'

gulp.task 'sass', ->
  gulp.src dev + 'sass/*.sass'
    .pipe plumber()
    .pipe sourcemaps.init()
    .pipe sass().on('error', sass.logError)
    .pipe sourcemaps.write()
    .pipe plumber.stop()
    .pipe gulp.dest dev + 'css'

gulp.task 'css', ->
  gulp.src dev + 'css/*.css'
    .pipe sourcemaps.init()
    .pipe autoprefixer()
    .pipe minifyCSS()
    .pipe sourcemaps.write()
    .pipe gulp.dest prod + 'style'

gulp.task 'pug', ->
  gulp.src dev + 'pug/*.pug'
    .pipe pug()
    .pipe gulp.dest prod

gulp.task 'reload', ->
  gulp.src '*.*'
    .pipe do connect.reload


gulp.task 'watch', ->
  gulp.watch [dev + 'sass/*.sass', dev + 'sass/**/*.sass'], ['sass']
  gulp.watch [dev + 'css/*.css', dev + 'css/**/*.css'], ['css']
  gulp.watch [prod + '*.*', prod + '**/*.*'], ['reload']

gulp.task 'default', ['sass', 'css', 'connect', 'watch']