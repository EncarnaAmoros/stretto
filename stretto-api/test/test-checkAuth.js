var app = require('../app');
var models = require('../models');
var supertest = require('supertest');
var assert = require('assert');
var inicializarBD = require('./initializeBD');

describe('test de la función para comprobar auth', function(){
	//Inicializamos la BD antes de ejecutar los test
	before(function (done) {
		inicializarBD.initialize().then(function() {
			done();
		});
	});
	
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
	
});
