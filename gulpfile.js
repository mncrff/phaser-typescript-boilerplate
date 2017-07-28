const gulp = require('gulp');
const uglify = require('gulp-uglify');
const sourcemaps = require('gulp-sourcemaps');
const sass = require('gulp-sass');
const cleanCSS = require('gulp-clean-css');
const rename = require("gulp-rename");

// gulp + typescript dependencies
const browserify = require('browserify');
const tsify = require('tsify');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const tslint = require('gulp-tslint');

gulp.task('copy:html', function () {
    return gulp.src([
           'game/*.html' 
        ])
        .pipe(gulp.dest('_build'));
});

gulp.task('copy:images', function () {
    return gulp.src([
           'game/assets/images/**/*' 
        ])
        .pipe(gulp.dest('_build/assets/images/'));
});

gulp.task('copy:phaser', function () {
    return gulp.src('node_modules/phaser-ce/build/phaser.min.js')
        .pipe(gulp.dest('_build/lib'));
});

gulp.task('compile:css', function() {
    return gulp.src('game/assets/scss/main.scss')
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(cleanCSS({
            compatibility: 'ie10',
            largeFile: true
        }))
        .pipe(rename({
            extname: '.min.css'
        }))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('_build/assets/css/'));
});

gulp.task('lint:ts', function(){
    return gulp.src('game/app.ts')
        .pipe(tslint({
            formatter: 'stylish'
        }))
        .pipe(tslint.report({
            emitError: false
        }));
 });

gulp.task('bundle:ts', function () {
    return browserify({
        basedir: '.',
        debug: true,
        entries: [
            'game/app.ts'
        ],
        cache: {},
        packageCache: {}
    })
    .plugin(tsify)
    .bundle()
    .pipe(source('bundle.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({loadMaps: true}))
    .pipe(uglify())
    .pipe(rename({
        extname: '.min.js'
    }))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('_build'));
});

// tasks to transform Typescript into browser-ready JavaScript
gulp.task('build', ['lint:ts', 'bundle:ts', 'assets']);

// tasks to manage all other web assets
gulp.task('assets', ['compile:css', 'copy:phaser', 'copy:html', 'copy:images']);

gulp.task('default', ['build']);