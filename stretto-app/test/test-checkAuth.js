var app = require('../app');
var supertest = require('supertest');
var assert = require('assert');
var bodyParser = require('body-parser');
app.use(bodyParser.json());

describe('test de la función para comprobar auth', function(){
	it('PUT / devuelve 401 cuando intentamos entrar sin auth', function(done){
		var usuario = { nombre : 'Ana', email : 'anaNuevoEmail@gm.com'};
		supertest(app)
		.put('/stretto/usuarios/2')
		.send(usuario)
		.expect(401)
		.expect('Debes autentificarte.', done);
	});
	
	it('PUT / devuelve 403 cuando accedemos con auth inexistente', function(done){
		var usuario = { nombre : 'Ana', email : 'anaNuevoEmail@gm.com'};
		supertest(app)
		.put('/stretto/usuarios/2')
		.auth('@gm.com', 'g')
		.send(usuario)
		.expect(403)
		.expect('Email o contraseña incorrectos.', done);
	});
	
	it('PUT / devuelve 403 cuando accedemos con email antiguo de usuario', function(done){
		var usuario = { email : 'anaNuevoEmail@gm.com', password: 'a' };
		//Modificamos email
		supertest(app)
		.put('/stretto/usuarios/2')
		.auth('ana@gm.com', 'a')
		.send(usuario)
		.expect(200)
		.end(function(err, res) {
			//Miramos si deja entrar con email antiguo
			supertest(app)
			.put('/stretto/usuarios/2')
			.auth('ana@gm.com', 'a')
			.send(usuario)
			.expect(403)
			.expect('Email o contraseña incorrectos.', done);
		});
	});

	it('PUT / devuelve 403 cuando accedemos con password antiguo de usuario', function(done){
		var usuario = { email: 'juan@gm.com', password : 'jjj' };
		//Modificamos pass
		supertest(app)
		.put('/stretto/usuarios/3')
		.auth('juan@gm.com', 'j')
		.send(usuario)
		.expect(200)
		.end(function(err, res) {
			//Miramos si deja entrar con email antiguo
			supertest(app)
			.put('/stretto/usuarios/3')
			.auth('juan@gm.com', 'j')
			.send(usuario)
			.expect(403)
			.expect('Email o contraseña incorrectos.', done);
		});
	});
});
