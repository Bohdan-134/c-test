const gulp = require('gulp');
const del = require('del');
const htmlmin = require('gulp-htmlmin');
const sass = require("gulp-sass")(require("sass"));
const autoprefixer = require('gulp-autoprefixer');
const cssmin = require('gulp-cssmin');
const concat = require('gulp-concat');
const jsmin = require('gulp-jsmin');
const browserSync = require("browser-sync").create();

const paths = {
    html: {
        src: 'src/*.html',
        dist: 'dist'
    },
    styles: {
        src: 'src/styles/main.scss',
        dist: 'dist/css'
    },
    scripts: {
        src: 'src/scripts/**/*.js',
        dist: 'dist/js/'
    },
}

function clean() {
    return del(["dist"]);
}

function html() {
    return gulp
        .src(paths.html.src)
        .pipe(htmlmin())
        .pipe(gulp.dest(paths.html.dist))
        .pipe(browserSync.stream());
}

function styles() {
    return gulp
        .src(paths.styles.src)
        .pipe(sass())
        .pipe(autoprefixer())
        .pipe(cssmin())
        .pipe(concat('main.css'))
        .pipe(gulp.dest(paths.styles.dist))
        .pipe(browserSync.stream());
}

function scripts() {
    return gulp
        .src(paths.scripts.src)
        .pipe(jsmin())
        .pipe(gulp.dest(paths.scripts.dist))
        .pipe(browserSync.stream());
}

function watch() {
    browserSync.init({
        server: {
            baseDir: "dist",
        },
    });
    gulp.watch(paths.html.src, html);
    gulp.watch(paths.styles.src, styles);
    gulp.watch('src/styles/**/*.scss', styles);
    gulp.watch(paths.scripts.src, scripts);
}

const build = gulp.series(
    clean,
    gulp.parallel(html, styles, scripts),
    watch
);

exports.clean = clean;
exports.html = html;
exports.styles = styles;
exports.scripts = scripts;
exports.default = build;