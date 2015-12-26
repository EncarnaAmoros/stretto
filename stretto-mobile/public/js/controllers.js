var strettoControllers = angular.module('strettoControllers', ['ui.bootstrap','ngRoute', 'strettoService']);
var rutaorigen = '/';

/* Nota: controllers.js -> las llamadas a la API se hacen por medio de un Service */

/////////////////////////////
//OTROS ELEMENTOS DE LA VISTA
/////////////////////////////

/* Para la barra de navegación */

strettoControllers.controller('NavCtrl', ['$scope', '$modal', '$window',
	function ($scope, $modal, $window) {		
		//Miramos si el usuario está logeado o no
		$scope.actualizar = function () {
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
		$scope.actualizar();
		
		//Si clica en iniciar sesión abrimos modal para logearse
		$scope.showModalLogin = function() {
			mostrarLogin($modal, $window);
		}
		
		//Si clica en cerrar sesión borramos sus datos
		$scope.logout = function() {
			localStorage.clear();
			$scope.actualizar();
		}

	}]);

////////////////////////////////////////
//CONTROLADORES Y FUNCIONES DE ARTICULOS
////////////////////////////////////////
 
/* Mostramos los artículos de forma general */

strettoControllers.controller('ArticulosCtrl',  ['$scope', '$http',  '$routeParams', 'articulosService', 'tiposService',
	function ($scope, $http, $routeParams, articulosService, tiposService) {
		
		//Obtenemos los artículos llamando al service y lo mostramos en vista
    $scope.actualizar = function () {
			articulosService.getArticulos(1)
			.success(function(resultados) {
				var listarticulos = resultados.data;
				articulosService.getArticulos(2)
				.success(function(resultados2) {
					var listarticulos2 = resultados2.data;
					$scope.articulos = listarticulos.concat(listarticulos2);
				})
				.error(function(resultados) {
					//Sin datos					
				})
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
		}
		$scope.actualizar();
		
		$scope.verArticulo = function(articulo) {
			console.log("miraa A_"+articulo.id);
			localStorage.articuloId = articulo.id;
			$.mobile.pageContainer.pagecontainer('change', '#articulodetalle');
		}
		
		//Funcion para pasar de página siguiente
		$scope.pasarPaginaSiguiente = function() {
			if($routeParams.page=="" || $routeParams.page==undefined) {
				$routeParams.page = 2;
				$scope.actualizar();				
			} else {				
				var pagina = 1 + parseInt($routeParams.page);
				$routeParams.page = pagina;
				$scope.actualizar();
			}
			window.scrollTo(0,0);
		}
		
		//Funcion para pasar de página anterior
		$scope.pasarPaginaAnterior = function() {
			if($routeParams.page=="" || $routeParams.page==undefined || $routeParams.page==1 || $routeParams.page=="1") {
				console.log("no hay anterior");
			} else {				
				var pagina = parseInt($routeParams.page) - 1;
				$routeParams.page = pagina;
				$scope.actualizar();
			}
			window.scrollTo(0,0);
		}
  }]);

/* Mostramos un artículo en detalle */

strettoControllers.controller('ArticuloCtrl',  ['$scope', '$http', '$routeParams', 'articuloService',
	function ($scope, $http, $routeParams, articuloService) {
		//Obtenemos los artículos de Service y mostramos en vista
		$scope.actualizar = function() {
			articuloService.getArticulo(localStorage.articuloId)
				.success(function(resultado) {
					$scope.articulo = resultado.data;
					$scope.usuario = resultado.usuario;
				})
				.error(function(resultados) {
					//Sin datos	
				})
		}
		$scope.actualizar();
		$('#articulodetalle').on('pagebeforeshow', function() {
			$scope.actualizar();
		});
		
		$scope.verArticulo = function(articulo) {
			localStorage.articuloId = articulo.id;
			$.mobile.pageContainer.pagecontainer('change', '#articuloeditable');
		}
		
		$scope.verUsuario = function(usuario) {
			localStorage.usuarioId = usuario.id;
			$.mobile.pageContainer.pagecontainer('change', '#usuariodetalle');
		}
		
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
		$scope.actualizar = function() {
			//Obtenemos los artículos del usuario
			var tipos;
			articulosService.getArticulosUsuario(localStorage.usuarioId, 1)
				.success(function(resultados) {
					var listarticulos = resultados.data;
					articulosService.getArticulosUsuario(localStorage.usuarioId, 2)
						.success(function(resultados2) {
							var listarticulos2 = resultados2.data;
							$scope.articulos = listarticulos.concat(listarticulos2);
						})
						.error(function(resultados) {
							//Sin datos					
						})
				})
				.error(function(resultados) {
					//Sin datos	
				})			
			//Obtenemos los tipos de instrumentos que hay
			tiposService.getTipos()
				.success(function(resultados) {
					$scope.tipos = resultados;
					tipos = resultados;
				})
				.error(function(resultados) {
					//Sin datos	
				})
		}
	 	$scope.actualizar();		
		$('#articulosusuario').on('pagebeforeshow', function() {
			$scope.actualizar();
		});
		
		$scope.verArticulo = function(articulo) {
			localStorage.articuloId = articulo.id;
			$.mobile.pageContainer.pagecontainer('change', '#articulodetalle');
		}
		
		$scope.editarArticulo = function(articulo) {
			localStorage.articuloId = articulo.id;
			$.mobile.pageContainer.pagecontainer('change', '#articuloeditable');
		}
		
		//Funcion para pasar de página siguiente
		$scope.pasarPaginaSiguiente = function() {
			if($routeParams.page=="" || $routeParams.page==undefined) {
				$routeParams.page = 2;
				$scope.actualizar();
			} else {
				var pagina = 1 + parseInt($routeParams.page);
				$routeParams.page = pagina;
				$scope.actualizar();
			}
			window.scrollTo(0,0);
		}
		
		//Funcion para pasar de página anterior
		$scope.pasarPaginaAnterior = function() {
			if($routeParams.page=="" || $routeParams.page==undefined || $routeParams.page==1) {
			} else {				
				var pagina = parseInt($routeParams.page) - 1;
				$routeParams.page = pagina;
				$scope.actualizar();	
			}
			window.scrollTo(0,0);
		}
		
		//Funcion para mostrar modal de añadir artículo
		$scope.showModalAddArticulo = function() {
			//Inicializamos
			$scope.datos = {};
			var modalInstance = $modal.open({
				templateUrl: rutaorigen + 'partials/add-articulo.html',
				resolve: { 
					Tipos: function() {
						return tipos;
					}
				},
				controller: 'AddArticulosCtrl'
			});
			//Cuando se cierra el model ejecutamos callback
			modalInstance.result.then(function (result) {
				$scope.actualizar();
			});
		}
		
		//Funcion para eliminar un artículo llamando al service
		$scope.deleteArticulo = function(id) {
			if(localStorage.email==undefined && localStorage.password==undefined)
				mostrarLogin($modal, $window);
			else {
				articuloService.deleteArticulo(id)
					.success(function(data, status, headers, config) {
						$scope.actualizar();
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

/* Mostramos los artículos de un usuario pudiendo editarlos, eliminarlos y agregar uno nuevo */
strettoControllers.controller('UsuarioArticuloEditarCtrl', ['$scope','$http','$routeParams','$window','$modal','articulosService',
																											 'tiposService', 'articuloService', '$timeout',
	function ($scope, $http, $routeParams, $window, $modal, articulosService, tiposService, articuloService, $timeout) {
		//Si son los artículos de otro usuario no se pueden editar o eliminar
		$scope.actualizar = function() {
			if(localStorage.usuarioId==localStorage.id)
				$scope.sonmisarticulos=true;
			else 
				$scope.sonmisarticulos=false;

			//Obtenemos los artículos del usuario
			var tipos;
			articulosService.getArticulosUsuario(localStorage.usuarioId, 1)
				.success(function(resultados) {
					$scope.articulos = resultados.data;
				})
				.error(function(resultados) {
					//Sin datos	
				})			
			//Obtenemos los tipos de instrumentos que hay
			tiposService.getTipos()
				.success(function(resultados) {
					$scope.tipos = resultados;
					tipos = resultados;
				})
				.error(function(resultados) {
					//Sin datos	
				})
		}
	 	$scope.actualizar();
		
		$scope.verArticulo = function(articulo) {
			localStorage.articuloId = articulo.id;
			$.mobile.pageContainer.pagecontainer('change', '#articulodetalle');
		}
		
		$scope.editarArticulo = function(articulo) {
			localStorage.articuloId = articulo.id;
			$.mobile.pageContainer.pagecontainer('change', '#articulodetalle');
		}
		
		//Funcion para pasar de página siguiente
		$scope.pasarPaginaSiguiente = function() {
			if($routeParams.page=="" || $routeParams.page==undefined) {
				$routeParams.page = 2;
				$scope.actualizar();
			} else {
				var pagina = 1 + parseInt($routeParams.page);
				$routeParams.page = pagina;
				$scope.actualizar();
			}
			window.scrollTo(0,0);
		}
		
		//Funcion para pasar de página anterior
		$scope.pasarPaginaAnterior = function() {
			if($routeParams.page=="" || $routeParams.page==undefined || $routeParams.page==1) {
			} else {				
				var pagina = parseInt($routeParams.page) - 1;
				$routeParams.page = pagina;
				$scope.actualizar();	
			}
			window.scrollTo(0,0);
		}
				
		//Funcion para actualizar un artículo
		$scope.updateArticulo = function(articulo) {
			articuloService.updateArticulo(articulo)
				.success(function(data, status, headers, config) {
					$scope.actualizar();
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
				mostrarLogin($modal, $window);
			else {
				articuloService.deleteArticulo(id)
					.success(function(data, status, headers, config) {
						$scope.actualizar();
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
		$scope.actualizar = function() {
			usuarioService.getUsuario(localStorage.usuarioId)
				.success(function(resultados) {
					$scope.usuario = resultados.data;
					$scope.last_articulos = resultados.articulos;	
					//Acortamos las descripciones
					if($scope.last_articulos!=undefined)
						for(i=0;i<$scope.last_articulos.length;i++) {
							$scope.last_articulos[i].descripcion = $scope.last_articulos[i].descripcion.slice(0,161)+"...";
						}
				})
				.error(function(resultados) {
					//Sin datos	
				})
		}		
		$scope.actualizar();
		
		$scope.verArticulo = function(articulo) {
			localStorage.articuloId = articulo.id;
			$.mobile.pageContainer.pagecontainer('change', '#articulodetalle');
		}
		
		$scope.articulosUsuario = function(usuario) {
			localStorage.usuarioId = usuario.id;
			$.mobile.pageContainer.pagecontainer('change', '#articulosusuario');
		}
		
		$scope.editarUsuario = function(usuario) {
			localStorage.usuarioId = usuario.id;
			$.mobile.pageContainer.pagecontainer('change', '#usuarioeditable');
		}
		
		//Funcion para eliminar un usuario llamando al service
		$scope.deleteUsuario = function(id) {
			usuarioService.deleteUsuario(id)
			.success(function(data, status, headers, config) {
				alert("Cuenta eliminada con éxito");
				localStorage.clear();
				$window.location.href = "/";
				$.mobile.pageContainer.pagecontainer('change', '#principal');
			})
			.error(function(data, status, headers, config) {
				$scope.mensaje="Error código: "+status+" "+data;
				usuarioService.modificadoMal();
			})
  	}
  }]);

/* Mostramos un usuario en detalle */

strettoControllers.controller('UsuarioEditarCtrl',  ['$scope', '$http', '$routeParams', '$window', 'usuarioService', '$timeout',
	function ($scope, $http, $routeParams, $window, usuarioService, $timeout) {
		$scope.actualizar = function() {			
			usuarioService.getUsuario(localStorage.usuarioId)
				.success(function(resultados) {
					$scope.usuario = resultados.data;
					$scope.last_articulos = resultados.articulos;	
					//Acortamos las descripciones
					if($scope.last_articulos!=undefined)
						for(i=0;i<$scope.last_articulos.length;i++) {
							$scope.last_articulos[i].descripcion = $scope.last_articulos[i].descripcion.slice(0,161)+"...";
						}
				})
				.error(function(resultados) {
					//Sin datos	
				})
		}		
		$scope.actualizar();
		
		$scope.verArticulo = function(articulo) {
			localStorage.articuloId = articulo.id;
			$.mobile.pageContainer.pagecontainer('change', '#articulodetalle');
		}
		
		$scope.verUsuario = function(usuario) {
			localStorage.usuarioId = usuario.id;
			$.mobile.pageContainer.pagecontainer('change', '#usuariodetalle');
		}
		
		//Funcion para actualizar un usuario llamando al Service
		$scope.updateUsuario = function(usuario) {
			usuarioService.updateUsuario(usuario)
			.success(function(data, status, headers, config) {
				$scope.mensaje = "Usuario actualizado con éxito";
				usuarioService.modificadoBien();
				
				//A los 2 segundos ejecutamos lo que contiene la funcion
				$timeout(function() {
					usuarioService.modificadoDesaparece();
					$.mobile.pageContainer.pagecontainer('change', '#usuariodetalle');
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
				localStorage.clear();
				$window.location.href = "/";
				$.mobile.pageContainer.pagecontainer('change', '#principal');
			})
			.error(function(data, status, headers, config) {
				$scope.mensaje="Error código: "+status+" "+data;
				usuarioService.modificadoMal();
			})
  	}
  }]);

/* Login y registro para los usuarios */

strettoControllers.controller('LoginCtrl', ['$scope', '$http', 'loginService', '$timeout', '$window',
	function ($scope, $http, loginService, $timeout, $window) {
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
						loginService.modificadoDesaparece();
						$.mobile.pageContainer.pagecontainer('change', '#principal');
					}, 2000);
					
    		})
				//Hay error, lo mostramos
				.error(function(data) {
					$scope.mensaje="Error código: "+status+" "+data;
					loginService.loginMal();
				
					$timeout(function() {
						loginService.modificadoDesaparece();
					}, 2000);
				});
		}
		
		/*/Si clica en cancelar desaparece modal
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
		
		//Login funcion 
		
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
		}*/
	}]);

/* Funcion para mostrar modal con login */

var mostrarLogin = function($modal, $window) {
	var modalInstance = $modal.open({
		templateUrl: rutaorigen + 'partials/login.html',
		controller: 'LoginCtrl'
	});
	
	//Siempre que se cierre el model ejecutamos este callback
	modalInstance.result.finally(function () {
		$window.location.href = '/';	
	});
}