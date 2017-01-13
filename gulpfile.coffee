gulp = require 'gulp'
connect = require 'gulp-connect'
sass = require 'gulp-sass'
autoprefixer = require 'gulp-autoprefixer'
pug = require 'gulp-pug'
plumber = require 'gulp-plumber'
sourcemaps = require 'gulp-sourcemaps'
cssmin = require 'gulp-cssmin'
rename = require 'gulp-rename'

prod = "production/"
dev = "source/"

gulp.task 'connect', ->
  connect.server
    port: 1337
    livereload: on
    root: './'+prod
gulp.task 'sass', ->
  gulp.src [dev+'sass/*.+(sass|scss)', '!'+dev+'sass/_*.+(sass|scss)']
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
    .pipe cssmin()
    .pipe rename({suffix: '.min'})
    .pipe sourcemaps.write()
    .pipe gulp.dest prod + 'style'
gulp.task 'pug', ->
  gulp.src [dev+'pug/*.pug', '!'+dev+'pug/_*.pug']
    .pipe plumber()
    .pipe pug({'error': pug.logError})
    .pipe plumber.stop()
    .pipe gulp.dest prod
gulp.task 'reload', ->
  gulp.src '*.*'
    .pipe do connect.reload
gulp.task 'watch', ->
  gulp.watch [dev + 'sass/*.sass', dev + 'sass/**/*.sass'], ['sass']
  gulp.watch [dev + 'css/*.css', dev + 'css/**/*.css'], ['css']
  gulp.watch [dev + 'pug/*.pug', dev + 'pug/**/*.pug'], ['pug']
  gulp.watch [prod + '*.*', prod + '**/*.*'], ['reload']
gulp.task 'default', ['sass', 'css', 'pug', 'connect', 'watch']