var gulp = require('gulp'),
    sass = require('gulp-sass'),
    rename = require('gulp-rename'),
    nodemon = require('gulp-nodemon'),
    minify = require('gulp-clean-css');

// Setup Options
var sassPath = './public/css/sass/*.scss',
    cssDest = './public/css/min';

// Set Sass options
var sassOptions = {
  errLogToConsole: true,
  outputStyle: 'expanded'
};

// Compile Sass
gulp.task('sass', function() {
  return gulp.src(sassPath)
    .pipe(sass(sassOptions).on('error', sass.logError))
    .pipe(minify())
    .pipe(rename({
      extname: '.min.css'
    }))
    .pipe(gulp.dest(cssDest))
});

// Minify CSS
// gulp.task('minify', function() {
//   return gulp.src(cssPath)
//     .pipe(minify())
//     .pipe(rename({
//       extname: '.min.css'
//     }))
//     .pipe(gulp.dest(minDest));
// });

// Watch for CSS/SCSS changes
gulp.task('watch', function () {
  gulp.watch('./public/css/sass/*.scss', ['sass']);
  gulp.watch('./public/css/sass/partials/*.scss', ['sass']);
  gulp.watch('./public/css/*.css', ['minify']);
});


gulp.task('serve', ['watch'], function(){
  return nodemon({
    script: 'app.js'
  })
  .on('change', function(){
    console.log('restarted');
  })
});