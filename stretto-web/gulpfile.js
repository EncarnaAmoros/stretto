/*
* Dependencias
*/
var gulp = require('gulp'),
  concat = require('gulp-concat'),
  uglify = require('gulp-uglify'),
	express = require('express');
var webserver = require('gulp-webserver');

/*
* Cuando se modifiquen los .js se ejecutará la tarea demo
*/
gulp.task('watch', function(){ 
	gulp.watch('public/js/*.js', ['demo']);
});

/*
* Configuración de la tarea 'demo'
* Concat: concatena todos los archivos de gulp.src
* Uglify: realiza la minificación del archivo concatenado
* Dest: el resultado lo guardamos en el directorio indicado
*/
gulp.task('demo', function () {
  gulp.src('public/js/*.js')
  .pipe(concat('todo.js'))
  .pipe(uglify())
  .pipe(gulp.dest('public/js/build/'))
});

/*
* Creamos un servidor indicando el directorio donde está nuestra aplicacion
*/

gulp.task('servidor', function() {
 	gulp.src('public')
    .pipe(webserver({
      livereload: true,
      path: '/',
      open: true
    }));
	//server.use('/aplicacion/', express.static('public'));
});

/*
* La tarea por defecto se ejecuta tras ejecutarse esta lista de tareas
*/
gulp.task('default', ['demo', 'servidor', 'watch']);