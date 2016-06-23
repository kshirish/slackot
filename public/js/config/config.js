(function($, angular) {

	angular.module('slackot')
		.config(['$routeProvider', function ($routeProvider) {
			
			$routeProvider
				.when('/login', {
					templateUrl: 'login.html',
					controller: 'LoginController'
				})
				.when('/', {
					templateUrl: 'home.html',
					controller: 'HomeController'
				})
				.when('/:room', {
					templateUrl: 'room.html',
					controller: 'RoomController'
				})
			    .otherwise({
			        redirectTo: '/login'
			    });
		}]);
		
})(jquery, angular);		 