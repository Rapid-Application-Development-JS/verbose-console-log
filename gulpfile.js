var gulp = require('gulp');
var sourcemaps = require('gulp-sourcemaps');
var babel = require("gulp-babel");

gulp.task('prepare-test-dir', function () {
    return gulp.src('./test/polygon/test_0_1_2.js')
        .pipe(sourcemaps.init())
        // we use babel just because it add "use strict" at file beginning and thus we force *.map file to add mappings
        .pipe(babel())
        .pipe(sourcemaps.write('.', {addComment: true}))
        .pipe(gulp.dest('./test/polygon/builded'));
});

gulp.task('default', ['prepare-test-dir']);
