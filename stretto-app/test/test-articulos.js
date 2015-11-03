var app = require('../app');
var supertest = require('supertest');
var assert = require('assert');
var bodyParser = require('body-parser');
app.use(bodyParser.json());

describe('test de la app web articulos', function(){
	it('GET / devuelve los artículos', function(done){
		supertest(app)
		.get('/stretto/articulos')
		.expect(200)
		.expect(function(res) {
			assert(res.text.indexOf('1') != -1);
			assert(res.text.indexOf('2') != -1);
			assert(res.text.indexOf('3') != -1);
			assert(res.text.indexOf('4') != -1);
			assert(res.text.indexOf('Guitarra') != -1);
			assert(res.text.indexOf('Bajo') != -1);
			assert(res.text.indexOf('Saxofon') != -1);
			assert(res.text.indexOf('Bateria') != -1);
		})
		.end(done);		
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
		var articulo = { nombre : 'banjo', tipo : '' };
		supertest(app)
		.post('/stretto/articulos')
		.auth('lucas@gm.com', 'l')
		.send(articulo)
		.expect(400)
		.expect('El tipo debe rellenarse.', done);
	});
	
	it('POST / devuelve 400 al crear artículo con tipo inexistente', function(done) {
		var articulo = { nombre : 'banjo', tipo : 'Cuerda' };
		supertest(app)
		.post('/stretto/articulos')
		.auth('lucas@gm.com', 'l')
		.send(articulo)
		.expect(400)
		.expect('El tipo de instrumento no se reconoce.', done);
	});
	
	it('POST / devuelve 201 al crear un artículo', function(done) {
		var articulo = { nombre : 'banjo', tipo : 'cuerda' };
		supertest(app)
		.post('/stretto/articulos')
		.auth('lucas@gm.com', 'l')
		.send(articulo)
		.expect(201)
		.expect('Operación realizada con éxito.', done);
	});
	
	it('PUT / devuelve 400 al modificar artículo con id no numérico', function(done) {
		var articulo = { nombre : 'banjo', tipo : 'cuerda' };
		supertest(app)
		.put('/stretto/articulos/aa')
		.auth('lucas@gm.com', 'l')
		.send(articulo)
		.expect(400)
		.expect('Identificador de artículo inválido.', done);
	});
	
	it('PUT / devuelve 404 al modificar artículo inexistente', function(done) {
		var articulo = { nombre : 'banjo', tipo : 'cuerda' };
		supertest(app)
		.put('/stretto/articulos/99999')
		.auth('lucas@gm.com', 'l')
		.send(articulo)
		.expect(404)
		.expect('No existe el artículo referido.', done);
	});
	
	it('PUT / devuelve 400 al modificar artículo con tipo vacio', function(done) {
		var articulo = { nombre : 'banjo', tipo : '' };
		supertest(app)
		.put('/stretto/articulos/3')
		.auth('lucas@gm.com', 'l')
		.send(articulo)
		.expect(400)
		.expect('El tipo debe rellenarse.', done);
	});
	
	it('PUT / devuelve 400 al modificar artículo con tipo inexistente', function(done) {
		var articulo = { nombre : 'banjo', tipo : 'Cuerda', usuario : '1' };
		supertest(app)
		.put('/stretto/articulos/3')
		.auth('lucas@gm.com', 'l')
		.send(articulo)
		.expect(400)
		.expect('El tipo de instrumento no se reconoce.', done);
	});	
	
	it('PUT / devuelve 204 al modificar un artículo', function(done) {
		var articulo = { nombre : 'banjo', tipo : 'cuerda' };
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