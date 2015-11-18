var strettoControllers = angular.module('strettoControllers', []);

strettoControllers.controller('ArticulosCtrl',  ['$scope', '$http',
	function ($scope, $http) {
    $http.get('http://localhost:3000/stretto/articulos').success(function(data) {
      $scope.articulos = data.data;
    });
		$http.get('http://localhost:3000/stretto/tipos').success(function(data) {
      $scope.tipos = data;
    });
		$scope.orderProp = 'createdAt';
  }]);

strettoControllers.controller('ArticuloCtrl',  ['$scope', '$http', '$routeParams',
	function ($scope, $http, $routeParams) {
    $http.get('http://localhost:3000/stretto/articulos/'+$routeParams.id).success(function(data) {
      $scope.articulo = data.data;
			$scope.usuario = data.usuario;
    });
  }]);

strettoControllers.controller('UsuarioCtrl',  ['$scope', '$http', '$routeParams',
	function ($scope, $http, $routeParams) {
    $http.get('http://localhost:3000/stretto/usuarios/'+$routeParams.id).success(function(data) {
      $scope.usuario = data.data;
			$scope.last_articulos = data.articulos;
    });
  }]);

strettoControllers.controller('UsuarioArticulosCtrl',  ['$scope', '$http', '$routeParams',
	function ($scope, $http, $routeParams) {
    $http.get('http://localhost:3000/stretto/usuarios/'+$routeParams.id+'/articulos').success(function(data) {
      $scope.articulos = data.data;
    });
		$scope.orderProp = 'createdAt';
  }]);