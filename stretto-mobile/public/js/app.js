var strettoApp = angular.module('strettoApp', ['ngRoute','strettoControllers', 'strettoService']);
var rutaorigen = '/';

strettoApp.directive('myRepeatDirective', function() {
	return function(scope, element, attrs) {
		if(scope.$last) {
			
			/* Lista artículos de un usuario */
			if($('#articulos-usuario').hasClass('ui-listview'))
				$('#articulos-usuario').listview('refresh');		
			else
				$('#articulos-usuario').trigger('create');
			
			/* Lista tipos al editar artículo */
			if($('#tipos-editando').hasClass('ui-listview'))
				$('#tipos-editando').listview('refresh');		
			else
				$('#tipos-editando').trigger('create');
			
			
		}
	};
});

/*strettoApp.config(
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
);*/