describe('pruebas del controlador ArticulosCtrl', function () {

	//Módulo donde se encuentra el controler
  beforeEach(module('strettoControllers'));

	//Inyectamos la dependencia con el servicio
  beforeEach(angular.mock.module({
    'articulosService': { 
      getArticulos: function(id) { 
        return [{ nombre: 'Aniseed Syrup', precio: 2, tipo: 'Condiments' }]; 
      }
    }
  }));

  var $controller;
	
	//Inyectamos el controlador
  beforeEach(inject(function(_$controller_){
    $controller = _$controller_;
  }));

	it('controlador ArticulosCtrl', function () {
		var $scope = {};
		var controller = $controller('ArticulosCtrl2', { $scope: $scope });
		expect($scope.articulos).toEqual([{ nombre: 'Aniseed Syrup', precio: 2, tipo: 'Condiments' }]);
	});

});



/*describe('calculator', function () {

    beforeEach(angular.mock.module('strettoControllers'));

    var controller;

    beforeEach(angular.mock.inject(function GetDependencies(CategoryService){
      controller = CategoryService;
    }));

    describe('sum', function () {
        it('1 + 1 should equal 2', function () {
            var $scope = {};
            var controller = $controller('CalculatorController', { $scope: $scope });
            $scope.x = 1;
            $scope.y = 2;
            $scope.sum();
            expect($scope.z).toBe(3);
        }); 
    });

});*/