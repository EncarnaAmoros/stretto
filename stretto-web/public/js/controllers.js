var strettoControllers = angular.module('strettoControllers', ['ui.bootstrap','ngRoute']);

strettoControllers.controller('NavCtrl', ['$scope', '$http', '$window',
	function ($scope, $http, $window) {
		var actualizarNavBar = function () {
			if(localStorage.email!=undefined) {
				$scope.showme = false;
				$scope.usuario = localStorage.email;
			}
			else {
				$scope.showme = true;
				$scope.mensaje = "Iniciar sesión";
			}
		}
		actualizarNavBar();
		
		$scope.logout = function() {
			localStorage.clear();
			actualizarNavBar();
		}

	}]);

/* Login para los usuarios */

strettoControllers.controller('LoginCtrl', ['$scope', '$http', '$window',
	function ($scope, $http, $window) {
		//Inicializamos
		$scope.datos = {};		
		
		//Comprobamos login
		$scope.login = function() {
			$http.get('http://localhost:3000/stretto/usuarios/login?email='+$scope.datos.email+'&password='+$scope.datos.password)
				//No hay error al iniciar sesion, guardamos auth
				.success(function(data) {
					localStorage.email = $scope.datos.email;
					localStorage.password = $scope.datos.password;
					$window.location.href = 'articulos';
    		})
				//Hay error, lo mostramos
				.error(function(data) {
					alert("Email o password incorrectos");
				});
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
		
		//Funcion para pasar de página siguiente
		$scope.pasarPaginaSiguiente = function() {
			if($routeParams.page=="" || $routeParams.page==undefined) {
				$window.location.href = 'articulos?page=2';
			} else {				
				var pagina = 1 + parseInt($routeParams.page);
				$window.location.href = 'articulos?page=' + pagina;	
			}			
		}
		
		//Funcion para pasar de página anterior
		$scope.pasarPaginaAnterior = function() {
			if($routeParams.page=="" || $routeParams.page==undefined || $routeParams.page==1 || $routeParams.page=="1") {
				console.log("no hay anterior");
			} else {				
				var pagina = parseInt($routeParams.page) - 1;
				$window.location.href = 'articulos?page=' + pagina;	
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

strettoControllers.controller('UsuarioArticulosCtrl',  ['$scope', '$http', '$routeParams', '$window', '$modal',
	function ($scope, $http, $routeParams, $window, $modal) {
		//Obtenemos los artículos del usuario
		var actualizararticulos = function() {
			$http.get('http://localhost:3000/stretto/usuarios/'+$routeParams.id+'/articulos'+'?page='+$routeParams.page)
				.success(function(data) {
					$scope.articulos = data.data;
			});
		}
	 	actualizararticulos();
		
		var tipos;
		//Obtenemos los tipos de instrumentos que hay
		$http.get('http://localhost:3000/stretto/tipos').success(function(data) {
      $scope.tipos = data;
			tipos = data;
    });
		
		var articulo;
		//Funcion para mostrar articulo en forma de edit
		$scope.editableView = function() {
			//articulo = $scope.articulo;
		/*$scope.noshowdetail=true;
			$scope.showedit=true;*/
		}
		
		$scope.cancelarEdit = function() {
			console.log("hola");
			actualizararticulos();
			//$scope.articulo = articulo;
		}
		
		//Funcion para mostrar artículo en forma de detail
		$scope.detailView = function() {
			/*$scope.noshowdetail=false;
			$scope.showedit=false;*/
		}
		
		//Funcion para pasar de página siguiente
		$scope.pasarPaginaSiguiente = function() {
			console.log("1");
			if($routeParams.page=="" || $routeParams.page==undefined) {
				$window.location.href = 'usuarios/'+$routeParams.id+'/articulos?page=2';
			} else {
				console.log("2");
				var pagina = 1 + parseInt($routeParams.page);
				$window.location.href = 'usuarios/'+$routeParams.id+'/articulos?page=' + pagina;	
			}			
		}
		
		//Funcion para pasar de página anterior
		$scope.pasarPaginaAnterior = function() {
			if($routeParams.page=="" || $routeParams.page==undefined || $routeParams.page==1) {
			} else {				
				var pagina = parseInt($routeParams.page) - 1;
				$window.location.href = 'usuarios/'+$routeParams.id+'/articulos?page=' + pagina;	
			}			
		}
		
		//Funcion para eliminar un artículo
		$scope.deleteArticulo = function(id) {
			$http({
				method: "DELETE",
				url: 'http://localhost:3000/stretto/articulos/'+id,
				headers: {'Authorization': 'Basic ' + btoa(localStorage.email+":"+localStorage.password)}
			})
			.success(function(data, status, headers, config) {
				alert("Artículo eliminado con éxito");
				actualizararticulos();
			})
			.error(function(data, status, headers, config) {
				alert("Error código: "+status+". "+data);
			})
  	}
		
		//Funcion para actualizar un artículo
		$scope.updateArticulo = function(articulo) {
			$http({
				method: "PUT",
				url: 'http://localhost:3000/stretto/articulos/'+articulo.id,
				data: articulo,
				headers: {'Authorization': 'Basic ' + btoa(localStorage.email+":"+localStorage.password)}
			})
			.success(function(data, status, headers, config) {
				alert("Artículo actualizado con éxito");
				actualizararticulos();
			})
			.error(function(data, status, headers, config) {
				alert("Error código: "+status+". "+data);
			})
  	}
		
		//Funcion para mostrar modal de añadir artículo
		$scope.showModalAddArticulo = function() {
			//Inicializamos
			$scope.datos = {};
			var modalInstance = $modal.open({
				templateUrl: '/aplicacion/partials/add-articulo.html',
				resolve: { 
					Tipos: function() {
						return tipos;
					}
				},
				controller: 'AddArticulosCtrl'
			});
		}
	}]);

/* Para el modal de añadir artículo */

strettoControllers.controller('AddArticulosCtrl',  ['$scope', '$http', '$modalInstance','Tipos',
	function ($scope, $http, $modalInstance, Tipos) {
		var tipos = Tipos;
		//Obtenemos los tipos de instrumentos que hay
		//$http.get('http://localhost:3000/stretto/tipos').success(function(data) {
      $scope.tipos = tipos;
    //});
		
		//Funcion cancelar del modal añadir artículo
		$scope.cancelshowModalAddArticulo = function() {
			$modalInstance.dismiss(/*'cancel'*/);
		}
				
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
				$modalInstance.close();
				actualizararticulos();
			})
			.error(function(data, status, headers, config) {
				alert("Error código: "+status+". "+data);
			})
  	}
	}]);