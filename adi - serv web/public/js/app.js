var phonecatApp = angular.module('phonecatApp', [
  'ngRoute',
  'phonecatControllers'
])

phonecatApp.config(
	function($locationProvider, $routeProvider) {
	    $routeProvider.
	      when('/phones', {
	        templateUrl: '/aplicacion/partials/phone-list.html',
	        controller: 'PhoneListCtrl'
	      }).
	      when('/phones/:phoneId', {
	        templateUrl: '/aplicacion/partials/phone-detail.html',
	        controller: 'PhoneDetailCtrl'
	      }).
	      otherwise({
	      	 redirectTo: '/phones'
	      });

		$locationProvider.html5Mode({
			enabled: true,
			requireBase: false
		});
  	}
);