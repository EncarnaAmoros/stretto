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

strettoControllers.controller('ArticulosCtrl',  ['$scope', '$http',  '$routeParams', '$window',
	function ($scope, $http, $routeParams, $window) {
    $http.get('http://localhost:3000/stretto/articulos?page='+$routeParams.page).success(function(data) {
      $scope.articulos = data.data;
    });
		$http.get('http://localhost:3000/stretto/tipos').success(function(data) {
      $scope.tipos = data;
    });
		$scope.orderProp = 'createdAt';
		
		//Funcion para pasar de página siguiente
		$scope.pasarPaginaSiguiente = function() {
			if($routeParams.page=="" || $routeParams.page==undefined) {
				$window.location.href = 'http://localhost:4000/articulos?page=2';
			} else {				
				var pagina = 1 + parseInt($routeParams.page);
				$window.location.href = 'http://localhost:4000/articulos?page=' + pagina;	
			}			
		}
		
		//Funcion para pasar de página anterior
		$scope.pasarPaginaAnterior = function() {
			if($routeParams.page=="" || $routeParams.page==undefined || $routeParams.page==1 || $routeParams.page=="1") {
				console.log("no hay anterior");
			} else {				
				var pagina = parseInt($routeParams.page) - 1;
				$window.location.href = 'http://localhost:4000/articulos?page=' + pagina;	
			}			
		}
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

strettoControllers.controller('UsuarioArticulosCtrl',  ['$scope', '$http', '$routeParams', '$window', 
	function ($scope, $http, $routeParams, $window) {
		//Obtenemos los artículos del usuario
    $http.get('http://localhost:3000/stretto/usuarios/'+$routeParams.id+'/articulos'+'?page='+$routeParams.page)
			.success(function(data) {
				$scope.articulos = data.data;
    });
		
		//Orden por el que aparecen los articulos
		$scope.orderProp = 'createdAt';
		
		//Obtenemos los tipos de instrumentos que hay
		$http.get('http://localhost:3000/stretto/tipos').success(function(data) {
      $scope.tipos = data;
    });
		
		//Funcion para pasar de página siguiente
		$scope.pasarPaginaSiguiente = function() {
			console.log("1");
			if($routeParams.page=="" || $routeParams.page==undefined) {
				$window.location.href = 'http://localhost:4000/usuarios/'+$routeParams.id+'/articulos?page=2';
			} else {
				console.log("2");
				var pagina = 1 + parseInt($routeParams.page);
				$window.location.href = 'http://localhost:4000/usuarios/'+$routeParams.id+'/articulos?page=' + pagina;	
			}			
		}
		
		//Funcion para pasar de página anterior
		$scope.pasarPaginaAnterior = function() {
			if($routeParams.page=="" || $routeParams.page==undefined || $routeParams.page==1) {
			} else {				
				var pagina = parseInt($routeParams.page) - 1;
				$window.location.href = 'http://localhost:4000/usuarios/'+$routeParams.id+'/articulos?page=' + pagina;	
			}			
		}
		
		//Inicializamos
		$scope.datos = {};
		
		//Funcion para añadir un nuevo artículo
		$scope.addArticulo = function($window) {
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