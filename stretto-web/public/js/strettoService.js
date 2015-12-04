var strettoService = angular.module('strettoService', []);

/* Nota: strettoService.js -> Este es el Service que hace las llamadas a la API */

////////////////////////////
//LLAMADAS AL API PARA TIPOS
////////////////////////////

strettoService.service('tiposService', function($http)
{
	return {
		getTipos: function() {
			return $http.get('http://localhost:3000/stretto/tipos');
		}
	}
});

////////////////////////////////
//LLAMADAS AL API PARA ARTICULOS
////////////////////////////////

strettoService.service('articuloService', function($http, $routeParams)
{
	return {
		getArticulo: function() {
			return $http.get('http://localhost:3000/stretto/articulos/'+$routeParams.id);
		},
		addArticulo: function(datos) {
			return $http({
				method: "POST",
				url: 'http://localhost:3000/stretto/articulos',
				data: datos,
				headers: {'Authorization': 'Basic ' + btoa(localStorage.email+":"+localStorage.password)}
			})
		},
		deleteArticulo: function(id) {
			return $http({
				method: "DELETE",
				url: 'http://localhost:3000/stretto/articulos/'+id,
				headers: {'Authorization': 'Basic ' + btoa(localStorage.email+":"+localStorage.password)}
			});
		},
		updateArticulo: function(articulo) {
			return $http({
				method: "PUT",
				url: 'http://localhost:3000/stretto/articulos/'+articulo.id,
				data: articulo,
				headers: {'Authorization': 'Basic ' + btoa(localStorage.email+":"+localStorage.password)}
			})
		},
		divmensaje: document.getElementById("divmensaje"),
		compradoBien: function() {	
			divmensaje.className = "mensajevisible";
		},
		compradoDesaparece: function() {
			divmensaje.className = "mensajedesaparece";
		}
	}
});

strettoService.service('articulosService', function($http, $routeParams)
{
	return {
		getArticulos: function() {
			return $http.get('http://localhost:3000/stretto/articulos?page='+$routeParams.page);
		},
		getArticulosUsuario: function() {
			return $http.get('http://localhost:3000/stretto/usuarios/'+$routeParams.id+'/articulos'+'?page='+$routeParams.page);
		},
		mensaje: document.getElementById("mensaje"),
		divmensaje: document.getElementById("divmensaje"),
		mensaje2: document.getElementById("mensaje"),
		divmensaje2: document.getElementById("divmensaje"),
		modificadoBien: function() {
			mensaje.className = "alert alert-success";
			divmensaje.className = "mensajevisible";
		},
		modificadoMal: function() {
			mensaje.className = "alert alert-danger";
			divmensaje.className = "mensajevisible";
		}, 
		modificadoDesaparece: function() {
			divmensaje.className = "mensajedesaparece";
		}, 
		addBien: function() {
			mensaje2.className = "alert alert-success";
			divmensaje2.className = "mensajevisible";
		},
		addMal: function() {
			mensaje2.className = "alert alert-danger";
			divmensaje2.className = "mensajevisible";
		}
	}
});

///////////////////////////////
//LLAMADAS AL API PARA USUARIOS
///////////////////////////////

strettoService.service('usuarioService', function($http, $routeParams)
{
	return {
		getUsuario: function() {
			return $http.get('http://localhost:3000/stretto/usuarios/'+$routeParams.id);
		},
		deleteUsuario: function(id) {
			return $http({
				method: "DELETE",
				url: 'http://localhost:3000/stretto/usuarios/'+id,
				headers: {'Authorization': 'Basic ' + btoa(localStorage.email+":"+localStorage.password)}
			});
  	},
		updateUsuario: function(usuario) {
			return $http({
				method: "PUT",
				url: 'http://localhost:3000/stretto/usuarios/'+usuario.id,
				data: usuario,
				headers: {'Authorization': 'Basic ' + btoa(localStorage.email+":"+localStorage.password)}
			})
		},
		mensaje: document.getElementById("mensaje"),
		divmensaje: document.getElementById("divmensaje"),
		modificadoBien: function() {			
			mensaje.className = "alert alert-success";			
			divmensaje.className = "mensajevisible";
		},
		modificadoMal: function() {
			mensaje.className = "alert alert-danger";
			divmensaje.className = "mensajevisible";
		},
		modificadoDesaparece: function() {
			divmensaje.className = "mensajedesaparece";
		}
	}
});

strettoService.service('loginService', function($http)
{
	return {
		getLogin: function(email, password) {
			return $http.get('http://localhost:3000/stretto/usuarios/login?email='+email+'&password='+password);
		},		
		loginBien: function() {
			var mensaje = document.getElementById("mensaje");
			var divmensaje = document.getElementById("divmensaje");
			mensaje.className = "alert alert-success";
			divmensaje.className = "mensajevisible";
		},
		loginMal: function() {
			var mensaje = document.getElementById("mensaje");
			var divmensaje = document.getElementById("divmensaje");
			mensaje.className = "alert alert-danger";
			divmensaje.className = "mensajevisible";
		}
	}
});