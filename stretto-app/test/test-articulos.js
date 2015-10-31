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
	
	it('POST / devuelve 400 al crear artículo con Tipo vacio', function(done) {
		var articulo = { nombre : 'banjo', tipo : '', usuario : '1' };
		supertest(app)
		.post('/stretto/articulos')
		.auth('lucas@gm.com', 'l')
		.send(articulo)
		.expect(400)
		.expect('Tipo y usuario deben rellenarse.', done);
	});
	
	it('POST / devuelve 400 al crear artículo con Usuario vacio', function(done) {
		var articulo = { nombre : 'banjo', tipo : 'cuerda', usuario : '' };
		supertest(app)
		.post('/stretto/articulos')
		.auth('lucas@gm.com', 'l')
		.send(articulo)
		.expect(400)
		.expect('Tipo y usuario deben rellenarse.', done);
	});
	
	it('POST / devuelve 400 al crear artículo con tipo inexistente', function(done) {
		var articulo = { nombre : 'banjo', tipo : 'Cuerda', usuario : '1' };
		supertest(app)
		.post('/stretto/articulos')
		.auth('lucas@gm.com', 'l')
		.send(articulo)
		.expect(400)
		.expect('El tipo de instrumento no se reconoce.', done);
	});
	
	it('POST / devuelve 400 al crear artículo con usuario inexistente', function(done) {
		var articulo = { nombre : 'banjo', tipo : 'cuerda', usuario : '99999' };
		supertest(app)
		.post('/stretto/articulos')
		.auth('lucas@gm.com', 'l')
		.send(articulo)
		.expect(400)
		.expect('El usuario introducido no se reconoce.', done);
	});
	
/*	
	
	it('POST / devuelve 201 al crea usuario', function(done) {
		var usuario = { nombre : 'usuario', email : 'usuario@gm.com'};
		supertest(app)
		.post('/stretto/usuarios')
		//.field('email', 'email') No va :(
		.send(usuario)
		.expect(201)
		.expect('Operación realizada con éxito.', done);
	});
	
	it('POST / devuelve 400 al crear usuario con email vacio', function(done) {
		var usuario = { nombre : 'usuario', email : ''};
		supertest(app)
		.post('/stretto/usuarios')
		.send(usuario)
		.expect(400)
		.expect('El email es obligatorio.', done);
	});
	
	it('PUT / devuelve 400 al actualizar usuario con id no numérico', function(done){
		var usuario = { nombre : 'usuario', email : 'usuario@gm.com'};
		supertest(app)
		.put('/stretto/usuarios/aa')
		.auth('lucas@gm.com', 'l')
		.send(usuario)
		.expect(400)
		.expect('Identificador de usuario inválido.', done);
	});
	
	it('PUT / devuelve 404 al actualizar usuario inexistente', function(done){
		var usuario = { nombre : 'usuario', email : 'usuario@gm.com'};
		supertest(app)
		.put('/stretto/usuarios/99999')
		.auth('lucas@gm.com', 'l')
		.send(usuario)
		.expect(404)
		.expect('No existe el usuario referido.', done);
	});
	
	it('PUT / devuelve 400 al actualizar usuario con email vacio', function(done){
		var usuario = { nombre : 'usuario', email : ''};
		supertest(app)
		.put('/stretto/usuarios/2')
		.auth('lucas@gm.com', 'l')
		.send(usuario)
		.expect(400)
		.expect('El email es obligatorio.', done);
	});
	
	it('PUT / devuelve 204 al actualizar usuario existente', function(done){
		var usuario = { nombre : 'Ana', email : 'anaNuevoEmail@gm.com'};
		supertest(app)
		.put('/stretto/usuarios/2')
		.auth('lucas@gm.com', 'l')
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
	});*/
	
});