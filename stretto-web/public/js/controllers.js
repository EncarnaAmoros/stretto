var strettoControllers = angular.module('strettoControllers', []);

/* Login para los usuarios */

strettoControllers.controller('LoginCtrl', ['$scope', '$http', '$window',
	function ($scope, $http, $window) {
		console.log("hola");
		$scope.datos = {};
		
		$scope.login = function() {
			console.log("mira: "+$scope.datos.email+" y "+$scope.datos.password);
			var femail = $scope.datos.email;
			if($scope.datos.email=="1" && $scope.datos.password=="1") {
				alert("Email o password incorrectos");
			} else {
				localStorage.email = $scope.datos.email;
				localStorage.password = $scope.datos.password;
				$window.location.href = 'http://localhost:4000/articulos';
			}
		}
	}]);

/* Mostramos los artículos de forma general */

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

/* Mostramos un artículo en detalle */

strettoControllers.controller('ArticuloCtrl',  ['$scope', '$http', '$routeParams',
	function ($scope, $http, $routeParams) {
    $http.get('http://localhost:3000/stretto/articulos/'+$routeParams.id).success(function(data) {
      $scope.articulo = data.data;
			$scope.usuario = data.usuario;
    });
  }]);

/* Mostramos un usuario en detalle */

strettoControllers.controller('UsuarioCtrl',  ['$scope', '$http', '$routeParams',
	function ($scope, $http, $routeParams) {
    $http.get('http://localhost:3000/stretto/usuarios/'+$routeParams.id).success(function(data) {
      $scope.usuario = data.data;
			$scope.last_articulos = data.articulos;
    });
  }]);

/* Mostramos los artículos de un usuario pudiendo editarlos, eliminarlos y agregar uno nuevo */

strettoControllers.controller('UsuarioArticulosCtrl',  ['$scope', '$http', '$routeParams', 
	function ($scope, $http, $routeParams) {
		//Obtenemos los artículos del usuario
    $http.get('http://localhost:3000/stretto/usuarios/'+$routeParams.id+'/articulos'+'?page='+$routeParams.page)
			.success(function(data) {
				$scope.articulos = data.data;
				$scope.count = data.count;
				var totalitems = data.total;
				var numPaginas = totalitems/10;
			
				//Para el paginado
				$scope.paginas = [];
				var arrayy = new Array();
				for(i=0;i<10;i++) {//numPaginas;i++) {
					var jsonArg1 = new Object();
							jsonArg1.n = i++;
							arrayy.push(i++);
				}
				var myJsonString = JSON.stringify(arrayy);
				console.log("miraa:"+myJsonString);
				$scope.paginas = myJsonString;
    });
		
		//Obtenemos los tipos de instrumentos que hay
		$http.get('http://localhost:3000/stretto/tipos').success(function(data) {
      $scope.tipos = data;
    });
		$scope.orderProp = 'createdAt';
		
		//Inicializamos
		$scope.datos = {};
		
		//Funcion para añadir un nuevo artículo
		$scope.addArticulo = function() {
			$http({
				method: "POST",
				url: 'http://localhost:3000/stretto/articulos',
				data: $scope.datos,
				headers: {'Authorization': 'Basic ' + btoa(localStorage.email+":"+localStorage.password)}
			})
			.success(function(data, status, headers, config) {
				alert(data);
				$window.location.href = 'http://localhost:4000/usuarios/'+$routeParams.id+'/articulos';
			})
			.error(function(data, status, headers, config) {
				alert("Error código: "+status+". "+data);
			})
  	}
	}]);