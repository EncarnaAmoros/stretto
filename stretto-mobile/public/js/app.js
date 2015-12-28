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
		}
	};
});
