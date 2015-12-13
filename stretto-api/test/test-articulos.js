var app = require('../app');
var models = require('../models');
var supertest = require('supertest');
var assert = require('assert');
var inicializarBD = require('./initializeBD');

describe('test de la app web articulos', function(){
	//Inicializamos la BD antes de ejecutar los test
	before(function (done) {
		inicializarBD.initialize().then(function() {
			done();
		});
	});
	
	it('GET / devuelve los artículos', function(done){
		supertest(app)
		.get('/stretto/articulos')
		.expect(200)
		.expect(function(res) {
			assert(res.text.indexOf('21') != -1);
			assert(res.text.indexOf('20') != -1);
			assert(res.text.indexOf('19') != -1);
			assert(res.text.indexOf('18') != -1);
			assert(res.text.indexOf('Ukelele') != -1);
			assert(res.text.indexOf('Bandurria') != -1);
			assert(res.text.indexOf('Caja') != -1);
			assert(res.text.indexOf('Maracas') != -1);
		})
		.end(done);		
	});
	
	it('GET / devuelve 404 no hay artículos en página 4', function(done){
		supertest(app)
		.get('/stretto/articulos?page=4')
		.expect(404)
		.expect('Recurso no encontrado', done);
	});
	
	it('GET / devuelve 400 pues para el paginado se utiliza el atributo page', function(done){
		supertest(app)
		.get('/stretto/articulos?pag=2')
		.expect(400)
		.expect('Falta el parámetro page en la petición', done);
	});
	
	it('GET / devuelve 400 al buscar un artículo con id no numérico', function(done){
		supertest(app)
		.get('/stretto/articulos/aa')
		.expect(400)
		.expect('Identificador de artículo inválido.', done);		
	});
	
	it('GET / devuelve 404 al buscar un artículo inexistente', function(done){
		supertest(app)
		.get('/stretto/articulos/99999')
		.expect(404)
		.expect('No existe el artículo referido.', done);		
	});
	
	it('GET / devuelve un artículo', function(done){
		supertest(app)
		.get('/stretto/articulos/1')
		.expect(200)
		.expect(function(res) {
			assert(res.text.indexOf('1') != -1);
			assert(res.text.indexOf('Guitarra') != -1);
			assert(res.text.indexOf('La mejor guitarra que puedas ver') != -1);
			assert(res.text.indexOf('cuerda') != -1);
		})
		.end(done);		
	});
	
	it('POST / devuelve 400 al crear artículo con tipo vacio', function(done) {
		var articulo = { nombre : 'banjo', tipo : '', precio: 134 };
		supertest(app)
		.post('/stretto/articulos')
		.auth('lucas@gm.com', 'l')
		.send(articulo)
		.expect(400)
		.expect('El tipo debe rellenarse.', done);
	});
	
	it('POST / devuelve 400 al crear artículo con tipo inexistente', function(done) {
		var articulo = { nombre : 'banjo', tipo : 'Cuerda', precio: 134 };
		supertest(app)
		.post('/stretto/articulos')
		.auth('lucas@gm.com', 'l')
		.send(articulo)
		.expect(400)
		.expect('El tipo de instrumento no se reconoce.', done);
	});
	
	it('POST / devuelve 201 al crear un artículo', function(done) {
		var articulo = { nombre : 'banjo', tipo : 'cuerda', precio: 134 };
		supertest(app)
		.post('/stretto/articulos')
		.auth('lucas@gm.com', 'l')
		.send(articulo)
		.expect(201)
		.expect('Operación realizada con éxito.', done);
	});
	
	it('PUT / devuelve 400 al modificar artículo con id no numérico', function(done) {
		var articulo = { nombre : 'banjo', tipo : 'cuerda', precio: 134 };
		supertest(app)
		.put('/stretto/articulos/aa')
		.auth('lucas@gm.com', 'l')
		.send(articulo)
		.expect(400)
		.expect('Identificador de artículo inválido.', done);
	});
	
	it('PUT / devuelve 404 al modificar artículo inexistente', function(done) {
		var articulo = { nombre : 'banjo', tipo : 'cuerda', precio: 134 };
		supertest(app)
		.put('/stretto/articulos/99999')
		.auth('lucas@gm.com', 'l')
		.send(articulo)
		.expect(404)
		.expect('No existe el artículo referido.', done);
	});
	
	it('PUT / devuelve 400 al modificar artículo con tipo vacio', function(done) {
		var articulo = { nombre : 'banjo', tipo : '', precio: 134 };
		supertest(app)
		.put('/stretto/articulos/3')
		.auth('lucas@gm.com', 'l')
		.send(articulo)
		.expect(400)
		.expect('El tipo debe rellenarse.', done);
	});
	
	it('PUT / devuelve 400 al modificar artículo con tipo inexistente', function(done) {
		var articulo = { nombre : 'banjo', tipo : 'Cuerda', usuario : '1', precio: 134 };
		supertest(app)
		.put('/stretto/articulos/3')
		.auth('lucas@gm.com', 'l')
		.send(articulo)
		.expect(400)
		.expect('El tipo de instrumento no se reconoce.', done);
	});	
	
	it('PUT / devuelve 204 al modificar un artículo', function(done) {
		var articulo = { nombre : 'banjo', tipo : 'cuerda', precio: 134 };
		supertest(app)
		.put('/stretto/articulos/3')
		.auth('lucas@gm.com', 'l')
		.send(articulo)
		.expect(204, done);
	});
	
	it('DELETE / devuelve 400 al eliminar artículo con id no numérico', function(done){
		supertest(app)
		.delete('/stretto/articulos/aa')
		.auth('ana@gm.com', 'a')
		.expect(400)
		.expect('Identificador de artículo inválido.', done);
	});
	
	it('DELETE / devuelve 404 al eliminar artículo inexistente', function(done){
		supertest(app)
		.delete('/stretto/articulos/99999')
		.auth('ana@gm.com', 'a')
		.expect(404)
		.expect('No existe el artículo referido.', done);
	});
	
	it('DELETE / devuelve 204 al eliminar artículo', function(done){
		supertest(app)
		.delete('/stretto/articulos/2')
		.auth('ana@gm.com', 'a')
		.expect(204, done);
	});
	
});