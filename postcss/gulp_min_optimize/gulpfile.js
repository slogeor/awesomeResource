var atImport = require('postcss-import');
var mqpacker = require('css-mqpacker');
var cssnano = require('cssnano');
var gulp = require('gulp');
var postcss = require('gulp-postcss');

var processors = [
    atImport,
    mqpacker,
    cssnano
];

gulp.task('css', function () {
    return gulp.src('./src/*.css')
        .pipe(postcss(processors))
        .pipe(gulp.dest('./prd'));
});
