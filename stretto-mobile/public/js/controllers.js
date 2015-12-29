var strettoControllers = angular.module('strettoControllers', ['ui.bootstrap','ngRoute', 'strettoService']);
var rutaorigen = '/';

/* Nota: controllers.js -> las llamadas a la API se hacen por medio de un Service */

//FUNCIONES UTILES
var mostrarMensaje = function(mensaje, codigo) {
	new $.nd2Toast({ // The 'new' keyword is important, otherwise you would overwrite the current toast instance
	 message : codigo+": "+mensaje, // Required
	 action : { // Optional (Defines the action button on the right)
		 fn : function() { // function that will be triggered when action clicked
		 }
	 },
	 ttl : 3000 // optional, time-to-live in ms (default: 3000)
	});
}

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
				})
			})
			.error(function(resultados) {		
			})		
		tiposService.getTipos()
			.success(function(resultados) {
      	$scope.tipos = resultados;
    	})
			.error(function(resultados) {
			})
		}
		
		$scope.actualizar();
		
		$scope.verArticulo = function(articulo) {
			$.mobile.pageContainer.pagecontainer('change', '#articulodetalle', {articulo: articulo});
		}
		
  }]);

/* Mostramos los artículos de un usuario pudiendo editarlos, eliminarlos y agregar uno nuevo */

strettoControllers.controller('UsuarioArticulosCtrl', ['$scope','$http', 'articulosService', 'tiposService', 'articuloService', '$timeout', 'usuarioService',
	function ($scope, $http, articulosService, tiposService, articuloService, $timeout, usuarioService) {
		
		//Obtenemos el usuario por parámetro
		var usuarioId;
		$( document ).on( "pagebeforechange" , function ( event, data ) {
			if(data.toPage[0].id == "articulosusuario") {
				usuarioId = data.options.usuarioId;
				if(usuarioId!=undefined) {
					$scope.actualizar(usuarioId);
				}
			}
		});
		
		//Obtenemos los artículos del usuario y tipos
		$scope.actualizar = function(usuarioId) {		
			articulosService.getArticulosUsuario(usuarioId, 1)
				.success(function(resultados) {
					$scope.articulos = resultados.data;
				})
				.error(function(resultados) {
				})
			tiposService.getTipos()
				.success(function(resultados) {
					$scope.tipos = resultados;					
				})
				.error(function(resultados) {
				})
			usuarioService.getUsuario(usuarioId)
				.success(function(resultados) {
					$scope.usuario = resultados.data;
				})
		}
		
		//Si son los artículos del usuario logeado mostramos opciones ver, editar y eliminar, si no, solo lo podrá ver
		$scope.opcionesitem = function(articulo) {
			if(articulo.UsuarioId==localStorage.id) {
				var clasescss = "ui-bottom-sheet ui-bottom-sheet-list ui-panel ui-panel-position-bottom ui-panel-display-overlay ";
				clasescss += " ui-body-inherit ui-panel-open";
				document.getElementById("bottomsheetlist"+articulo.id).className = clasescss;
			} else {
				$.mobile.pageContainer.pagecontainer('change', '#articulodetalle', {articulo: articulo});
			}
		}
		
		$scope.cancelarPanel = function(id) {
			var clasescss = "ui-bottom-sheet ui-bottom-sheet-list ui-panel ui-panel-position-bottom ui-panel-display-overlay ";
			clasescss += " ui-body-inherit ui-panel-close";
			document.getElementById("bottomsheetlist"+id).className = clasescss;
		}
		
		$scope.verArticulo = function(articulo) {
			$.mobile.pageContainer.pagecontainer('change', '#articulodetalle', {articulo: articulo});
		}
		
		$scope.editarArticulo = function(articulo) {
			if((localStorage.email==undefined && localStorage.password==undefined) || localStorage.id!=articulo.UsuarioId)
				mostrarMensaje("No tienes permiso para reaizar esta acción", "401");
			else
				$.mobile.pageContainer.pagecontainer('change', '#articuloeditable', {articulo: articulo});
		}
		
		//Funcion para eliminar un artículo llamando al service
		$scope.deleteArticulo = function(articulo) {
			if((localStorage.email==undefined && localStorage.password==undefined) || localStorage.id!=articulo.UsuarioId) {
				mostrarMensaje("No tienes permiso para reaizar esta acción", "401");
			}				
			else {
				articuloService.deleteArticulo(articulo.id)
					.success(function(data, status, headers, config) {
						$scope.actualizar();
						mostrarMensaje("Artículo eliminado con éxito", status);

						//A los 2 segundos ejecutamos lo que contiene la funcion
						$timeout(function() {
							$.mobile.pageContainer.pagecontainer('change', '#articulosusuario', {usuarioId: articulo.UsuarioId});
						}, 2000);
					})
					.error(function(data, status, headers, config) {
						mostrarMensaje(data, status);
					})			
			}
  	}
		
	}]);

