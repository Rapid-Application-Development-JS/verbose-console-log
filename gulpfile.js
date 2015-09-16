var gulp = require('gulp');
var babel = require('gulp-babel');
var sourcemaps = require('gulp-sourcemaps');
var concat = require('gulp-concat');
var clean = require('gulp-clean');
//var removeUseStrict = require("gulp-remove-use-strict");
var replace = require("gulp-replace");


gulp.task('build', ['copy-src-to-dist'], function () {
    return gulp.src('test/polygon/test_0_1_2.js')
        .pipe(sourcemaps.init())
        .pipe(babel())
        .pipe(sourcemaps.write('.', {addComment: true}))
        .pipe(gulp.dest('test/polygon'));
});

gulp.task('default', ['build']);