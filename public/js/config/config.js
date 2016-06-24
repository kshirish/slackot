(function($, angular) {

	angular.module('appRoutes', [])
		.config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
			
			$routeProvider
				.when('/', {
					templateUrl: '/views/login.html',
					controller: 'LoginController'
				})
				.when('/home', {
					templateUrl: '/views/home.html',
					controller: 'HomeController'
				})
				.when('/notifications/:roomId', {
					templateUrl: '/views/room.html',
					controller: 'RoomController'
				})
			    .otherwise({
			        redirectTo: '/'
			    });

			$locationProvider.html5Mode(true);
		}]);
		
})(jQuery, angular);		 