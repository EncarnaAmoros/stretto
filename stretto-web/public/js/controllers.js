var strettoControllers = angular.module('strettoControllers', ['ui.bootstrap','ngRoute', 'strettoService']);

//Funcion para mostrar modal con login
var mostrarLogin = function($modal) {
	var modalInstance = $modal.open({
		templateUrl: '/aplicacion/partials/login.html',
		controller: 'LoginCtrl'
	});
}

/* Para la barra de navegación */

strettoControllers.controller('NavCtrl', ['$scope', '$http', '$window', '$modal',
	function ($scope, $http, $window, $modal) {
		var actualizarNavBar = function () {
			if(localStorage.email!=undefined) {
				$scope.showme = false;
				$scope.usuario = localStorage.email;
				$scope.id = localStorage.id;
			}
			else {
				$scope.showme = true;
				$scope.mensaje = "Iniciar sesión";
			}
		}
		actualizarNavBar();
		
		//Si clica en iniciar sesión abrimos modal
		//Funcion para mostrar modal de añadir artículo
		$scope.showModalLogin = function() {
			mostrarLogin($modal);
		}
		
		//Si clica en cerrar sesión borramos sus datos
		$scope.logout = function() {
			localStorage.clear();
			actualizarNavBar();
		}

	}]);

/* Login para los usuarios */

