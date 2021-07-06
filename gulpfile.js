const gulp = require("gulp");
const { src, dest, watch, parallel, series } = require("gulp")
//const sass = require('gulp-sass');
//image-----------------------------------------
//minify images and copy it to dist folder
const imagemin = require('gulp-imagemin');
function imgMinify() {
    return src('src/pics/*')
        .pipe(imagemin())
        .pipe(gulp.dest('dist/images'));
}

//run image task by 'gulp' commond
//  exports.default = imgMinify
//  or
//run image task by 'gulp imgMinify' commond
exports.img = imgMinify

//creating dist folder and copy html files to it
///html--------------------------
const htmlmin = require('gulp-htmlmin');//white space &remove comment
function copyHtml() {
    return src('src/*.html')
        .pipe(htmlmin({ collapseWhitespace: true, removeComments: true }))
        .pipe(gulp.dest('dist'))
}

//exports.html = copyHtml //to run html only 


//minify js files and copy it to dist folder
///js-------------------
const sourcemaps = require('gulp-sourcemaps');
const concat = require('gulp-concat');//more than one file 
const terser = require('gulp-terser');
const babel = require("gulp-babel")
function jsMinify() {
    return src('src/js/**/*.js',{sourcemaps:true}) //path includeing all js files in all folders
    
        //concate all js files in all.min.js
        .pipe(concat('all.min.js'))
        .pipe(
            babel()
          )
        //use terser to minify js files
        .pipe(terser())
        //create source map file in the same directory
        .pipe(dest('dist/assets/js',{sourcemaps:'.'}))
}
exports.js = jsMinify


//minify css files and copy it to dist folder
//css-------------------------------------
var cleanCss = require('gulp-clean-css');//clean to css(one file css clean)
function cssMinify() {
    return src("src/css/**/*.css")
        //concate all css files in style.min.css
        .pipe(concat('style.min.css'))
        //minify file 
        .pipe(cleanCss())
        .pipe(dest('dist/assets/css'))
}
exports.css = cssMinify
//sass task ---------------------------npm rebuild node-sass---------------------
var sass = require('gulp-sass');
function sassMinify() {
    return src(["src/sass/**/*.scss", "src/css/**/*.css"],{sourcemaps:true})
        .pipe(sass()) // Using gulp-sass from sass to css
        //concate all js files in all.min.js
        .pipe(concat('style.sass.min.css'))
        .pipe(cleanCss())
        .pipe(dest('dist/assets/css',{sourcemaps:'.'}))
}

///server---------------------------------------------

var browserSync = require('browser-sync');
function serve (cb){
  browserSync({
    server: {
      baseDir: 'dist/'
    }
  });
  cb()
}
function reloadSync(cb){
 browserSync.reload()
  cb()
}

//watch task-------------------------
function watchTask() {
    watch('src/*.html',series(copyHtml, reloadSync))
    watch(['src/js/**/*.js', "src/css/**/*.css","src/sass/**/*.scss"], 
            parallel(jsMinify,sassMinify,reloadSync));
}
exports.default = series(parallel(imgMinify, jsMinify, sassMinify, copyHtml), serve,watchTask)

/* , cssMinify */



