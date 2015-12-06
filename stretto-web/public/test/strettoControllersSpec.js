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
			//Necesario para devolver lo que queramos que devuelva el servicio mockeado
      $httpBackend = _$httpBackend_;
			$routeParams.page = 1;
      $httpBackend.expectGET('http://localhost:3000/stretto/articulos?page='+1).
      	respond({_links: {}, data:[{name: 'Nexus S'}, {name: 'Motorola DROID'}]});
			
			//Mock de scope
      scope = $rootScope.$new();
			//Creamos el controlador a probar asignando scope
      ctrl = $controller('ArticulosCtrl2', {$scope: scope});
    }));
		
    it('debe crear el modelo de artículos con 2 items', function() {
     	//Al principio está vacío
			expect(scope.articulos).toEqual(undefined);
			//Al realizarse la petición $http obtendremos los datos
      $httpBackend.flush();
			//Deben haber estos dos datos en el scope determinado
      expect(scope.articulos).toEqual([{name: 'Nexus S'}, {name: 'Motorola DROID'}]);
    });
  });
});