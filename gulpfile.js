'use strict';

var gulp = require('gulp'),
    sass = require('gulp-sass');

// Setup Options
var sassPath = './public/css/sass/*.scss';
var cssDest = './public/css';

// Compile Sass
gulp.task('sass', function() {
  return gulp.src(sassPath)
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest(cssDest));
});

// Watch Task
gulp.task('sass:watch', function() {
  gulp.watch('./public/css/sass/*.scss', ['sass']);
});