strettoControllers.controller('LoginCtrl', ['$scope', '$http', '$window', '$modalInstance', 'login', '$timeout',
	function ($scope, $http, $window, $modalInstance, login, $timeout) {
		
		//Si clica en cancelar desaparece modal
		$scope.cancelshowModalLogin = function() {
			$modalInstance.dismiss();
		}
		
		//Cambiamos a vista registro
		$scope.vistaRegistro = function() {
			$scope.showInicioRegistro = true;
		}
		
		//Cambiamos a vista inicio sesión
		$scope.vistaInicioSesion = function() {
			$scope.showInicioRegistro = false;
		}
		
		//Inicializamos para logeo
		$scope.datos = {};				
		//Comprobamos login
		$scope.login = function() {
			$http.get('http://localhost:3000/stretto/usuarios/login?email='+$scope.datos.email+'&password='+$scope.datos.password)
				//No hay error al iniciar sesion, guardamos auth
				.success(function(data) {
					localStorage.email = $scope.datos.email;
					localStorage.password = $scope.datos.password;
					localStorage.id = data.id;
					$scope.mensaje = data.mensaje;
					login.loginBien();
				
					//A los 2 segundos ejecutamos lo siguiente
					$timeout(function() {
						$modalInstance.close();
						$window.location.href = 'articulos';
					}, 2000);
					
    		})
				//Hay error, lo mostramos
				.error(function(data) {
					$scope.mensaje="Error código: "+status+" "+data;
					login.loginMal();
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

strettoControllers.controller('ArticuloCtrl',  ['$scope', '$http', '$routeParams', 'articulodetalle',
	function ($scope, $http, $routeParams, articulodetalle) {
    $http.get('http://localhost:3000/stretto/articulos/'+$routeParams.id).success(function(data) {
      $scope.articulo = data.data;
			$scope.usuario = data.usuario;
    });
	
		$scope.comprarArticulo = function() {
			$scope.mensaje="Compra realizada con éxito. ¡Gracias por confiar en Stretto!";
			articulodetalle.compradoBien();
		}
	}]);

/* Mostramos un usuario en detalle */

strettoControllers.controller('UsuarioCtrl',  ['$scope', '$http', '$routeParams', '$window', 'usuariodetalle',
	function ($scope, $http, $routeParams, $window, usuariodetalle) {
		actualizarUsuario = function() {
			//O su perfil o usuario que no es su cuenta
			//Incluimos un html u otro
			if($routeParams.id==localStorage.id)
				$scope.showusuario=false;
			else
				$scope.showusuario=true;
			//Obtenemos los datos del usuario
			$http.get('http://localhost:3000/stretto/usuarios/'+$routeParams.id).success(function(data) {
				$scope.usuario = data.data;
				$scope.last_articulos = data.articulos;
    		//Acortamos todas las descripciones
				for(i=0;i<$scope.last_articulos.length;i++) {
					$scope.last_articulos[i].descripcion = $scope.last_articulos[i].descripcion.slice(0,161)+"...";
				}
			});
		}
		actualizarUsuario();
		
		//Funcion para mostrar usuario en forma de edit
		$scope.editableView = function() {
			$scope.showdetailedit=true;
			usuariodetalle.modificadoDesaparece();
		}
		
		$scope.cancelarEdit = function() {
			actualizarUsuario();
			$scope.detailView();
			usuariodetalle.modificadoDesaparece();
		}
		
		//Funcion para mostrar artículo en forma de detail
		$scope.detailView = function() {
			$scope.showdetailedit=false;
		}
		
		//Funcion para eliminar un usuario
		$scope.deleteUsuario = function(id) {
			$http({
				method: "DELETE",
				url: 'http://localhost:3000/stretto/usuarios/'+id,
				headers: {'Authorization': 'Basic ' + btoa(localStorage.email+":"+localStorage.password)}
			})
			.success(function(data, status, headers, config) {
				alert("Cuenta eliminada con éxito");
				actualizarUsuario();
				$window.location.href = "/";
			})
			.error(function(data, status, headers, config) {
				$scope.mensaje="Error código: "+status+" "+data;
				usuariodetalle.modificadoMal();
			})
  	}
		
		//Funcion para actualizar un artículo
		$scope.updateUsuario = function(usuario) {
			$http({
				method: "PUT",
				url: 'http://localhost:3000/stretto/usuarios/'+usuario.id,
				data: usuario,
				headers: {'Authorization': 'Basic ' + btoa(localStorage.email+":"+localStorage.password)}
			})
			.success(function(data, status, headers, config) {
				$scope.mensaje = "Usuario actualizado con éxito";
				actualizarUsuario();
				$scope.detailView();
				usuariodetalle.modificadoBien();
			})
			.error(function(data, status, headers, config) {
				$scope.mensaje="Error código: "+status+" "+data;
				usuariodetalle.modificadoMal();
			})
  	}
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
		
		//Funcion para pasar de página siguiente
		$scope.pasarPaginaSiguiente = function() {
			if($routeParams.page=="" || $routeParams.page==undefined) {
				$window.location.href = 'usuarios/'+$routeParams.id+'/articulos?page=2';
			} else {
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
		
		//Funcion para mostrar articulo en forma de edit
		$scope.editableView = function(articulo) {
			if(localStorage.email==undefined && localStorage.password==undefined)
				mostrarLogin($modal);
			else
				articulo.showdetailedit=true;
		}
		
		$scope.cancelarEdit = function(articulo) {
			actualizararticulos();
			$scope.detailView(articulo);
		}
		
		//Funcion para mostrar artículo en forma de detail
		$scope.detailView = function(articulo) {
			articulo.showdetailedit=false;
		}
		
		//Funcion para eliminar un artículo
		$scope.deleteArticulo = function(id) {
			if(localStorage.email==undefined && localStorage.password==undefined)
				mostrarLogin($modal);
			else {
				$http({
					method: "DELETE",
					url: 'http://localhost:3000/stretto/articulos/'+id,
					headers: {'Authorization': 'Basic ' + btoa(localStorage.email+":"+localStorage.password)}
				})
				.success(function(data, status, headers, config) {
					alert("Artículo eliminado con éxito");
					actualizararticulos();
					$scope.detailView(articulo);
				})
				.error(function(data, status, headers, config) {
					alert("Error código: "+status+" "+data);
				})	
			}
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
				$scope.detailView(articulo);
			})
			.error(function(data, status, headers, config) {
				alert("Error código: "+status+" "+data);
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
		$scope.tipos = tipos;
		
		//Funcion cancelar del modal añadir artículo
		$scope.cancelshowModalAddArticulo = function() {
			$modalInstance.dismiss();
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
				alert("Error código: "+status+" "+data);
			})
  	}
	}]);