/* Mostramos un artículo en detalle */

strettoControllers.controller('ArticuloCtrl',  ['$scope', '$http', '$routeParams', 'articuloService',
	function ($scope, $http, $routeParams, articuloService) {
		
		//Obtenemos el artículo por parámetro
		var articulo;
		$( document ).on( "pagebeforechange" , function ( event, data ) {
			if(data.toPage[0].id == "articulodetalle") {
				articulo = data.options.articulo;
				if(articulo!=undefined) {
					$scope.actualizar(articulo);
				}
			}
		});
		
		//Obtenemos el artículo a través del Service
		$scope.actualizar = function(articulo) {
			articuloService.getArticulo(articulo.id)
				.success(function(resultado) {
					$scope.articulo = resultado.data;
					$scope.usuario = resultado.usuario;
				})
				.error(function(resultados) {
				})
		}
		
		$scope.verUsuario = function(usuario) {
			$.mobile.pageContainer.pagecontainer('change', '#usuariodetalle', {usuarioId: usuario.id});
		}
		
	}]);

/* Mostramos los artículos de un usuario pudiendo editarlos, eliminarlos y agregar uno nuevo */

strettoControllers.controller('UsuarioArticuloEditarCtrl', ['$scope','$http', 'articulosService', 'tiposService', 'articuloService', '$timeout',
	function ($scope, $http, articulosService, tiposService, articuloService, $timeout) {
		
		//Obtenemos el artículo por parámetro
		var articulo;
		$( document ).on( "pagebeforechange" , function ( event, data ) {
			if(data.toPage[0].id == "articuloeditable") {
				articulo = data.options.articulo;
				if(articulo!=undefined) {
					$scope.actualizar(articulo);
				}
			}
		});
		
		//Obtenemos el artículo a editar y los tipos que hay
		$scope.actualizar = function(articulo) {
			articuloService.getArticulo(articulo.id)
				.success(function(resultado) {
					$scope.articulo = resultado.data;
					$scope.usuario = resultado.usuario;
				})
				.error(function(resultados) {
				})
			tiposService.getTipos()
				.success(function(resultados) {
					$scope.tipos = resultados;
				})
				.error(function(resultados) {
				})
		}
		
		$scope.verArticulo = function(articulo) {
			$.mobile.pageContainer.pagecontainer('change', '#articulodetalle', {articulo: articulo});
		}
				
		//Funcion para actualizar un artículo
		$scope.updateArticulo = function(articulo) {
			if((localStorage.email==undefined && localStorage.password==undefined) || localStorage.id!=articulo.UsuarioId) {
				mostrarMensaje("No tienes permiso para reaizar esta acción", "401");
			}				
			else {
				articuloService.updateArticulo(articulo)
					.success(function(data, status, headers, config) {
						mostrarMensaje("Artículo actualizado con éxito", status);

						//A los 2 segundos ejecutamos lo que contiene la funcion
						$timeout(function() {
							$.mobile.pageContainer.pagecontainer('change', '#articulosusuario', {usuarioId: articulo.UsuarioId});
						}, 2000);
					})
					.error(function(data, status, headers, config) {
						mostrarMensaje(data, status);
					})
			}
  	}
		
		//Funcion para eliminar un artículo llamando al service
		$scope.deleteArticulo = function(articulo) {
			if((localStorage.email==undefined && localStorage.password==undefined) || localStorage.id!=articulo.UsuarioId) {
				mostrarMensaje("No tienes permiso para reaizar esta acción", "401");
			}				
			else {
				articuloService.deleteArticulo(articulo.id)
					.success(function(data, status, headers, config) {
						$scope.actualizar();
						mostrarMensaje("Artículo eliminado con éxito", status);

						//A los 2 segundos ejecutamos lo que contiene la funcion
						$timeout(function() {
							$.mobile.pageContainer.pagecontainer('change', '#articulosusuario', {usuarioId: articulo.UsuarioId});
						}, 2000);
					})
					.error(function(data, status, headers, config) {
						mostrarMensaje(data, status);
					})
			}
  	}
	}]);

/* Para el modal de añadir artículo */

