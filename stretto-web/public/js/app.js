var strettoApp = angular.module('strettoApp', ['ngRoute','strettoControllers', 'strettoService']);
var rutaorigen = '/';

strettoApp.config(
	function($locationProvider, $routeProvider) {
		$routeProvider.
			when('/registro', { 
				templateUrl: rutaorigen + 'partials/registro.html',
				controller: 'RegistroCtrl'// --> 1 caso de uso sin usar framework
			}).
			when('/articulos', {
				templateUrl: rutaorigen + 'partials/articulos-list.html',
				controller: 'ArticulosCtrl'
			}).
			when('/articulos/:id', {
				templateUrl: rutaorigen + 'partials/articulo-detalle.html',
				controller: 'ArticuloCtrl'
			}).
			when('/usuarios/:id', {
				templateUrl: rutaorigen + 'partials/usuario-detalle.html',
				controller: 'UsuarioCtrl'
			}).
			when('/usuarios/:id/articulos', {
				templateUrl: rutaorigen + 'partials/articulos-usuario-list.html',
				controller: 'UsuarioArticulosCtrl'
			}).
			otherwise({
	      redirectTo: '/articulos'
	    });
		
		$locationProvider.html5Mode({
			enabled: true,
			requireBase: false
		});
	}
);