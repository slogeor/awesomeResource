var autoprefixer = require('autoprefixer');
var color_rgba_fallback = require('postcss-color-rgba-fallback');
var opacity = require('postcss-opacity');
var pseudoelements = require('postcss-pseudoelements');
var vmin = require('postcss-vmin');
var pixrem = require('pixrem');
var gulp = require('gulp');
var postcss = require('gulp-postcss');
var atIimmport = require('postcss-import');
var cssnano = require('cssnano');

var processors = [
    // autoprefixer,
    autoprefixer({browsers:'safari >= 9, ie >= 11'}),
    color_rgba_fallback,
    opacity,
    atIimmport,
    cssnano
];

gulp.task('css', function () {
    return gulp.src('./src/*.css')
        .pipe(postcss(processors))
        .pipe(gulp.dest('./prd'));
});


gulp.task('watch', function (done) {
    gulp.watch('./src/*.css', ['css']);
});