strettoControllers.controller('AddArticulosCtrl',  ['$scope', '$http', 'articulosService', 'articuloService', '$timeout', 'tiposService',
	function ($scope, $http, articulosService, articuloService, $timeout, tiposService) {
		
		//Obtenemos los tipos de instrumentos que hay
		tiposService.getTipos()
			.success(function(resultados) {
				$scope.tipos = resultados;
			})
			.error(function(resultados) {
			})
		
		//Funcion para añadir un nuevo artículo llamando al service
		$scope.addArticulo = function() {
			if(localStorage.email==undefined && localStorage.password==undefined) {
				mostrarMensaje("Debes iniciar sesión", "401");
			}				
			else {
				articuloService.addArticulo($scope.articulo)
				.success(function(data, status, headers, config) {
					mostrarMensaje(data, status);

					//A los 2 segundos ejecutamos lo que contiene la funcion
					$timeout(function() {
						$.mobile.pageContainer.pagecontainer('change', '#articulosusuario', {usuarioId: localStorage.id});
					}, 2000);
				})
				.error(function(data, status, headers, config) {
					mostrarMensaje(data, status);
				})
			}
  	}
	}]);

///////////////////////////////////////
//CONTROLADORES Y FUNCIONES DE USUARIOS
///////////////////////////////////////

/* Mostramos un usuario en detalle */

strettoControllers.controller('UsuarioCtrl',  ['$scope', '$http', 'usuarioService', '$timeout',
	function ($scope, $http, usuarioService, $timeout) {
		
		//Obtenemos el usuario por parámetro
		var usuarioId;
		$( document ).on( "pagebeforechange" , function ( event, data ) {
			if(data.toPage[0].id == "usuariodetalle" || data.toPage[0].id == "usuarioeditable") {
				usuarioId = data.options.usuarioId;
				if(usuarioId!=undefined)
					$scope.actualizar(usuarioId);
			}
		});
		
		//Obtenemos los datos del usuario
		$scope.actualizar = function(usuarioId) {
			usuarioService.getUsuario(usuarioId)
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
				})			
		}
		
		$scope.verArticulo = function(articulo) {
			$.mobile.pageContainer.pagecontainer('change', '#articulodetalle', {articulo: articulo});
		}
		
		$scope.articulosUsuario = function(usuario) {
			$.mobile.pageContainer.pagecontainer('change', '#articulosusuario', {usuarioId: usuario.id});
		}
		
		$scope.editarUsuario = function(usuario) {
			if((localStorage.email==undefined && localStorage.password==undefined) || localStorage.id!=usuario.id) {
				mostrarMensaje("No tienes permiso para reaizar esta acción", "401");
			}				
			else {
				localStorage.usuarioId = usuario.id;
				$.mobile.pageContainer.pagecontainer('change', '#usuarioeditable', {usuarioId: usuario.id});
			}
		}
		
		//Funcion para actualizar un usuario llamando al Service
		$scope.updateUsuario = function(usuario) {
			if((localStorage.email==undefined && localStorage.password==undefined) || localStorage.id!=usuario.id) {
				mostrarMensaje("No tienes permiso para reaizar esta acción", "401");
			}				
			else {
				usuarioService.updateUsuario(usuario)
				.success(function(data, status, headers, config) {
					mostrarMensaje("Usuario actualizado con éxito", status);
					
					//A los 2 segundos ejecutamos lo que contiene la funcion
					$timeout(function() {
						$.mobile.pageContainer.pagecontainer('change', '#usuariodetalle', {usuarioId: usuario.id});
					}, 2000);				
				})
				.error(function(data, status, headers, config) {
					mostrarMensaje(data, status);

				})
			}
  	}
		
		//Funcion para eliminar un usuario llamando al service
		$scope.deleteUsuario = function(id) {
			if((localStorage.email==undefined && localStorage.password==undefined) || localStorage.id!=id) {
				mostrarMensaje("No tienes permiso para reaizar esta acción", "401");
			}				
			else {
				usuarioService.deleteUsuario(id)
				.success(function(data, status, headers, config) {
					mostrarMensaje("Cuenta eliminada con éxito", status);
					localStorage.clear();
					$.mobile.pageContainer.pagecontainer('change', '#principal');
				})
				.error(function(data, status, headers, config) {
					mostrarMensaje(data, status);
				})
			}
  	}
  }]);

/* Login y registro para los usuarios */

strettoControllers.controller('LoginCtrl', ['$scope', '$http', 'loginService', '$timeout',
	function ($scope, $http, loginService, $timeout) {
		//Inicializamos para logeo
		$scope.datos = {};
		
		//Comprobamos login
		$scope.login = function() {
			//No hay error al iniciar sesion, guardamos auth
			loginService.getLogin($scope.datos.email, $scope.datos.password)
				.success(function(data, status) {
					localStorage.email = $scope.datos.email;
					localStorage.password = $scope.datos.password;
					localStorage.id = data.id;
					mostrarMensaje("Inicio de sesión correcto", status);
				
					//A los 2 segundos ejecutamos lo que contiene la funcion
					$timeout(function() {
						$.mobile.pageContainer.pagecontainer('change', '#articulosusuario', {usuarioId: localStorage.id});
					}, 2000);
					
    		})
				//Hay error, lo mostramos
				.error(function(data, status) {
					mostrarMensaje(data, status);
				});
		}
	}]);