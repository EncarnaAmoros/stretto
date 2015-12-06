var strettoControllers = angular.module('strettoControllers', ['ui.bootstrap','ngRoute', 'strettoService']);

/* Nota: controllers.js -> las llamadas a la API se hacen por medio de un Service */

/////////////////////////////
//OTROS ELEMENTOS DE LA VISTA
/////////////////////////////

/* Para la barra de navegación */

strettoControllers.controller('NavCtrl', ['$scope', '$modal',
	function ($scope, $modal) {
		//Miramos si el usuario está logeado o no
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
		
		//Si clica en iniciar sesión abrimos modal para logearse
		$scope.showModalLogin = function() {
			mostrarLogin($modal);
		}
		
		//Si clica en cerrar sesión borramos sus datos
		$scope.logout = function() {
			localStorage.clear();
			actualizarNavBar();
		}

	}]);

////////////////////////////////////////
//CONTROLADORES Y FUNCIONES DE ARTICULOS
////////////////////////////////////////
 
/* Mostramos los artículos de forma general */

strettoControllers.controller('ArticulosCtrl',  ['$scope', '$http',  '$routeParams', '$window', 'articulosService', 'tiposService',
	function ($scope, $http, $routeParams, $window, articulosService, tiposService) {
		//Obtenemos los artículos llamando al service y lo mostramos en vista
    articulosService.getArticulos($routeParams.page)
			.success(function(resultados) {
				$scope.articulos = resultados.data;
			})
			.error(function(resultados) {
				//Sin datos					
			})
		
		tiposService.getTipos()
			.success(function(resultados) {
      	$scope.tipos = resultados;
    	})
			.error(function(resultados) {
				//Sin datos	
			})
		
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

strettoControllers.controller('ArticuloCtrl',  ['$scope', '$http', '$routeParams', 'articuloService',
	function ($scope, $http, $routeParams, articuloService) {
		//Obtenemos los artículos de Service y mostramos en vista
    articuloService.getArticulo($routeParams.id)
			.success(function(resultado) {
				$scope.articulo = resultado.data;
				$scope.usuario = resultado.usuario;
			})
			.error(function(resultados) {
				//Sin datos	
			})
		
		//Mensaje con compra exitosa
		$scope.comprarArticulo = function() {
			$scope.mensaje="Compra realizada con éxito. ¡Gracias por confiar en Stretto!";
			articuloService.compradoBien();
		}
	}]);

/* Mostramos los artículos de un usuario pudiendo editarlos, eliminarlos y agregar uno nuevo */

strettoControllers.controller('UsuarioArticulosCtrl', ['$scope','$http','$routeParams','$window','$modal','articulosService',
																											 'tiposService', 'articuloService', '$timeout',
	function ($scope, $http, $routeParams, $window, $modal, articulosService, tiposService, articuloService, $timeout) {
		//Si son los artículos de otro usuario no se pueden editar o eliminar
		if($routeParams.id==localStorage.id)
			$scope.sonmisarticulos=true;
		else 
			$scope.sonmisarticulos=false;
		
		//Obtenemos los artículos del usuario
		var actualizararticulos = function() {
			articulosService.getArticulosUsuario($routeParams.id, $routeParams.page)
				.success(function(resultados) {
					$scope.articulos = resultados.data;
				})
				.error(function(resultados) {
					//Sin datos	
				})			
			//Obtenemos los tipos de instrumentos que hay
			var tipos;
			tiposService.getTipos()
				.success(function(resultados) {
					$scope.tipos = resultados;
					tipos = resultados;
				})
				.error(function(resultados) {
					//Sin datos	
				})
		}
	 	actualizararticulos();
		
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
		
		//Funcion para mostrar articulo en vista editable (si no está logeado modal con login)
		$scope.editableView = function(articulo) {
			if(localStorage.email==undefined && localStorage.password==undefined)
				mostrarLogin($modal);
			else
				articulo.showdetailedit=true;
		}
		
		//Si cancela volvemos a la vista de detalle
		$scope.cancelarEdit = function(articulo) {
			actualizararticulos();
			$scope.detailView(articulo);
			articulosService.modificadoDesaparece();
		}
		
		//Funcion para mostrar artículo en forma detalle
		$scope.detailView = function(articulo) {
			articulo.showdetailedit=false;
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
			//Cuando se cierra el model ejecutamos callback
			modalInstance.result.then(function (result) {
				actualizararticulos();
			});
		}
		
		//Funcion para actualizar un artículo
		$scope.updateArticulo = function(articulo) {
			articuloService.updateArticulo(articulo)
				.success(function(data, status, headers, config) {
					actualizararticulos();
					$scope.detailView(articulo);
					$scope.mensaje="Artículo actualizado con éxito";
					articulosService.modificadoBien();

					//A los 2 segundos ejecutamos lo que contiene la funcion
					$timeout(function() {
						articulosService.modificadoDesaparece();
					}, 2000);
				})
				.error(function(data, status, headers, config) {
					$scope.mensaje = "Error código: "+status+" "+data;
					articulosService.modificadoMal();
				})
  	}
		
		//Funcion para eliminar un artículo llamando al service
		$scope.deleteArticulo = function(id) {
			if(localStorage.email==undefined && localStorage.password==undefined)
				mostrarLogin($modal);
			else {
				articuloService.deleteArticulo(id)
					.success(function(data, status, headers, config) {
						actualizararticulos();
						$scope.mensaje = "Artículo eliminado con éxito";
						articulosService.modificadoBien();

						//A los 2 segundos ejecutamos lo que contiene la funcion
						$timeout(function() {
							articulosService.modificadoDesaparece();
						}, 2000);
					})
					.error(function(data, status, headers, config) {
						$scope.mensaje = "Error código: "+status+" "+data;
						articulosService.modificadoMal();

						//A los 2 segundos ejecutamos lo que contiene la funcion
						$timeout(function() {
							articulosService.modificadoDesaparece();
						}, 2000);
					})
			}
  	}
	}]);

/* Para el modal de añadir artículo */

strettoControllers.controller('AddArticulosCtrl',  ['$scope', '$http', '$modalInstance', 'Tipos', 'articulosService', '$timeout',
																										 'articuloService',
	function ($scope, $http, $modalInstance, Tipos, articulosService, $timeout, articuloService) {
		$scope.tipos = Tipos;
		
		//Funcion cancelar del modal añadir artículo
		$scope.cancelshowModalAddArticulo = function() {
			$modalInstance.dismiss();
		}
				
		//Funcion para añadir un nuevo artículo llamando al service
		$scope.addArticulo = function($window) {
			articuloService.addArticulo($scope.datos)
			.success(function(data, status, headers, config) {
				$scope.mensaje = data;
				articulosService.addBien();
				
				//A los 2 segundos ejecutamos lo que contiene la funcion
				$timeout(function() {
					var articulo = $scope.datos;
					$modalInstance.close(articulo);
				}, 2000);
			})
			.error(function(data, status, headers, config) {
				$scope.mensaje = "Error código: "+status+" "+data;
				articulosService.addMal();
			})
  	}
	}]);

///////////////////////////////////////
//CONTROLADORES Y FUNCIONES DE USUARIOS
///////////////////////////////////////

/* Mostramos un usuario en detalle */

strettoControllers.controller('UsuarioCtrl',  ['$scope', '$http', '$routeParams', '$window', 'usuarioService', '$timeout',
	function ($scope, $http, $routeParams, $window, usuarioService, $timeout) {
		var actualizarUsuario = function() {	
			//Según si es su perfil o no, incluimos un html u otro
			if($routeParams.id==localStorage.id) 
				$scope.showusuario=false;
			else
				$scope.showusuario=true;
			
			usuarioService.getUsuario($routeParams.id)
				.success(function(resultados) {
					$scope.usuario = resultados.data;
					$scope.last_articulos = resultados.articulos;	
					//Acortamos las descripciones
					console.log("mira"+$scope.last_articulos)
					if($scope.last_articulos!=undefined)
						for(i=0;i<$scope.last_articulos.length;i++) {
							$scope.last_articulos[i].descripcion = $scope.last_articulos[i].descripcion.slice(0,161)+"...";
						}
				})
				.error(function(resultados) {
					//Sin datos	
				})
		}		
		actualizarUsuario();
		
		//Funcion para mostrar usuario en forma editable
		$scope.editableView = function() {
			$scope.showdetailedit=true;
		}
		
		//Función para cancelar la edición y pasar a modo detalle
		$scope.cancelarEdit = function() {
			actualizarUsuario();
			$scope.detailView();
			usuarioService.modificadoDesaparece();
		}
		
		//Funcion para mostrar artículo en forma de detalle
		$scope.detailView = function() {
			$scope.showdetailedit=false;
		}
		
		//Funcion para actualizar un usuario llamando al Service
		$scope.updateUsuario = function(usuario) {
			usuarioService.updateUsuario(usuario)
			.success(function(data, status, headers, config) {
				$scope.mensaje = "Usuario actualizado con éxito";
				actualizarUsuario();
				$scope.detailView();
				usuarioService.modificadoBien();
				
				//A los 2 segundos ejecutamos lo que contiene la funcion
				$timeout(function() {
					usuarioService.modificadoDesaparece();
				}, 2000);				
			})
			.error(function(data, status, headers, config) {
				$scope.mensaje="Error código: "+status+" "+data;
				usuarioService.modificadoMal();
			})
  	}
		
		//Funcion para eliminar un usuario llamando al service
		$scope.deleteUsuario = function(id) {
			usuarioService.deleteUsuario(id)
			.success(function(data, status, headers, config) {
				alert("Cuenta eliminada con éxito");
				actualizarUsuario();
				$window.location.href = "/";
			})
			.error(function(data, status, headers, config) {
				$scope.mensaje="Error código: "+status+" "+data;
				usuarioService.modificadoMal();
			})
  	}
  }]);

/* Login y registro para los usuarios */

strettoControllers.controller('LoginCtrl', ['$scope', '$http', '$window', '$modalInstance', 'loginService', '$timeout', '$location',
	function ($scope, $http, $window, $modalInstance, loginService, $timeout, $location) {
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
			//No hay error al iniciar sesion, guardamos auth
			loginService.getLogin($scope.datos.email, $scope.datos.password)
				.success(function(data) {
					localStorage.email = $scope.datos.email;
					localStorage.password = $scope.datos.password;
					localStorage.id = data.id;
					$scope.mensaje = data.mensaje;
					loginService.loginBien();
				
					//A los 2 segundos ejecutamos lo que contiene la funcion
					$timeout(function() {
						$modalInstance.close();
						//$window.location.href = 'articulos';
						$location.path("/articulos");
					}, 2000);
					
    		})
				//Hay error, lo mostramos
				.error(function(data) {
					$scope.mensaje="Error código: "+status+" "+data;
					loginService.loginMal();
				});
		}
		
		//Si clica en cancelar desaparece modal
		$scope.cancelshowModalRegistro = function() {
			$modalInstance.dismiss();
		}
		
		//Cuando el registro sea correcto
		$scope.registroCorrecto = function() {
			//A los 2 segundos ejecutamos lo que contiene la funcion
			$timeout(function() {
				$modalInstance.close();
				$window.location.href = 'articulos';
			}, 2000);
		}
		
		//Cuando el registro de error
		$scope.registroError = function() {
			//Hay error, lo mostramos
			$scope.mensaje="Error código: "+status+" "+data;
			loginService.loginMal();	
		}
	}]);

/* Funcion para mostrar modal con login */

var mostrarLogin = function($modal) {
	var modalInstance = $modal.open({
		templateUrl: '/aplicacion/partials/login.html',
		controller: 'LoginCtrl'
	});
	
	//Cuando se cierra el model ejecutamos callback
	modalInstance.result.then(function (result) {
		
	});
}