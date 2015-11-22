var app = require('../app');
var models = require('../models');
var supertest = require('supertest');
var assert = require('assert');
var inicializarBD = require('./initializeBD');

describe('test de la app web tipos', function(){
	//Inicializamos la BD antes de ejecutar los test
	before(function (done) {
		inicializarBD.initialize().then(function() {
			done();
		});
	});

	it('GET / devuelve todos los tipos de artículos', function(done){
			supertest(app)
			.get('/stretto/tipos')
			.expect(200)
			.expect(function(res) {
				assert(res.text.indexOf('cuerda') != -1);
				assert(res.text.indexOf('viento') != -1);
				assert(res.text.indexOf('percusion') != -1);
			})
			.end(done);
		});
	
	it('GET / devuelve 404 al buscar artículos de un tipo inexistente', function(done){
			supertest(app)
			.get('/stretto/tipos/blabla/articulos')
			.expect(404)
			.expect('No existe el tipo referido.', done);
		});
	
	it('GET / devuelve los artículos de un determinado tipo', function(done){
			supertest(app)
			.get('/stretto/tipos/cuerda/articulos')
			.expect(200)
			.expect(function(res) {
				assert(res.text.indexOf('Guitarra') != -1);
				assert(res.text.indexOf('Bajo') != -1);
			})
			.end(done);
		});
	
});