'use strict';

/* jasmine specs para controladores */

describe('specs de los controladores de strettoControllers', function() {

	//Inyectamos el módulo de las rutas
  beforeEach(module('strettoApp'));
	
	//Inyectamos el módulo del servicio utilizado por el controlador
  beforeEach(module('strettoService'));
	
	/* TEST DEL CONTROLADOR ARTICULOSCTRL */
	
  describe('ArticulosCtrl', function(){
    var scope, ctrl, $httpBackend, $routeParams;

		//Para cada test: creación del controlador inyectando mocks necesarios (scope, etc)
    beforeEach(inject(function(_$httpBackend_, $rootScope, $controller, $routeParams) {
			$routeParams.page = 1;
			//Necesario para devolver lo que queramos que devuelva el servicio mockeado
      $httpBackend = _$httpBackend_;			
      $httpBackend.expectGET('http://localhost:3000/stretto/articulos?page='+$routeParams.page).
      	respond({_links: {}, data:[{nombre: 'Guitarra'}, {nombre: 'Piano'}]});
			$httpBackend.expectGET('http://localhost:3000/stretto/tipos').
      	respond([{nombre: 'cuerda'}, {nombre: 'viento'}, {nombre: 'percusion'}]);
			
			//Mock de scope
      scope = $rootScope.$new();
			//Creamos el controlador a probar asignando scope
      ctrl = $controller('ArticulosCtrl', {$scope: scope});
    }));
		
    it('debe crear el modelo con 2 artículos y 3 tipos', function() {
     	//Al principio está vacío
			expect(scope.articulos).toEqual(undefined);
			expect(scope.tipos).toEqual(undefined);
			//Al realizarse la petición $http obtendremos los datos
      $httpBackend.flush();
			//Deben haber estos dos datos en el scope determinado
      expect(scope.articulos).toEqual([{nombre: 'Guitarra'}, {nombre: 'Piano'}]);
			expect(scope.tipos).toEqual([{nombre: 'cuerda'}, {nombre: 'viento'}, {nombre: 'percusion'}]);
    });
		
		it('al pasar a pagina siguiente', function() {
    });
		
		it('al pasar a pagina anterior', function() {
    });

  });
	
	
	/* TEST DEL CONTROLADOR ARTICULOCTRL */
	
  describe('ArticuloCtrl', function(){
    var scope, ctrl, $httpBackend, $routeParams;

    beforeEach(inject(function(_$httpBackend_, $rootScope, $controller, $routeParams) {
			$routeParams.id = 1;
      $httpBackend = _$httpBackend_;			
      $httpBackend.expectGET('http://localhost:3000/stretto/articulos/'+$routeParams.id).
      	respond({data: {nombre: 'Guitarra', tipo: 'Cuerda', precio: '125.99'}, 
								 usuario: {id: 1, nombre: 'Lucas', email: 'lucas@gm.com'}});

      scope = $rootScope.$new();
      ctrl = $controller('ArticuloCtrl', {$scope: scope});
    }));
		
    it('debe crear el modelo con 1 artículo y su usuario asociado', function() {
     	//Al principio está vacío
			expect(scope.articulo).toEqual(undefined);
			expect(scope.usuario).toEqual(undefined);
			//Al realizarse la petición $http obtendremos los datos
      $httpBackend.flush();
      expect(scope.articulo).toEqual({nombre: 'Guitarra', tipo: 'Cuerda', precio: '125.99'});
			expect(scope.usuario).toEqual({id: 1, nombre: 'Lucas', email: 'lucas@gm.com'});
    });
		
		it('para comprar artículo', function() {
    });
		
  });
	
	
	/* TEST DEL CONTROLADOR USUARIOARTICULOSCTRL */
	
  describe('UsuarioArticulosCtrl', function(){
    var scope, ctrl, $httpBackend, $routeParams;

    beforeEach(inject(function(_$httpBackend_, $rootScope, $controller, $routeParams) {
			$routeParams.id = 1;
			$routeParams.page = 1;
      $httpBackend = _$httpBackend_;			
      $httpBackend.expectGET('http://localhost:3000/stretto/usuarios/'+$routeParams.id+'/articulos?page='+$routeParams.page).
      	respond({_links: {},
								 data:	 [{nombre: 'Guitarra', tipo: 'cuerda', precio: '145.50'},
											 		{nombre: 'Saxofon', tipo: 'viento', precio: '327.99'},
											 		{nombre: 'Bateria', tipo: 'percusión', precio: '905.49'}]});
			$httpBackend.expectGET('http://localhost:3000/stretto/tipos').
      	respond([{nombre: 'cuerda'}, {nombre: 'viento'}, {nombre: 'percusion'}]);

      scope = $rootScope.$new();
      ctrl = $controller('UsuarioArticulosCtrl', {$scope: scope});
    }));
		
    it('debe crear el modelo con 3 artículos y 3 tipos de instrumentos', function() {
     	//Al principio está vacío
			expect(scope.articulos).toEqual(undefined);
			expect(scope.tipos).toEqual(undefined);
			//Al realizarse la petición $http obtendremos los datos
      $httpBackend.flush();
      expect(scope.articulos).toEqual([{nombre: 'Guitarra', tipo: 'cuerda', precio: '145.50'}, 
																			 {nombre: 'Saxofon', tipo: 'viento', precio: '327.99'},
																			 {nombre: 'Bateria', tipo: 'percusión', precio: '905.49'}]);
			expect(scope.tipos).toEqual([{nombre: 'cuerda'}, {nombre: 'viento'}, {nombre: 'percusion'}]);
    });
		
		it('al pasar a pagina siguiente??', function() {
    });
		
		it('al pasar a pagina anterior??', function() {
    });
		
		it('al editar un artículo??', function() {
    });
		
		it('al eliminar un artículo??', function() {
			//El eliminar un artículo es cosa de la API (que no hemos de probar)
			//Cuando se elimina ya no sale porque tenemos otros datos (nueva peticion GET al API)
			//¿ENTONCES hay que PROBARLO?
		});
		
		it('al añadir un artículo??', function() {
		});
		
  });
	
	/* TEST DEL CONTROLADOR ADDARTICULOS */
	
  describe('AddArticulosCtrl', function(){
    var scope, ctrl, $httpBackend, $routeParams;

   /* beforeEach(inject(function(_$httpBackend_, $rootScope, $controller, $routeParams) {
			$routeParams.id = 1;
			$routeParams.page = 1;
      $httpBackend = _$httpBackend_;			
      $httpBackend.expectGET('http://localhost:3000/stretto/usuarios/'+$routeParams.id+'/articulos?page='+$routeParams.page).
      	respond({_links: {},
								 data:	 [{nombre: 'Guitarra', tipo: 'cuerda', precio: '145.50'},
											 		{nombre: 'Saxofon', tipo: 'viento', precio: '327.99'},
											 		{nombre: 'Bateria', tipo: 'percusión', precio: '905.49'}]});
			$httpBackend.expectGET('http://localhost:3000/stretto/tipos').
      	respond([{nombre: 'cuerda'}, {nombre: 'viento'}, {nombre: 'percusion'}]);

      scope = $rootScope.$new();
      ctrl = $controller('UsuarioArticulosCtrl', {$scope: scope});
    }));
		
    it('debe comprobar algo del add articulo modal??', function() {
    });
		*/
  });

	/* TEST DEL CONTROLADOR USUARIOCTRL */
	
  describe('UsuarioCtrl', function(){
    var scope, ctrl, $httpBackend, $routeParams;

    beforeEach(inject(function(_$httpBackend_, $rootScope, $controller, $routeParams) {
			$routeParams.id = 1;
      $httpBackend = _$httpBackend_;			
      $httpBackend.expectGET('http://localhost:3000/stretto/usuarios/'+$routeParams.id).
      	respond({data: {nombre: 'Lucas', email: 'lucas@gm.com', password: 'l', tlf: '665372812'}, 
								 articulos: [{nombre: 'Guitarra', tipo: 'cuerda', precio: '145.50', descripcion: 'El mejor articulo'}, 
														 {nombre: 'Saxofon', tipo: 'viento', precio: '327.99', descripcion: 'El mejor articulo'},
														 {nombre: 'Bateria', tipo: 'percusión', precio: '905.49', descripcion: 'El mejor articulo'}]});

      scope = $rootScope.$new();
      ctrl = $controller('UsuarioCtrl', {$scope: scope});
    }));
		
    it('debe crear el modelo con 1 usuario y sus 3 artículos asociados', function() {
     	//Al principio está vacío
			expect(scope.usuario).toEqual(undefined);
			expect(scope.last_articulos).toEqual(undefined);
			//Al realizarse la petición $http obtendremos los datos
      $httpBackend.flush();
      expect(scope.usuario).toEqual({nombre: 'Lucas', email: 'lucas@gm.com', password: 'l', tlf: '665372812'});
			expect(scope.last_articulos)
				.toEqual([{nombre: 'Guitarra', tipo: 'cuerda', precio: '145.50', descripcion: 'El mejor articulo...'}, 
														 {nombre: 'Saxofon', tipo: 'viento', precio: '327.99', descripcion: 'El mejor articulo...'},
														 {nombre: 'Bateria', tipo: 'percusión', precio: '905.49', descripcion: 'El mejor articulo...'}]);
    });
		
		it('para editar un usuario??', function() {
    });
		
		it('para eliminar un usuario??', function() {
    });
		
  });

	/* TEST DEL CONTROLADOR LOGINCTRL */
	
  describe('LoginCtrl', function(){
    var scope, ctrl, $httpBackend, $routeParams;

    /*beforeEach(inject(function(_$httpBackend_, $rootScope, $controller, $routeParams) {
			$routeParams.id = 1;
      $httpBackend = _$httpBackend_;			
      $httpBackend.expectGET('http://localhost:3000/stretto/articulos/'+$routeParams.id).
      	respond({data: {nombre: 'Guitarra', tipo: 'Cuerda', precio: '125.99'}, 
								 usuario: {id: 1, nombre: 'Lucas', email: 'lucas@gm.com'}});

      scope = $rootScope.$new();
      ctrl = $controller('LoginCtrl', {$scope: scope});
    }));
		
    it('debe comprobar algo del login??', function() {  
    });*/
		
  });
	
});



//DUDAS:
/*
Al clicar?
Comprar un artículo salga mensaje?
Al pasar páginas?
Al mostrar modal?
*/