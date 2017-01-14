gulp = require 'gulp'
connect = require 'gulp-connect'
sass = require 'gulp-sass'
autoprefixer = require 'gulp-autoprefixer'
pug = require 'gulp-pug'
plumber = require 'gulp-plumber'
sourcemaps = require 'gulp-sourcemaps'
cssmin = require 'gulp-cssnano'
rename = require 'gulp-rename'
notify = require 'gulp-notify'

prod = "production/"
dev = "source/"

gulp.task 'connect', ->
  connect.server
    port: 8008
    livereload: on
    root: './'+prod

gulp.task 'sass', ->
  gulp.src [dev+'sass/*.+(sass|scss)', '!'+dev+'sass/_*.+(sass|scss)']
    .pipe plumber()
    .pipe sourcemaps.init()
    .pipe sass(
      outputStyle: 'expanded'
      errLogToConsole: true
    ).on "error", notify.onError({
      title: "Sass: FAIL"
      message: "Error: <%= error.message %>"
    })
    .pipe sourcemaps.write()
    .pipe plumber.stop()
    .pipe gulp.dest dev + 'css'
    .pipe notify(
      title: "Sass: SUCCESS"
      message: "Generated file: <%= file.relative %>"
    )

gulp.task 'css', ->
  gulp.src dev + 'css/*.css'
    .pipe gulp.dest prod + 'style'
#    .pipe sourcemaps.init({loadMaps: true})
#    .pipe autoprefixer()
    .pipe rename({suffix: '.min'})
    .pipe cssmin()
#    .pipe sourcemaps.write('.')
    .pipe gulp.dest prod + 'style'

gulp.task 'pug', ->
  gulp.src [dev+'pug/*.pug', '!'+dev+'pug/_*.pug']
    .pipe plumber()
    .pipe pug({
      pretty: true,
      errLogToConsole: pug.logError
      }).on "error", notify.onError({
      title: "Pug: FAIL"
      message: "Error: <%= error.message %>"
    })
    .pipe plumber.stop()
    .pipe gulp.dest prod
    .pipe notify(
      title: "Pug: SUCCESS"
      message: "Generated file: <%= file.relative %>"
    )

gulp.task 'reload', ->
  gulp.src '*.*'
    .pipe do connect.reload

gulp.task 'watch', ->
  gulp.watch [dev + 'sass/*.sass', dev + 'sass/**/*.sass'], ['sass']
  gulp.watch [dev + 'css/*.css', dev + 'css/**/*.css'], ['css']
  gulp.watch [dev + 'pug/*.pug', dev + 'pug/**/*.pug'], ['pug']
  gulp.watch [prod + '*.*', prod + '**/*.*'], ['reload']

gulp.task 'default', ['sass', 'css', 'pug', 'connect', 'watch']