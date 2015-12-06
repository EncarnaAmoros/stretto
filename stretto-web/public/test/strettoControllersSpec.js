'use strict';

/* jasmine specs for controllers go here */
describe('test de ArticulosCtrl', function() {

  beforeEach(module('strettoApp'));
  beforeEach(module('strettoService'));
  describe('PhoneListCtrl', function(){
    var scope, ctrl, $httpBackend;

    beforeEach(inject(function(_$httpBackend_, $rootScope, $controller) {
      $httpBackend = _$httpBackend_;
      $httpBackend.expectGET('http://localhost:3000/stretto/articulos?page=1').
          respond([{name: 'Nexus S'}, {name: 'Motorola DROID'}]);

      scope = $rootScope.$new();
      ctrl = $controller('ArticulosCtrl2', {$scope: scope});
    }));
    it('should create "phones" model with 2 phones fetched from xhr', function() {
     // expect(scope.articulos).toEqual([]);
      $httpBackend.flush();

      expect(scope.articulos).toEqual([{name: 'Nexus S'}, {name: 'Motorola DROID'}]);
    });
  });
});




/*describe('controller: MainCtrl', function() {
  var ctrl, foo, $scope;

  beforeEach(module('strettoService'));
	beforeEach(module('strettoControllers'));

  beforeEach(inject(function($rootScope, $controller) {
    articulosService = {
      getArticulos: function() {}
    };
    spyOn(articulosService, 'getArticulos').and.returnValue("Foo"); // <----------- HERE

    $scope = $rootScope.$new();

    ctrl = $controller('ArticulosCtrl2', {$scope: $scope , articulosService: articulosService });
  }));

  it('Should call foo fn', function() {
    expect($scope.articulos).toBe('Foo');
  });

});*/




/*describe('Controlador: ArticulosController', function() {
  var scope, articuloService, httpBackend;
  
	//NEWWW-Módulo donde se encuentra el controler
  beforeEach(module('strettoControllers'));
	
	//Creamos el módulo con el mock del servicio vacío
  beforeEach(function() {
		var mockStrettoService = {};
		module('strettoService', function($provide) {
			$provide.value('articuloService', mockStrettoService);
  	});
    
	//Las peticiones con $http se fijarán en estos datos sin llamar a la API (mock)
	inject(function($q) {
  	mockStrettoService.data = [{nombre: 'Angular'},{nombre: 'Ember'}];
      
		//Mockeamos el servicio con sus llamadas
		mockStrettoService.getArticulos = function(page) {
			var defer = $q.defer();    
			defer.resolve([{nombre: 'Angular'},{nombre: 'Ember'}]);        
			return defer.promise;
		};
		
   });
		
  });
	
	//Inyectamos el mock del servicio que ya no está vacio
  beforeEach(inject(function($controller, $rootScope, _articuloService_, $httpBackend) {
    scope = $rootScope.$new();
    articuloService = _articuloService_;
		httpBackend = $httpBackend;
    $controller('ArticulosCtrl2', {$scope: scope, articuloService: articuloService });
    scope.$digest();
		console.log("11111");
		console.log(articuloService);
		console.log(scope);
  }));
  
  it('debe contener todos los artículos definidos al principio', function() {
		console.log("1");
		httpBackend.when('GET', 'http://localhost:3000/stretto/articulos?page=1').passThrough();
    expect(scope.articulos).toEqual([{nombre: 'Angular'},{nombre: 'Ember'}]);
  });
  
});*/