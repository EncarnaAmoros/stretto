var usuarios = require('../routes/usuarios');
var supertest = require('supertest');

describe('prueba de la app web usuarios', function(){
	it('/ devuelve los usuarios', function(done){
		//this.timeout(15000)
		//Al objeto supertest le pasamos la app de usuarios
		supertest(usuarios)
		
		//Hacemos una petición HTTP
		.get('/')
		//Supertest incluye sus propias aserciones con 'expect'
		//Cuando ponemos un entero estamos verificando el status HTTP
		.expect(200)
		//Cuando ponemos dos String estamos verificando una cabecera HTTP
		//.expect('X‐Mi‐Cabecera', 'hola')
		//Si ponemos un string estamos verificando el cuerpo de la respuesta
		//Como esta ya es la última expectativa, pasamos el 'done'. Supertest lo llamará
		//Cualquier 'expect' admite el 'done' como último parámetro
		/*.expect('lucas@gm.com')
		.expect('Lucas')
		.expect('Marcos')
		.expect('Ana')*/
		.expect('Hola soy express', done);
	});
	/*
	it('/ devuelve los datos de un usuario', function(done){
		supertest(usuarios)
		.get('/usuarios/1')
		.expect(200)
		.expect('1')
		.expect('8')
		.expect('lucas@gm.com')
		.expect('665372812')
		done();
	});
	
	it('/ devuelve 200 al crear usuario', function(done){
		supertest(usuarios)
		.post('/usuarios')
		.send({"nombre": "prueba"}, {"email": "prueba@gm.com"})
		.expect(200)
		.expect('La operación se ha realizado con mal.');
		done();
	});
	
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