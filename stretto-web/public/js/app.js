var strettoApp = angular.module('strettoApp', ['ngRoute','strettoControllers']);

strettoApp.config(
	function($locationProvider, $routeProvider) {
		$routeProvider.
			when('/articulos', {
				templateUrl: '/aplicacion/partials/articulos-list.html',
				controller: 'ArticulosCtrl'
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