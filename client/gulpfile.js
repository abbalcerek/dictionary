var gulp = require('gulp');
//logging and debugging during build
var gutil = require('gulp-util');
var source = require('vinyl-source-stream');
//gluing code in correct order
var browserify = require('browserify');
//runs gulp on source code change
var watchify = require('watchify');
//version of react compatible with browserify
var reactify = require('reactify');
var uglify = require('babel-plugin-uglify');
var rename = require('gulp-rename');
var minify = require('gulp-minify');
var babelify = require('babelify');



////this before we were using browserif
//var react = require('gulp-react');
//var concat = require('gulp-concat');
//gulp.task('default', function() {
//    return gulp.src(['properties.js', 'utils.js', 'components/**', 'app.js'])
//      .pipe(react())
//      .pipe(concat('application.js'))
//      .pipe(gulp.dest('./'));
//  });

gulp.task('default', function() {
    var bundler = watchify(browserify({
       entries: ['./app.js'],
       transform: [reactify],
       extensions: ['.js'],
       debug: true,
       cache: {},
       packageCache: {},
       fullPaths: true
    }));

    function build(file) {
        if (file) gutil.log('Recompiling ' + file);
        return bundler
            .bundle()
            .on('error', gutil.log.bind(gutil, 'Browserify Error'))
            .pipe(source('main.js'))
		    .pipe(gulp.dest('./'));
    }

    build();
    bundler.on('update', build);
});

gulp.task('compress', function() {
  gulp.src('main.js')
    .pipe(minify())
    .pipe(gulp.dest('./dist/'))
});