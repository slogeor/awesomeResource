var autoprefixer = require('autoprefixer');
var color_rgba_fallback = require('postcss-color-rgba-fallback');
var opacity = require('postcss-opacity');
var pseudoelements = require('postcss-pseudoelements');
var vmin = require('postcss-vmin');
var pixrem = require('pixrem');
var will_change = require('postcss-will-change');
var gulp = require('gulp');
var postcss = require('gulp-postcss');

var processors = [
    will_change,
    // 只支持IE11+和Safari9
    // autoprefixer({browsers:'safari >= 9, ie >= 11'}),
    autoprefixer,
    color_rgba_fallback,
    opacity,
    pseudoelements,
    vmin,
    pixrem
];


gulp.task('css', function () {
    return gulp.src('./src/*.css')
        .pipe(postcss(processors))
        .pipe(gulp.dest('./prd'));
});
