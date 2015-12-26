var strettoService = angular.module('strettoService', ['ngRoute']);
var URL_API = 'http://localhost:3000/stretto/';

/* Nota: strettoService.js -> Este es el Service que hace las llamadas a la API */

////////////////////////////
//LLAMADAS AL API PARA TIPOS
////////////////////////////

strettoService.service('tiposService', function($http)
{
	return {
		getTipos: function() {
			return $http.get(URL_API + 'tipos');
		}
	}
});

////////////////////////////////
//LLAMADAS AL API PARA ARTICULOS
////////////////////////////////

strettoService.service('articuloService', function($http)
{
	return {
		getArticulo: function(id) {
			return $http.get(URL_API + 'articulos/'+id);
		},
		addArticulo: function(datos) {
			return $http({
				method: "POST",
				url: URL_API + 'articulos',
				data: datos,
				headers: {'Authorization': 'Basic ' + btoa(localStorage.email+":"+localStorage.password)}
			})
		},
		deleteArticulo: function(id) {
			return $http({
				method: "DELETE",
				url: URL_API + 'articulos/'+id,
				headers: {'Authorization': 'Basic ' + btoa(localStorage.email+":"+localStorage.password)}
			});
		},
		updateArticulo: function(articulo) {
			return $http({
				method: "PUT",
				url: URL_API + 'articulos/'+articulo.id,
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

strettoService.service('articulosService', function($http)
{
	return {
		getArticulos: function(page) {
			return $http.get(URL_API + 'articulos?page='+page);			
		},
		getArticulosUsuario: function(id, page) {
			return $http.get(URL_API + 'usuarios/'+id+'/articulos'+'?page='+page);
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

strettoService.service('usuarioService', function($http)
{
	return {
		getUsuario: function(id) {
			return $http.get(URL_API + 'usuarios/'+id);
		},
		deleteUsuario: function(id) {
			return $http({
				method: "DELETE",
				url: URL_API + 'usuarios/'+id,
				headers: {'Authorization': 'Basic ' + btoa(localStorage.email+":"+localStorage.password)}
			});
  	},
		updateUsuario: function(usuario) {
			return $http({
				method: "PUT",
				url: URL_API + 'usuarios/'+usuario.id,
				data: usuario,
				headers: {'Authorization': 'Basic ' + btoa(localStorage.email+":"+localStorage.password)}
			})
		},
		mensaje: document.getElementById("mensaje"),
		divmensaje: document.getElementById("divmensaje"),
		modificadoBien: function() {
			console.log("que pasa");
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
			return $http.get(URL_API + 'usuarios/login?email='+email+'&password='+password);
		},		
		loginBien: function() {
			var mensaje = document.getElementById("mensajelogin");
			var divmensaje = document.getElementById("divmensajelogin");
			mensaje.className = "alert alert-success";
			divmensaje.className = "mensajevisible";
		},
		loginMal: function() {
			var mensaje = document.getElementById("mensajelogin");
			var divmensaje = document.getElementById("divmensajelogin");
			mensaje.className = "alert alert-danger";
			divmensaje.className = "mensajevisible";
		},
		modificadoDesaparece: function() { 
			var divmensaje = document.getElementById("divmensajelogin");
			divmensaje.className = "mensajedesaparece";
		}
	}
});