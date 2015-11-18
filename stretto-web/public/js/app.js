var strettoApp = angular.module('strettoApp', ['ngRoute','strettoControllers']);

strettoApp.config(
	function($locationProvider, $routeProvider) {
		$routeProvider.
			when('/articulos', {
				templateUrl: '/aplicacion/partials/articulos-list.html',
				controller: 'ArticulosCtrl'
			}).
			when('/articulos/:id', {
				templateUrl: '/aplicacion/partials/articulo-detalle.html',
				controller: 'ArticuloCtrl'
			}).
			when('/usuarios/:id', {
				templateUrl: '/aplicacion/partials/usuario-detalle.html',
				controller: 'UsuarioCtrl'
			}).
			when('/usuarios/:id/articulos', {
				templateUrl: '/aplicacion/partials/articulos-list.html',
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