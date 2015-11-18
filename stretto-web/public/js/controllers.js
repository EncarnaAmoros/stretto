var strettoControllers = angular.module('strettoControllers', []);

strettoControllers.controller('ArticulosCtrl',  ['$scope', '$http',
	function ($scope, $http) {
    $http.get('http://localhost:3000/stretto/articulos').success(function(data) {
      $scope.articulos = data.data;
    });
		$scope.orderProp = 'createdAt';
  }]);