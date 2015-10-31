var app = require('../app');
var supertest = require('supertest');
var assert = require('assert');
var bodyParser = require('body-parser');
app.use(bodyParser.json());

describe('test de la app web tipos', function(){

	it('GET / devuelve los datos de un usuario', function(done){
			supertest(app)
			.get('/stretto/tipos')
			.expect(200)
			.expect(function(res) {
				assert(res.text.indexOf('1') != -1);
				assert(res.text.indexOf('2') != -1);
				assert(res.text.indexOf('3') != -1);
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