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
		}
	}
});

strettoService.service('loginService', function($http)
{
	return {
		getLogin: function(email, password) {
			return $http.get(URL_API + 'usuarios/login?email='+email+'&password='+password);
		}
	}
});