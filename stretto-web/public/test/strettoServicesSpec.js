'use strict';

describe('Modulo strettoService', function () {
 
	beforeEach(function () {
		module('strettoService');
	});

	//TEST TIPOS SERVICE
	
	describe('Tipos service', function () {

		var tiposService;

		beforeEach(function () {
			inject(['tiposService', function (service, $http) {
				tiposService = service;
			}]);
			
		});

		it('chequea la existencia del servicio tiposService', function () {
			var res = tiposService;
			expect(res).toBeDefined();
		});
		
		it('chequea la existencia del servicio tiposService.getTipos', function () {
			var res = tiposService.getTipos();
			expect(res).toBeDefined();
		});
		
	});
	
	//TEST ARTICULO SERVICE
	
	describe('articulo service', function () {

		var articuloService;
		
		beforeEach(function () {
			inject(['articuloService', function (service) {
				articuloService = service;
			}]);
		});
		
		it('chequea la existencia del servicio articuloService', function () {
			var res = articuloService;
			expect(res).toBeDefined();
		});

		it('chequea la existencia del servicio articuloService.getArticulo', function () {
			var res = articuloService.getArticulo(1);
			expect(res).toBeDefined();
		});
		
		it('chequea la existencia del servicio articuloService.addArticulo', function () {
			var articulo = {};
			var res = articuloService.addArticulo(articulo);
			expect(res).toBeDefined();
		});
		
		it('chequea la existencia del servicio articuloService.deleteArticulo', function () {
			var res = articuloService.deleteArticulo(1);
			expect(res).toBeDefined();
		});
		
		it('chequea la existencia del servicio articuloService.updateArticulo', function () {
			var articulo = {};
			var res = articuloService.updateArticulo(articulo);
			expect(res).toBeDefined();
		});
		
	});
	
	//TEST ARTICULOS SERVICE
	
	describe('articulos service', function () {

		var articulosService;
		
		beforeEach(function () {
			inject(['articulosService', function (service) {
				articulosService = service;
			}]);
		});
		
		it('chequea la existencia del servicio articulosService', function () {
			var res = articulosService;
			expect(res).toBeDefined();
		});

		it('chequea la existencia del servicio articulosService.getArticulos', function () {
			var page = 2;
			var res = articulosService.getArticulos(page);
			expect(res).toBeDefined();
		});
		
		it('chequea la existencia del servicio articulosService.getArticulosUsuario', function () {
			var id = 1;
			var page = 1;
			var res = articulosService.getArticulosUsuario(id, page);
			expect(res).toBeDefined();
		});
		
	});
	
	//TEST USUARIO SERVICE
	
	describe('usuario service', function () {

		var usuarioService;
		
		beforeEach(function () {
			inject(['usuarioService', function (service) {
				usuarioService = service;
			}]);
		});
		
		it('chequea la existencia del servicio usuarioService', function () {
			var res = usuarioService;
			expect(res).toBeDefined();
		});

		it('chequea la existencia del servicio usuarioService.deleteUsuario', function () {
			var res = usuarioService.deleteUsuario(1);
			expect(res).toBeDefined();
		});
		
		it('chequea la existencia del servicio usuarioService.updateUsuario', function () {
			var usuario = {};
			var res = usuarioService.updateUsuario(usuario);
			expect(res).toBeDefined();
		});
		
	});
	
	//TEST LOGIN SERVICE
	
	describe('login service', function () {

		var loginService;
		
		beforeEach(function () {
			inject(['loginService', function (service) {
				loginService = service;
			}]);
		});
		
		it('chequea la existencia del servicio loginService', function () {
			var res = loginService;
			expect(res).toBeDefined();
		});
		
		it('chequea la existencia del servicio loginService.getLogin', function () {
			var email = 'lucas@gm.com';
			var password = 'l';
			var res = loginService.getLogin(email, password);
			expect(res).toBeDefined();
		});
		
	});
	
});