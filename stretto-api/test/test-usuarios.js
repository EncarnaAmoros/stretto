var app = require('../app');
var models = require('../models');
var supertest = require('supertest');
var assert = require('assert');
var inicializarBD = require('./initializeBD');

describe('test de la app web usuarios', function(){	
	//Inicializamos la BD antes de ejecutar los test
	before(function (done) {
		inicializarBD.initialize().finally(function() {
			done();
		});
	});
	
	it('GET / devuelve los usuarios', function(done){
		//Al objeto supertest le pasamos la app de usuarios
		supertest(app)
		//Hacemos una petición HTTP
		.get('/stretto/usuarios')
		//Supertest incluye sus propias aserciones con 'expect'
		//Cuando ponemos un entero estamos verificando el status HTTP
		.expect(200)
		//Cuando ponemos dos String estamos verificando una cabecera HTTP
		//.expect('X‐Mi‐Cabecera', 'hola')
		.expect(function(res) {
			//Si ponemos un string estamos verificando el cuerpo de la respuesta
			//Como esta ya es la última expectativa, pasamos el 'done'. Supertest lo llamará
			//Cualquier 'expect' admite el 'done' como último parámetro
			assert(res.text.indexOf('Ana') != -1);
			assert(res.text.indexOf('Lucas') != -1);
			assert(res.text.indexOf('lucas@gm.com') != -1);
		})
		.end(done);		
	});
	
	it('GET / devuelve 404 no hay usuarios en página 3', function(done){
		supertest(app)
		.get('/stretto/usuarios?page=3')
		.expect(404)
		.expect('Recurso no encontrado', done);
	});
	
	it('GET / devuelve 400 pues para el paginado se utiliza el atributo page', function(done){
		supertest(app)
		.get('/stretto/usuarios?pag=2')
		.expect(400)
		.expect('Falta el parámetro page en la petición', done);
	});
	
	it('GET / devuelve 404 no es ruta definida', function(done){
		supertest(app)
		.get('/stretto/usuariosss')
		.expect(404)
		.expect(function(res) {
			assert(res.text.indexOf('No encontrado.') != -1);
		})
		.end(done);
	});
	
	it('GET / devuelve los datos de un usuario', function(done){
		supertest(app)
		.get('/stretto/usuarios/1')
		.expect(200)
		.expect(function(res) {
			assert(res.text.indexOf('1') != -1);
			assert(res.text.indexOf('8') != -1);
			assert(res.text.indexOf('lucas@gm.com') != -1);
			assert(res.text.indexOf('665372812') != -1);
		})
		.end(done);
	});
	
	it('GET / devuelve 400 al buscar usuario con id no numérico', function(done){
		supertest(app)
		.get('/stretto/usuarios/aa')
		.expect(400)
		.expect('Identificador de usuario inválido.', done);
	});
	
	it('GET / devuelve 404 al buscar usuario inexistente', function(done){
		supertest(app)
		.get('/stretto/usuarios/99999')
		.expect(404)
		.expect('No existe el usuario referido.', done);
	});
	
	it('GET / devuelve 404 no hay artículos del usuario 1 en página 4', function(done){
		supertest(app)
		.get('/stretto/usuarios/1/articulos?page=3')
		.expect(404)
		.expect('Recurso no encontrado', done);
	});
	
	it('GET / devuelve 400 pues para el paginado se utiliza el atributo page', function(done){
		supertest(app)
		.get('/stretto/usuarios/1/articulos?pag=2')
		.expect(400)
		.expect('Falta el parámetro page en la petición', done);
	});
	
	it('GET / devuelve 200 al buscar artículos de un usuario', function(done){
		supertest(app)
		.get('/stretto/usuarios/1/articulos')
		.expect(200)
		.expect(function(res) {
			assert(res.text.indexOf('1') != -1);
			assert(res.text.indexOf('Ukelele') != -1);
			assert(res.text.indexOf('3') != -1);
			assert(res.text.indexOf('Saxofon') != -1);
		})
		.end(done);
	});
	
	it('GET / devuelve 400 al buscar artículos de usuario con id no numérico', function(done){
		supertest(app)
		.get('/stretto/usuarios/aa/articulos')
		.expect(400)
		.expect('Identificador de usuario inválido.', done);
	});
	
	it('GET / devuelve 404 al buscar artículos de usuario inexistente', function(done){
		supertest(app)
		.get('/stretto/usuarios/99999/articulos')
		.expect(404)
		.expect('No existe el usuario referido.', done);
	});
	
	it('POST / devuelve 400 al crear usuario con email vacio', function(done) {
		var usuario = { nombre : 'usuario', email : '', password: 'u'};
		supertest(app)
		.post('/stretto/usuarios')
		.send(usuario)
		.expect(400)
		.expect('El email es obligatorio.', done);
	});
	
	it('POST / devuelve 400 al crea usuario con email de otro usuario de la BD', function(done) {
		var usuario = { nombre : 'usuario', email : 'lucas@gm.com', password: 'l'};
		supertest(app)
		.post('/stretto/usuarios')
		.send(usuario)
		.expect(400)
		.expect('Ya hay un usuario con este email.', done);
	});
	
	it('POST / devuelve 201 al crea usuario', function(done) {
		var usuario = { nombre : 'usuario', email : 'usuario2@gm.com', password: 'u'};
		supertest(app)
		.post('/stretto/usuarios')
		.send(usuario)
		.expect(201)
		.expect('Operación realizada con éxito.', done);
	});
		
	it('PUT / devuelve 400 al actualizar usuario con id no numérico', function(done){
		var usuario = { nombre : 'usuario', email : 'usuario@gm.com', password: 'u'};
		supertest(app)
		.put('/stretto/usuarios/aa')
		.auth('lucas@gm.com', 'l')
		.send(usuario)
		.expect(400)
		.expect('Identificador de usuario inválido.', done);
	});
	
	it('PUT / devuelve 404 al actualizar usuario inexistente', function(done){
		var usuario = { nombre : 'usuario', email : 'usuario@gm.com', password: 'u'};
		supertest(app)
		.put('/stretto/usuarios/99999')
		.auth('lucas@gm.com', 'l')
		.send(usuario)
		.expect(404)
		.expect('No existe el usuario referido.', done);
	});
	
	it('PUT / devuelve 400 al actualizar usuario con email vacio', function(done){
		var usuario = { nombre : 'usuario', email : '', password: 'u'};
		supertest(app)
		.put('/stretto/usuarios/2')
		.auth('lucas@gm.com', 'l')
		.send(usuario)
		.expect(400)
		.expect('El email es obligatorio.', done);
	});
	
	it('PUT / devuelve 400 al modificar usuario con email de otro usuario de la BD', function(done) {
		var usuario = { nombre : 'usuario', email : 'lucas@gm.com', password: 'l'};
		supertest(app)
		.put('/stretto/usuarios/2')
		.auth('ana@gm.com', 'a')
		.send(usuario)
		.expect(400)
		.expect('Ya hay un usuario con este email.', done);
	});
	
	it('PUT / devuelve 204 al actualizar usuario existente', function(done){
		var usuario = { nombre : 'Ana', email : 'anaNuevoEmail@gm.com', password: 'a'};
		supertest(app)
		.put('/stretto/usuarios/2')
		.auth('ana@gm.com', 'a')
		.send(usuario)
		.expect(204, done);
	});
	
	it('DELETE / devuelve 400 al eliminar usuario con id no numérico', function(done){
		supertest(app)
		.delete('/stretto/usuarios/aa')
		.auth('juan@gm.com', 'j')
		.expect(400)
		.expect('Identificador de usuario inválido.', done);
	});
	
	it('DELETE / devuelve 404 al eliminar usuario inexistente', function(done){
		supertest(app)
		.delete('/stretto/usuarios/99999')
		.auth('juan@gm.com', 'j')
		.expect(404)
		.expect('No existe el usuario referido.', done);
	});
	
	it('DELETE / devuelve 204 al eliminar usuario', function(done){
		supertest(app)
		.delete('/stretto/usuarios/3')
		.auth('juan@gm.com', 'j')
		.expect(204, done);
	});
	
});