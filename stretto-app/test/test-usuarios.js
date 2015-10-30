var app = require('../app');
var supertest = require('supertest');
var assert = require('assert');

describe('prueba de la app web usuarios', function(){
	it('/ devuelve los usuarios', function(done){
		//this.timeout(15000)
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
			assert(res.text.indexOf('Juan') != -1);
			assert(res.text.indexOf('Ana') != -1);
			assert(res.text.indexOf('Lucas') != -1);
		})
		.end(done);		
	});
	
	it('/ devuelve los datos de un usuario', function(done){
		supertest(app)
		.get('/stretto/usuarios/1')
		.expect(200)
		.expect(function(res) {
			//Si ponemos un string estamos verificando el cuerpo de la respuesta
			//Como esta ya es la última expectativa, pasamos el 'done'. Supertest lo llamará
			//Cualquier 'expect' admite el 'done' como último parámetro
			assert(res.text.indexOf('1') != -1);
			assert(res.text.indexOf('8') != -1);
			assert(res.text.indexOf('lucas@gm.com') != -1);
			assert(res.text.indexOf('665372812') != -1);
		})
		.end(done);
	});
	
	it('/ devuelve 201 al crear usuario', function(done){
		supertest(app)
		.post('/stretto/usuarios')
		.send({"nombre": "prueba"}, {"email": "prueba@gm.com"})
		.expect(201, done);
	});
	
	it('/ devuelve 400 al crear usuario con email vacio', function(done){
		supertest(app)
		.post('/stretto/usuarios')
		.expect(400)
		.expect('El email es obligatorio.', done);
	});
	
	it('/ devuelve 204 al actualizar usuario existente', function(done){
		supertest(app)
		.put('/stretto/usuarios/1')
		.auth('lucas@gm.com', 'l')
		//.send({"nombre": "Pepe"}, {"email": "pepe@gm.com"})
		.field('nombre','pepe')
		.field('email','pepe')
		.expect(204, done);
	});
	
	it('/ devuelve 404 al actualizar usuario inexistente', function(done){
		supertest(app)
		.put('/stretto/usuarios/99999')
		.auth('lucas@gm.com', 'l')
		//.send({"nombre": "Pepe"}, {"email": "pepe@gm.com"})
		.field('nombre','pepe')
		.field('email','pepe')
		.expect(404, done);
	});
	
	
	
	
	
	/*
	it('/ devuelve 201 al actualizar usuario', function(done){
		supertest(usuarios)
		.post('/usuarios/1')
		.send({"nombre": "Pepe"}, {"email": "pepe@gm.com"})
		.expect(201);
		done();
	});
	
	it('/ devuelve 404 actualizando usuario inexistente', function(done){
		supertest(usuarios)
		.post('/usuarios/100000')
		.send({"nombre": "Pepe"}, {"email": "pepe@gm.com"})
		.expect(404)
		done();
	});
	
	it('La ruta /hola no existe', function(done){
		supertest(usuarios)
		.get('/hola')
		.expect(400)
		.expect('Identificador de usuario inválido.');
		done();
	});
	*/
});