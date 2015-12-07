/*
* Dependencias para gulp
*/
var gulp = require('gulp'),
  concat = require('gulp-concat'),
  uglify = require('gulp-uglify'),
	express = require('express');
	connect = require('gulp-connect'), 
  historyApiFallback = require('connect-history-api-fallback');

var webserver = require('gulp-webserver');

/*
* Creamos un servidor indicando el directorio donde está nuestra aplicacion
*/
gulp.task('servidor', function() {
    connect.server({ 
        root: './public', 
        hostname: '0.0.0.0', 
        port: 4000
    })
});

/*
* Configuración de las tareas 'minilib' y 'minijs'
* Concat: concatena todos los archivos de gulp.src
* Uglify: realiza la minificación del archivo concatenado
* Dest: el resultado lo guardamos en el directorio indicado
*/
gulp.task('minilib', function () {
  gulp.src('public/lib/*.js')
  .pipe(concat('todolib.js'))
  .pipe(uglify())
  .pipe(gulp.dest('public/build/'))
});
gulp.task('minijs', function () {
  gulp.src('public/js/*.js')
  .pipe(concat('todojs.js'))
  .pipe(uglify())
  .pipe(gulp.dest('public/build/'))
});

/*
* Para que el liveroad revise si hay cambios en los siguientes
* archivos de js, css y html
*/
gulp.task('lib', function() {
        gulp.src('./public/lib/*.js') 
            .pipe(connect.reload());
});
gulp.task('js', function() {
        gulp.src('./public/js/*.js') 
            .pipe(connect.reload());
});
gulp.task('css', function() {
        gulp.src('./public/css/*.css') 
            .pipe(connect.reload());
});
gulp.task('html', function() {
        gulp.src('./public/**/*.html') 
            .pipe(connect.reload());
});

/*
* Cuando se modifiquen los archivos de las rutas de la izquierda
* se ejecutarán las tareas asociadas de la derecha
*/
gulp.task('watch', function(){ 
	gulp.watch('public/lib/*.js', ['minilib', 'js']);
	gulp.watch('public/js/*.js', ['minijs', 'js']);
	gulp.watch('public/css/*.css', ['css']);
	gulp.watch('public/**/*.html', ['html']);
});

/*
* La tarea por defecto se ejecuta tras ejecutarse esta lista de tareas
*/
gulp.task('default', ['minilib', 'minijs', 'servidor', 'watch']);